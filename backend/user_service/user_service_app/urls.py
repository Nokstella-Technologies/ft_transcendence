from django.urls import path
from . import views
from user_service_app.controllers.user_controller import UserController
from user_service_app.controllers.friend_controller import FriendController
from .controllers.two_fa_controller import qr_generator

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('create/', UserController().register_user, name='get_user'),
    path('update/<uuid:id>/', UserController().update_user, name='update_user'),
    path('delete/<uuid:id>/', UserController().delete_user, name='delete_user'),
    path('findById/<uuid:id>/', UserController().get_user, name='get_user'),
    path('get_all_users/', UserController().get_all_user, name='get_all_users'),
    path('send_message/', views.send_to_rabbitmq, name='send_message'),
    path('receive_message/', views.receive_from_rabbitmq, name='receive_message'),
    path('2fa_qrcode/', qr_generator, name='qr_generator'),
    path('list_friends/<uuid:id>/', FriendController().list_friends, name='list_friend'),
    path('add_friend/<uuid:id>/', FriendController().add_friend, name='add_friend'),
	path('accept_friend/<uuid:id>/', FriendController.accept_friend, name='accept_friend'),
    path('remove_friend/<uuid:id>/', FriendController().remove_friend, name='remove_friend'),
    path('search_user/', FriendController().search_user, name='search_user'),

]

