from user_service_app.models.user import User
from django.http import JsonResponse

class UserService:
    def __init__(self, user_dao):
        self.user_dao = user_dao

    def create_user(self, email, username, password):
        # Verifica se o usuário já existe pelo username
        if self.user_dao.filter(username=username).exists():
            return JsonResponse({'message': 'User already exists'}, status=409)

        # Verifica se o usuário já existe pelo email
        if self.user_dao.filter(email=email).exists():
            return JsonResponse({'message': 'Email already exists'}, status=409)

        # Cria o novo usuário com hashing de senha
        user = self.user_dao.create_user(username=username, email=email, password=password)
        return JsonResponse(user, status=201)

    def get_user(self, user_id):
        return self.user_dao.get_user(user_id)

    def get_all_users(self):
        return self.user_dao.get_all_users()

    def update_user(self, user_id, user):
        return self.user_dao.update_user(user_id, user)

    def delete_user(self, user_id):
        return self.user_dao.delete_user(user_id)