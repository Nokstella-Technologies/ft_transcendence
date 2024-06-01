import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse, HttpResponseBadRequest
from ..rabbitmq import channel
from ..services.game_producer import send_to_queue

@csrf_exempt
def update_game(request, id):
	if request.method == 'PUT':
		data = json.loads(request.body.decode('utf-8'))
		score_player1 = data['score_player1']
		score_player2 = data['score_player2']
		end = data['end']
		if not score_player1 or not score_player2:
			return JsonResponse({"Error": "Score games are required."}, status=400)
		message={
			"action": "update_game",
			"score_player1": score_player1,
			"score_player2": score_player2,
			"id": str(id),
			"end": end
		}
		response = send_to_queue("START_GAME", message)
		return JsonResponse(response)
	else:
		return HttpResponseBadRequest("Only POST request are allowed.")
