
from django.db import models
import uuid

class User(models.Model):
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_auth = models.BooleanField(default=False)
    profile_picture = models.TextField(null=True, blank=True)
    status = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.username