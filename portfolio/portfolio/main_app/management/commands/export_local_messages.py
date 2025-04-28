# In portfolio/portfolio/main_app/management/commands/export_local_messages.py

from django.core.management.base import BaseCommand
import pandas as pd
from main_app.models import ContactMessage
import os
from datetime import datetime

class Command(BaseCommand):
    help = 'Export messages to a local folder'

    def add_arguments(self, parser):
        parser.add_argument('--folder', type=str, default='C:/Messages', help='Folder to save exported messages')

    def handle(self, *args, **options):
        folder = options['folder']
        
        # Create folder if it doesn't exist
        if not os.path.exists(folder):
            os.makedirs(folder)
            
        # Get all messages
        messages = ContactMessage.objects.all().order_by('-created_at')
        
        # Create DataFrame
        data = {
            'Name': [msg.name for msg in messages],
            'Email': [msg.email for msg in messages],
            'Message': [msg.message for msg in messages],
            'Date': [msg.created_at for msg in messages],
            'Read': ['Yes' if msg.is_read else 'No' for msg in messages],
            'IP Address': [msg.ip_address for msg in messages],
        }
        
        df = pd.DataFrame(data)
        
        # Save to Excel
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = os.path.join(folder, f"contact_messages_{timestamp}.xlsx")
        
        df.to_excel(filename, index=False)
        self.stdout.write(self.style.SUCCESS(f'Successfully exported messages to {filename}'))