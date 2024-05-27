from django.http import JsonResponse
from django.contrib.auth.hashers import make_password
from user_service_app.models.user import User
from user_service_app.models.player_stats import PlayerStats
from django.forms.models import model_to_dict
import json

class UserService:
    def create_user(self, email, username, password):
        # Verifica se o usuário já existe pelo username
        if User.objects.filter(username=username).exists():
            return JsonResponse({'message': 'User already exists'}, status=409)

        # Verifica se o usuário já existe pelo email
        if User.objects.filter(email=email).exists():
            return JsonResponse({'message': 'Email already exists'}, status=409)

        # Cria o novo usuário com hashing de senha
        user = User.objects.create(username=username, email=email, password_hash=make_password(password), status='offline')
        PlayerStats.objects.create(user_id=user)
        return JsonResponse(model_to_dict(user), status=201)

    def get_user(self, user_id):
        try:
            user = User.objects.get(user_id=user_id)
            return JsonResponse(model_to_dict(user), status=200)
        except User.DoesNotExist:
            return JsonResponse({'message': 'User not found'}, status=404)

    def get_all_users(self):
        users = User.objects.all().values()
        return JsonResponse(list(users), status=200, safe=False)

    def update_user(self, user_id, user_data):
        try:
            user = User.objects.get(id=user_id)
            user.username = user_data.get('username', user.username)
            user.profile_picture = user_data.get('profile_picture', user.profile_picture)
            user.save()
            return JsonResponse(model_to_dict(user), status=200)
        except User.DoesNotExist:
            return JsonResponse({'message': 'User not found'}, status=404)

    def delete_user(self, user_id):
        try:
            user = User.objects.get(id=user_id)
            user.delete()
            return JsonResponse({'message': 'User deleted'})
        except User.DoesNotExist:
            return JsonResponse({'message': 'User not found'}, status=404)