# main_app/urls.py
from django.urls import path
from django.views.static import serve
import os
from django.conf import settings
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('projects/', views.projects, name='projects'),
    path('blog/', views.blog, name='blog'),
    path('threesixnine/', views.threesixnine, name='threesixnine'),
    path('threesixninepix/', views.threesixninepix, name='threesixninepix'),
    path('export-messages/', views.export_messages, name='export_messages'),  # URL for exporting messages
    
    # SEO-related paths
    path('robots.txt', serve, {
        'path': 'robots.txt',
        'document_root': os.path.join(settings.BASE_DIR, 'main_app/static')
    }),
    path('sitemap.xml', serve, {
        'path': 'sitemap.xml',
        'document_root': os.path.join(settings.BASE_DIR, 'main_app/static')
    }),
]