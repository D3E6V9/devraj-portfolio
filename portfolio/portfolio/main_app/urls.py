# main_app/urls.py
from django.urls import path
from django.http import HttpResponse
from . import views

def sitemap_view(request):
    sitemap_content = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://devrajjoshi.com.np/</loc>
    <lastmod>2025-04-29</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://devrajjoshi.com.np/projects/</loc>
    <lastmod>2025-04-29</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://devrajjoshi.com.np/blog/</loc>
    <lastmod>2025-04-29</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://devrajjoshi.com.np/threesixnine/</loc>
    <lastmod>2025-04-29</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://devrajjoshi.com.np/threesixninepix/</loc>
    <lastmod>2025-04-29</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>"""
    return HttpResponse(sitemap_content, content_type='application/xml')

def robots_view(request):
    robots_content = """# Allow all crawlers
User-agent: *
Allow: /

# Sitemap location
Sitemap: https://devrajjoshi.com.np/sitemap.xml
"""
    return HttpResponse(robots_content, content_type='text/plain')

urlpatterns = [
    path('', views.home, name='home'),
    path('projects/', views.projects, name='projects'),
    path('blog/', views.blog, name='blog'),
    path('threesixnine/', views.threesixnine, name='threesixnine'),
    path('threesixninepix/', views.threesixninepix, name='threesixninepix'),
    path('export-messages/', views.export_messages, name='export_messages'),
    
    # SEO-related paths with direct view approach
    path('sitemap.xml', sitemap_view, name='sitemap'),
    path('robots.txt', robots_view, name='robots'),
]