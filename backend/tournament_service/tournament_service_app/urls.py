from django.urls import path
from .controllers.tournament_controller import start_tournament

urlpatterns = [
	path('/', start_tournament, name='start_tournament'),
]
