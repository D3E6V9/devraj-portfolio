# main_app/models.py
from django.db import models
from django.utils import timezone
from django.core.validators import EmailValidator, RegexValidator

class ContactMessage(models.Model):
    """
    Enhanced model for storing contact form messages with validation
    """
    name = models.CharField(
        max_length=100,
        validators=[
            RegexValidator(
                regex=r'^[a-zA-Z\s]*$',
                message='Name must contain only letters and spaces',
                code='invalid_name'
            )
        ]
    )
    email = models.EmailField(
        validators=[EmailValidator(message='Enter a valid email address')]
    )
    message = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    is_read = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Message'
        verbose_name_plural = 'Contact Messages'
    
    def __str__(self):
        return f"Message from {self.name} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"
    
    def mark_as_read(self):
        """Mark this message as read"""
        self.is_read = True
        self.save()