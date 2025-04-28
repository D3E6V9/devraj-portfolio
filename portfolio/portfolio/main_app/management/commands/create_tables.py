from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Creates required database tables manually'

    def handle(self, *args, **options):
        cursor = connection.cursor()
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS main_app_contactmessage (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(254) NOT NULL,
            message TEXT NOT NULL,
            created_at DATETIME NOT NULL,
            ip_address VARCHAR(39) NULL,
            is_read BOOL NOT NULL
        )
        ''')
        self.stdout.write(self.style.SUCCESS('Successfully created tables'))