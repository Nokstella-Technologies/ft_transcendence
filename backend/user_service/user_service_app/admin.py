# backend/user_service/user_service_app/admin.py

from django.contrib import admin
from .models import User, UserFriends, PlayerStats

admin.site.register(User)
admin.site.register(UserFriends)
admin.site.register(PlayerStats)
