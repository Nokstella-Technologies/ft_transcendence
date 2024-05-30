import json
import jwt
import pika
from datetime import datetime, timedelta
from django.http import JsonResponse, HttpResponseBadRequest
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def login(request):
    if request.method != 'POST':
        return HttpResponseBadRequest("Only POST requests are allowed")
    else:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return JsonResponse({'error': 'Username and password are required'}, status=400)
        return login_service(username, password)
