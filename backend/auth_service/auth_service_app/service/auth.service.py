import pika
import json
import jwt
from datetime import datetime, timedelta
from django.http import JsonResponse, HttpResponseBadRequest
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from ..rabbitmq import channel

def login_service(username, password):
	credentials = {'username': username, 'password': password}
	channel.queue_declare(queue=settings.RABBITMQ_QUEUE)
	channel.basic_publish(
        exchange='',
        routing_key=settings.RABBITMQ_QUEUE,
        body=json.dumps(credentials)
	)

	valid_credentials = authenticate_user(credentials)

	if valid_credentials:
		token = generate_jwt_token(username)
		return JsonResponse({'token': token})
	else:
		return JsonResponse({'error': 'Invalid credentials'}, status=401)

def authenticate_user(credentials):
    # Placeholder for actual RabbitMQ message handling and authentication
    # Replace this with actual RabbitMQ message consuming logic
    if credentials['username'] == 'admin' and credentials['password'] == 'password':
        return True
    return False

def generate_jwt_token(username):
    payload = {
        'username': username,
        'exp': datetime.utcnow() + timedelta(hours=1)
    }
    token = jwt.encode(payload, 'secret_key', algorithm='HS256')  # 'secret_key' should be stored securely
    return token
