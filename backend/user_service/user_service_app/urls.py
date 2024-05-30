from django.urls import path
from . import views
from user_service_app.controllers.user_controller import UserController
from .controllers.two_fa_controller import qr_generator

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('create/', UserController().register_user, name='get_user'),
    path('update/<uuid:id>', UserController().update_user, name='update_user'),
    path('delete/<uuid:id>', UserController().delete_user, name='delete_user'),
    path('findById/<uuid:id>', UserController().get_user, name='get_user'),
    path('get_all_users/', UserController().get_all_user, name='get_all_users'),
    path('send_message/', views.send_to_rabbitmq, name='send_message'),
    path('receive_message/', views.receive_from_rabbitmq, name='receive_message'),
    path('2fa_qrcode/', qr_generator, name='qr_generator'),
    # path('list_friends/', UserController().list_friends, name='list_friend'),
    # path('add_friend/<uuid:id>', UserController().add_friend, name='add_friend'),
    # path('remove_friend/<uuid:id>', UserController().remove_friend, name='remove_friend'),
    # path('search_friend/', UserController().search_friend, name='search_friend'),
    # path('search_user/', UserController().search_user, name='search_user'),
]

