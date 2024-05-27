from django.urls import path
from . import views
from user_service_app.controllers.user_controller import UserController

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('create/', UserController().register, name='get_user'),
    path('findById/<uuid:id>', UserController().get_user, name='get_user'),
    path('get_all_users/', UserController().get_all_user, name='get_all_users'),
    path('send_message/', views.send_to_rabbitmq, name='send_message'),
    path('receive_message/', views.receive_from_rabbitmq, name='receive_message'),
]

