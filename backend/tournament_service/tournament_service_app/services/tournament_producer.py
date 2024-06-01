from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse, HttpResponseBadRequest
from ..rabbitmq import connection, channel
from ..models.tournament import Tournament, TournamentGame, TournamentParticipant
from ..services.tournament_service import create_tournament_games
import json
import pika
import uuid

def publish_game_to_game_service(games):
	channel.queue_declare(queue='TOURNAMENT_GAME')

	for game in games:
		message = {
            'action': 'create_game',
            'game_id': str(game['game_id']),
            'player1_id': str(game['player1_id']),
            'player2_id': str(game['player2_id']) if game['player2_id'] else None,
            'start_time': '2024-06-01T00:00:00Z',
            'end_time': '2024-06-01T01:00:00Z',
            'status': game.get('status', 'pending'),
            'type': 'tournament'
        }
		channel.basic_publish(
			exchange='',
			routing_key='TOURNAMENT_GAME',
			body=json.dumps(message)
		)
	connection.close()
