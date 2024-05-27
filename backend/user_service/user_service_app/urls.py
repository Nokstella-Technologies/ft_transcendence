from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('send_message/', views.send_to_rabbitmq, name='send_message'),
    path('receive_message/', views.receive_from_rabbitmq, name='receive_message'),
]

