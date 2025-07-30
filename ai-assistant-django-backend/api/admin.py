from django.contrib import admin

from .models import QueryHistory, UserFeedback, APIUsageStats

@admin.register(QueryHistory)
class QueryHistoryAdmin(admin.ModelAdmin):
    list_display = ['function_type', 'style', 'created_at', 'processing_time']
    list_filter = ['function_type', 'style', 'created_at']
    search_fields = ['query', 'response']
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related()

@admin.register(UserFeedback)
class UserFeedbackAdmin(admin.ModelAdmin):
    list_display = ['function_type', 'rating', 'created_at']
    list_filter = ['function_type', 'rating', 'created_at']
    search_fields = ['query', 'response', 'suggestions']
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'

@admin.register(APIUsageStats)
class APIUsageStatsAdmin(admin.ModelAdmin):
    list_display = ['function_type', 'date', 'total_queries', 'avg_rating']
    list_filter = ['function_type', 'date']
    date_hierarchy = 'date'