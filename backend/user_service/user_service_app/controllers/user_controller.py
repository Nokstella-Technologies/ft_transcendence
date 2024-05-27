from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from user_service_app.services.user_service import UserService

class UserController:
    @staticmethod
    @csrf_exempt
    def register( request):
        if request.method == 'POST':
            data = json.loads(request.body.decode('utf-8'))
            res = UserService.user_service.create_user(data['email'], data['username'], data['password'])
            return res
        else :
            return JsonResponse({'message': 'Method not allowed'}, status=405)
        
    @staticmethod
    @csrf_exempt
    def get_user(request, user_id):
        if request.method == 'GET':
            res = UserService.user_service.get_user(user_id)
            return res
        else:
            return JsonResponse({'message': 'Method not allowed'}, status=405)