from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from .rabbitmq import channel
from .rabbitmq import connection
import pika
import json


def register(request):
    if request.method == 'GET':
        return render(request, 'register.html')
    elif request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')

        # Verifica se o usuário já existe pelo username
        if User.objects.filter(username=username).exists():
            return HttpResponse('User already exists')

        # Verifica se o usuário já existe pelo email
        if User.objects.filter(email=email).exists():
            return HttpResponse('User already exists')

        # Cria o novo usuário com hashing de senha
        user = User.objects.create_user(username=username, email=email, password=password)
        return HttpResponse(f"Usuário {username} registrado com sucesso!")


def login(request):
    if request.method == 'GET':
        return render(request, 'login.html')
    elif request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        # Adicionando mensagens de depuração
        print(f"Tentativa de login com username: {username} e senha: {password}")

        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                return HttpResponse('Login success')
            else:
                return HttpResponse('Disabled account')
        else:
            print("Autenticação falhou para username:", username)
            return HttpResponse('Invalid login credentials')

@csrf_exempt
def send_to_rabbitmq(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            message = json.dumps(data)
            channel.queue_declare(queue="user", durable=True)
            channel.basic_publish(
                exchange='',
                routing_key="user",
                body=message,
                properties=pika.BasicProperties(
                delivery_mode=2,  # make message persistent
            ))
            return JsonResponse({'status': 'success', 'data': data}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid method'}, status=405)

@csrf_exempt
def receive_from_rabbitmq(request):
    if request.method == 'GET':
        try:
            method_frame, header_frame, body = channel.basic_get(queue='user', auto_ack=True)
            if method_frame:
                print(f" [x] Received {body.decode('utf-8')}")
                return JsonResponse({'status': 'success', 'data': body.decode('utf-8')}, status=200)
            else:
                return JsonResponse({'status': 'empty', 'message': 'No messages in queue'}, status=200)
        except Exception as e:
            print(f"Error receivi   ng message: {e}")
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    else:
        return HttpResponse(status=405)



def callback(ch, method, properties, body):
    print(f" [x] Received {body}")
    channel = connection.channel()
    channel.queue_declare(queue='user')

    channel.basic_consume(queue='user', on_message_callback=callback, auto_ack=True)

    print(' [*] Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()