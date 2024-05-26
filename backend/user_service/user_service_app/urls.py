from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('send_message/', views.send_message_to_queue, name='send_message'),
    # path('receive_message/', views.receive_message_from_queue, name='receive_message'),
]

