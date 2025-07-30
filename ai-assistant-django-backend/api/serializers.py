from rest_framework import serializers
from .models import QueryHistory, UserFeedback, APIUsageStats

class QueryRequestSerializer(serializers.Serializer):
    function_type = serializers.ChoiceField(choices=[
        'question_answering',
        'text_summarization', 
        'creative_generation'
    ])
    style = serializers.CharField(max_length=50)
    query = serializers.CharField()

class QueryResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = QueryHistory
        fields = ['id', 'function_type', 'style', 'query', 'response', 'processing_time', 'created_at']

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFeedback
        fields = ['id', 'function_type', 'query', 'response', 'rating', 'suggestions', 'created_at']
        
    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value

class FeedbackStatsSerializer(serializers.Serializer):
    total_feedback = serializers.IntegerField()
    average_rating = serializers.FloatField()
    function_stats = serializers.DictField()

class StylesSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    description = serializers.CharField()

class HealthCheckSerializer(serializers.Serializer):
    status = serializers.CharField()
    message = serializers.CharField()
    version = serializers.CharField()
    django_version = serializers.CharField()
