# main_app/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('projects/', views.projects, name='projects'),
    path('blog/', views.blog, name='blog'),
    path('threesixnine/', views.threesixnine, name='threesixnine'),
    path('threesixninepix/', views.threesixninepix, name='threesixninepix'),
    path('export-messages/', views.export_messages, name='export_messages'),  # New URL for exporting messages
]