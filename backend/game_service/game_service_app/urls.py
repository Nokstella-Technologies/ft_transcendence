from django.urls import path
from .controllers.game_controller import start_game

urlpatterns = [
	path('start_game/', start_game, name='start_game'),
]
