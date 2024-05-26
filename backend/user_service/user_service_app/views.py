from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login

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
        login(request, user)
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
