from django.urls import path
from .controllers.auth_controller import login, verify_jwt_token

urlpatterns = [
	path('login', login, name='login'),
    path('authorized', verify_jwt_token, name='authorized')
]
