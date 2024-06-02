from django.urls import path
from .controllers.tournament_controller import create_tournament, add_participants

urlpatterns = [
	# criar rota de criacao de torneio
	# criar rota de adicionar player ao torneio
	# path('/', start_tournament, name='start_tournament'),
	path('tournament/', create_tournament, name='create_tournament'),
	path('<uuid:tournament_id>/participants', add_participants, name='add_participant'),
]
