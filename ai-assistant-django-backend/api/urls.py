from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health_check, name='health_check'),
    path('cors-test/', views.cors_test, name='cors_test'),  # ← ADD THIS

    path('query/', views.handle_query, name='handle_query'),
    path('feedback/', views.handle_feedback, name='handle_feedback'),
    path('feedback-stats/', views.get_feedback_stats, name='get_feedback_stats'),
    path('styles/<str:function_type>/', views.get_available_styles, name='get_available_styles'),
    path('history/', views.get_query_history, name='get_query_history'),
]
