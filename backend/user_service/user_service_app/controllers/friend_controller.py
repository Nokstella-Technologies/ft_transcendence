from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from user_service_app.services.user_service import UserService

# descobrir como recever um token JWT decoder pega usuario 
class FriendController:
    @staticmethod
    @csrf_exempt
    def list_friends(request):
        if request.method == 'GET':
            return res
        else :
            return JsonResponse({'message': 'Method not allowed'}, status=405)