from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from user_service_app.services.user_service import UserService

class UserController:
    @staticmethod
    @csrf_exempt
    def register_user( request):
        if request.method == 'POST':
            data = json.loads(request.body.decode('utf-8'))
            res = UserService().create_user(data['email'], data['username'], data['password'])
            return res
        else :
            return JsonResponse({'message': 'Method not allowed'}, status=405)
        
    @staticmethod
    @csrf_exempt
    def get_user(request, id):
        if request.method == 'GET':
            return UserService().get_user(id)
        else:
            return JsonResponse({'message': 'Method not allowed'}, status=405)
        
    @staticmethod
    @csrf_exempt
    def get_all_user(request):
        if request.method == 'GET':
            return UserService().get_all_users()
        else:
            return JsonResponse({'message': 'Method not allowed'}, status=405)

    @staticmethod
    @csrf_exempt
    def update_user(request, id):
        if request.method == 'PUT':
            data = json.loads(request.body.decode('utf-8'))
            return UserService().update_user(id, data)
        else:
            return JsonResponse({'message': 'Method not allowed'}, status=405)
    
    @staticmethod
    @csrf_exempt
    def delete_user(request, id):
        if request.method == 'DELETE':
            return UserService().delete_user(id)
        else:
            return JsonResponse({'message': 'Method not allowed'}, status=405)