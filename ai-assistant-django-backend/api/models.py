from django.db import models
from django.utils import timezone
import json
# Create your models here.

class QueryHistory(models.Model):
    FUNCTION_CHOICES = [
        ('question_answering', 'Question Answering'),
        ('text_summarization', 'Text Summarization'),
        ('creative_generation', 'Creative Generation'),
    ]
    
    STYLE_CHOICES = [
        # Question Answering styles
        ('factual', 'Factual & Direct'),
        ('analytical', 'Analytical & Detailed'),
        ('educational', 'Educational & Teaching'),
        
        # Text Summarization styles
        ('concise', 'Concise Paragraph'),
        ('bullet_points', 'Bullet Points'),
        ('executive', 'Executive Summary'),
        
        # Creative Generation styles
        ('storytelling', 'Creative Storytelling'),
        ('professional', 'Professional Content'),
        ('innovative', 'Innovative & Unique'),
    ]
    
    function_type = models.CharField(max_length=50, choices=FUNCTION_CHOICES)
    style = models.CharField(max_length=50, choices=STYLE_CHOICES)
    query = models.TextField()
    response = models.TextField()
    processing_time = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.function_type} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"

class UserFeedback(models.Model):
    RATING_CHOICES = [(i, i) for i in range(1, 6)]
    
    query_history = models.ForeignKey(
        QueryHistory, 
        on_delete=models.CASCADE, 
        related_name='feedbacks',
        null=True, 
        blank=True
    )
    function_type = models.CharField(max_length=50)
    query = models.TextField()
    response = models.TextField()
    rating = models.IntegerField(choices=RATING_CHOICES)
    suggestions = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Feedback - Rating: {self.rating} - {self.created_at.strftime('%Y-%m-%d')}"

class APIUsageStats(models.Model):
    date = models.DateField(default=timezone.now)
    function_type = models.CharField(max_length=50)
    total_queries = models.IntegerField(default=0)
    avg_processing_time = models.FloatField(default=0.0)
    avg_rating = models.FloatField(default=0.0)
    
    class Meta:
        unique_together = ['date', 'function_type']
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.function_type} - {self.date}"
