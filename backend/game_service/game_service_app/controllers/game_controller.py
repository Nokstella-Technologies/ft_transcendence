import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse
from .rabbitmq import channel

class GameController:
	@csrf_exempt
	def start_game(request):
		if request.method == 'POST':
			data = json.loads(request.body.decode('utf-8'))
			player_id = data['player1_id']
