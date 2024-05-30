from django.urls import path
from .controllers.auth_controller import login

urlpatterns = [
	path('login/', login, name='login'),
]
