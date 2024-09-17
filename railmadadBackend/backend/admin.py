from django.contrib import admin
from .models import Complaint

@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ('id', 'description', 'priority', 'file', 'file_type')
    search_fields = ('description', 'priority')
    list_filter = ('priority',)
    readonly_fields = ('file_type',)
