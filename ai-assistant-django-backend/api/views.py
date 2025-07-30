from django.shortcuts import render
import django
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Avg, Count
from django.utils import timezone
from datetime import datetime
from .models import QueryHistory, UserFeedback, APIUsageStats
from .serializers import (
    QueryRequestSerializer, QueryResponseSerializer, 
    FeedbackSerializer, FeedbackStatsSerializer, StylesSerializer,
    HealthCheckSerializer
)
from .utils import GeminiClient, AdvancedPromptEngine
# Create your views here.
try:
    gemini_client = GeminiClient()
except ValueError as e:
    gemini_client = None
    print(f"Warning: {e}")

@api_view(['GET'])
def health_check(request):
    """Health check endpoint"""
    data = {
        'status': 'healthy',
        'message': 'AI Assistant Django API is running',
        'version': '2.0',
        'django_version': django.get_version()
    }
    serializer = HealthCheckSerializer(data)
    return Response(serializer.data)

@api_view(['POST'])
def handle_query(request):
    """Handle AI query requests"""
    serializer = QueryRequestSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if not gemini_client:
        return Response({
            'success': False,
            'error': 'Gemini API client not initialized. Check your API key.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    try:
        function_type = serializer.validated_data['function_type']
        style = serializer.validated_data['style']
        query = serializer.validated_data['query']
        
        # Get optimized prompt
        prompt = AdvancedPromptEngine.get_prompt(function_type, style, query)
        
        # Generate response using Gemini
        result = gemini_client.generate_content(prompt)
        
        if result['success']:
            # Save to database
            query_history = QueryHistory.objects.create(
                function_type=function_type,
                style=style,
                query=query,
                response=result['content'],
                processing_time=result.get('processing_time', 0)
            )
            
            # Return response in format that React expects
            return Response({
                'success': True,
                'response': result['content'],  # ← ADD THIS for React compatibility
                'data': {
                    'id': query_history.id,
                    'function_type': function_type,
                    'style': style,
                    'query': query,
                    'response': result['content'],
                    'processing_time': result.get('processing_time', 0),
                    'created_at': query_history.created_at.isoformat()
                }
            })
        else:
            return Response({
                'success': False,
                'error': result['error']
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def handle_feedback(request):
    """Handle feedback submission"""
    serializer = FeedbackSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        feedback = serializer.save()
        
        return Response({
            'success': True,
            'message': 'Feedback submitted successfully',
            'data': FeedbackSerializer(feedback).data
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_feedback_stats(request):
    """Get feedback statistics"""
    try:
        feedbacks = UserFeedback.objects.all()
        
        if not feedbacks.exists():
            return Response({
                'success': True,
                'data': {'message': 'No feedback data available yet.'}
            })
        total_feedback = feedbacks.count()
        avg_rating = feedbacks.aggregate(Avg('rating'))['rating__avg']
        function_stats = {}
        for function_type in ['question_answering', 'text_summarization', 'creative_generation']:
            func_feedbacks = feedbacks.filter(function_type=function_type)
            if func_feedbacks.exists():
                function_stats[function_type] = {
                    'count': func_feedbacks.count(),
                    'avg_rating': round(func_feedbacks.aggregate(Avg('rating'))['rating__avg'], 2)
                }
        
        stats_data = {
            'total_feedback': total_feedback,
            'average_rating': round(avg_rating, 2) if avg_rating else 0,
            'function_stats': function_stats
        }
        
        return Response({
            'success': True,
            'data': stats_data
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_available_styles(request, function_type):
    """Get available styles for a function type"""
    try:
        styles = AdvancedPromptEngine.get_available_styles(function_type)
        
        if not styles:
            return Response({
                'success': False,
                'error': 'Invalid function type'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'success': True,
            'styles': styles
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_query_history(request):
    """Get query history with pagination"""
    try:
        queries = QueryHistory.objects.all()
        page_size = request.GET.get('page_size', 10)
        page = request.GET.get('page', 1)
        
        try:
            page_size = int(page_size)
            page = int(page)
        except ValueError:
            page_size = 10
            page = 1
        
        start = (page - 1) * page_size
        end = start + page_size
        
        paginated_queries = queries[start:end]
        total_count = queries.count()
        
        serializer = QueryResponseSerializer(paginated_queries, many=True)
        
        return Response({
            'success': True,
            'data': {
                'results': serializer.data,
                'total_count': total_count,
                'page': page,
                'page_size': page_size,
                'has_next': end < total_count,
                'has_previous': page > 1
            }
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['GET', 'POST', 'OPTIONS'])
def cors_test(request):
    """Test CORS configuration"""
    return Response({
        'success': True,
        'message': 'CORS is working!',
        'method': request.method,
        'origin': request.META.get('HTTP_ORIGIN', 'No origin header')
    })
