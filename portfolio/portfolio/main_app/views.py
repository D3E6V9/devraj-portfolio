# main_app/views.py
from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import HttpResponse
from django.contrib.admin.views.decorators import staff_member_required
from .models import ContactMessage
import os
from django.conf import settings
import pandas as pd
from datetime import datetime

def home(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        message = request.POST.get('message')
        
        # Store the message in the database
        ContactMessage.objects.create(
            name=name,
            email=email,
            message=message,
            ip_address=get_client_ip(request)  # Added IP capture
        )
        
        # Add a success message
        messages.success(request, "Thank you! Your message has been received.")
        return redirect('home')
        
    return render(request, 'home.html')

def projects(request):
    return render(request, 'projects.html')

def blog(request):
    return render(request, 'blog.html')

def threesixnine(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        message = request.POST.get('message')
        
        # Store the message in the database
        ContactMessage.objects.create(
            name=name,
            email=email,
            message=message,
            ip_address=get_client_ip(request)  # Added IP capture
        )
        
        # Add a success message
        messages.success(request, "Thank you! Your message has been received.")
        return redirect('threesixnine')
        
    return render(request, 'threesixnine.html')

def threesixninepix(request):
    """View function for the ThreeSixNinePix gallery page with grouped images in subfolders."""
    
    # Get the path to the images base directory
    static_dir = None
    if hasattr(settings, 'STATICFILES_DIRS') and settings.STATICFILES_DIRS:
        static_dir = settings.STATICFILES_DIRS[0]
    else:
        # Fallback to a common structure if STATICFILES_DIRS is not defined
        static_dir = os.path.join(settings.BASE_DIR, 'main_app', 'static')
    
    images_base_dir = os.path.join(static_dir, 'images', 'threesixnine')
    
    # Default themes/captions for the main gallery items
    themes = [
        {"id": "creative_vision", "title": "Creative Vision", "description": "Exploring the boundaries of visual perception and digital aesthetics through innovative compositions."},
        {"id": "digital_patterns", "title": "Digital Patterns", "description": "The harmony of technology and design creates mesmerizing visual patterns that captivate the imagination."},
        {"id": "abstract_thoughts", "title": "Abstract Thoughts", "description": "Visual representation of complex ideas through the lens of abstract photography and digital manipulation."},
        {"id": "tech_poetry", "title": "Technological Poetry", "description": "Where technology meets artistic expression, creating a visual language that speaks to the digital age."},
        {"id": "future_visions", "title": "Future Visions", "description": "Glimpses into possibilities ahead through futuristic imagery and forward-thinking visual concepts."},
        {"id": "digital_dreams", "title": "Digital Dreams", "description": "Exploring the digital aesthetic landscape where imagination and technology create dreamlike worlds."},
        {"id": "neon_horizons", "title": "Neon Horizons", "description": "Vibrant color explorations inspired by urban nightscapes and digital culture."},
        {"id": "quantum_pixels", "title": "Quantum Pixels", "description": "Breaking down digital imagery to its fundamental elements, exploring the beauty of pixels."},
        {"id": "cyberspace", "title": "Cyberspace Echoes", "description": "Visual representation of digital spaces and the memories they contain."},
    ]
    
    # Supported image extensions
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']
    
    # Structure to hold all gallery data
    gallery_data = []
    
    # Check if base directory exists
    if not os.path.exists(images_base_dir):
        # Return empty gallery if base directory doesn't exist
        return render(request, 'threesixninepix.html', {'gallery_data': gallery_data})
    
    # Check for two possible directory structures:
    # 1. Using theme-named folders (preferred)
    # 2. Using all images directly in the threesixnine folder (fallback)
    
    # First, check for subfolders structure
    subfolders = [f for f in os.listdir(images_base_dir) 
                 if os.path.isdir(os.path.join(images_base_dir, f))]
    
    if subfolders:
        # Using theme-based subfolders
        for i, folder in enumerate(subfolders):
            folder_path = os.path.join(images_base_dir, folder)
            
            # Get all image files in this folder
            image_files = [f for f in os.listdir(folder_path) 
                         if any(f.lower().endswith(ext) for ext in image_extensions)]
            
            # If folder has images, add it to the gallery
            if image_files:
                # Get the theme title and description
                # If the subfolder name matches a predefined theme ID, use that theme's data
                # Otherwise, use the folder name as the title
                theme_data = next((theme for theme in themes if theme["id"] == folder.lower()), None)
                
                if theme_data:
                    title = theme_data["title"]
                    description = theme_data["description"]
                else:
                    # Create a title from the folder name (convert snake_case or kebab-case to Title Case)
                    title = " ".join(word.capitalize() for word in folder.replace("-", "_").split("_"))
                    description = f"A collection of images showcasing {title.lower()}."
                
                # Get the first image to display as the category thumbnail
                thumbnail = f'images/threesixnine/{folder}/{image_files[0]}'
                
                # Create a list of all images in this folder
                images = [f'images/threesixnine/{folder}/{image}' for image in image_files]
                
                # Add to gallery data
                gallery_data.append({
                    "id": folder,
                    "title": title,
                    "description": description,
                    "thumbnail": thumbnail,
                    "images": images,
                    "index": i
                })
    else:
        # Fallback: No subfolders, using all images directly in threesixnine folder
        image_files = [f for f in os.listdir(images_base_dir) 
                     if any(f.lower().endswith(ext) for ext in image_extensions)]
        
        if image_files:
            # Create a single gallery category with all images
            gallery_data.append({
                "id": "gallery",
                "title": "Photo Gallery",
                "description": "A collection of visual explorations and creative photography.",
                "thumbnail": f'images/threesixnine/{image_files[0]}',
                "images": [f'images/threesixnine/{image}' for image in image_files],
                "index": 0
            })
    
    # Pass the gallery data to the template
    context = {
        'gallery_data': gallery_data
    }
    
    return render(request, 'threesixninepix.html', context)

def get_client_ip(request):
    """Helper function to get client IP address"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

@staff_member_required
def export_messages(request):
    """Export all contact messages as an Excel file"""
    # Get all messages from the database
    all_messages = ContactMessage.objects.all().order_by('-created_at')
    
    # Create a DataFrame with the message data
    data = {
        'Name': [msg.name for msg in all_messages],
        'Email': [msg.email for msg in all_messages],
        'Message': [msg.message for msg in all_messages],
        'Date Received': [msg.created_at for msg in all_messages],
        'Read Status': ['Read' if msg.is_read else 'Unread' for msg in all_messages],
        'IP Address': [msg.ip_address for msg in all_messages],
    }
    
    df = pd.DataFrame(data)
    
    # Create a response with the Excel file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"contact_messages_{timestamp}.xlsx"
    
    response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    
    # Write the DataFrame to Excel
    df.to_excel(response, index=False, engine='openpyxl')
    
    return response