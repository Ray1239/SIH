from django.contrib import admin
from .models import Complaint

@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ('id', 'PNR', 'analysis', 'sentiment', 'metadata', 'is_processed', 'latitude', 'longitude', 'file', 'file_type')
    search_fields = ('description', 'priority')
    list_filter = ('priority',)
    readonly_fields = ('file_type',)
