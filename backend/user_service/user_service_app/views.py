from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from .rabbitmq import channel
import pika
from .rabbitmq import connection


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


def send_message_to_queue(request):
    if request.method == 'POST':
        channel.basic_publish(exchange='', routing_key='user', body=request.body)
        print(f" [x] Sent '{request}'")
    return HttpResponse(status=405)

# def receive_message_from_queue(message):
#     channel.basic_publish(exchange='', routing_key='hello', body=message)
#     print(f" [x] Sent '{message}'")


def callback(ch, method, properties, body):
    print(f" [x] Received {body}")
    channel = connection.channel()
    channel.queue_declare(queue='hello')

    channel.basic_consume(queue='hello', on_message_callback=callback, auto_ack=True)

    print(' [*] Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()