from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse, HttpResponseBadRequest
from ..rabbitmq import channel
from ..models.tournament import Tournament, TournamentGame, TournamentParticipant
import requests
import json
import pika
import uuid

@csrf_exempt
def start_tournament(request, tournament_id):
    if request.method == 'POST':
        try:
            tournament = Tournament.objects.get(tournament_id=tournament_id)
            participants = TournamentParticipant.objects.filter(tournament_id=tournament_id)
            if not participants.exists():
                return JsonResponse({"Error": "No participants in the tournament"}, status=400)
            tournament.status='ongoing'
            tournament.save()
            games = create_tournament_game(tournament, participants)
            publish_game_to_game_service(game)
            return JsonResponse ({'Status': 'Tournament started successfully.'}, status=200)
        except Tournament.DoesNotExist:
            JsonResponse ({'Error': 'Tournament not found'}, status=404)
    return JsonResponse ({'Error': 'Method not allowed'}, status=405)
