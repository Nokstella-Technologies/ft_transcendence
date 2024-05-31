from django.db import models
from .user import User
import uuid

class UserFriends(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.ForeignKey(User, related_name='friends', on_delete=models.CASCADE)
    invited_user_id = models.UUIDField()
    status = models.CharField(max_length=50)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user_id} - {self.invited_user_id}"
