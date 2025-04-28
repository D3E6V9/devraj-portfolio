# main_app/admin.py
from django.contrib import admin
from django.http import HttpResponseRedirect
from django.urls import reverse
from .models import ContactMessage

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at', 'is_read')
    list_filter = ('is_read', 'created_at')
    search_fields = ('name', 'email', 'message')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'ip_address')
    
    actions = ['mark_as_read', 'export_as_excel']
    
    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
    mark_as_read.short_description = "Mark selected messages as read"
    
    def export_as_excel(self, request, queryset):
        return HttpResponseRedirect(reverse('export_messages'))
    export_as_excel.short_description = "Export all messages as Excel"