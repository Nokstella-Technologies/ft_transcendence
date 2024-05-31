from django.urls import path
from .controllers.auth_controller import login, verify_jwt_token, oauth_callback

urlpatterns = [
	path('login/', login, name='login'),
    path('authorized/', verify_jwt_token, name='authorized'),
	path('oauth2/authorize/', oauth_callback, name='oauth2_authorize')
]
