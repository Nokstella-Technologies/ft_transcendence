from django.urls import path
from .controllers.game_controller import start_game, get_game
from .controllers.update_controller import update_game

urlpatterns = [
	path('start_game/', start_game, name='start_game'),
	path('update_game/<uuid:id>/', update_game, name='update_game'),
    path('get_game/<uuid:id>/', get_game, name='update_game')
]
