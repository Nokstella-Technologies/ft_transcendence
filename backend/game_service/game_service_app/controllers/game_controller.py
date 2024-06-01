import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse, HttpResponseBadRequest
from ..rabbitmq import channel
from ..services.game_producer import send_to_queue

@csrf_exempt
def start_game(request):
	if request.method == 'POST':
		data = json.loads(request.body.decode('utf-8'))
		player1_id = data['player1_id']
		player2_id = data['player2_id']
		type = data['type']
		if not player1_id or not player2_id:
			return JsonResponse({"Error": "Both players are required."}, status=400)
		message={
			"action": "start_game",
			"player1_id": player1_id,
			"player2_id": player2_id,
			"type": type
		}
		response = send_to_queue("START_GAME", message)
		return JsonResponse(response)
	else:
		return HttpResponseBadRequest("Only POST request are allowed.")
