# backend/user_service/user_service_app/models.py

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
    

class UserFriends(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.ForeignKey(User, related_name='friends', on_delete=models.CASCADE)
    invited_user_id = models.UUIDField()
    status = models.CharField(max_length=50)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user_id} - {self.invited_user_id}"

class PlayerStats(models.Model):
    stats_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.ForeignKey(User, related_name='stats', on_delete=models.CASCADE)
    games_played = models.IntegerField(default=0)
    games_won = models.IntegerField(default=0)
    games_lost = models.IntegerField(default=0)
    total_score = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user_id} - Stats"

