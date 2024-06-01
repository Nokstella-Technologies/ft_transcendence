from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse, HttpResponseBadRequest
from ..models.tournament import Tournament, TournamentGame, TournamentParticipant
from ..services.tournament_service import create_tournament_games
from ..services.tournament_producer import publish_game_to_game_service

@csrf_exempt
def start_tournament(request, tournament_id):
    if request.method == 'POST':
        try:
            tournament = Tournament.objects.get(tournament_id=tournament_id)
            participants = TournamentParticipant.objects.filter(tournament_id=tournament_id)

            if not participants.exists():
                return JsonResponse({'error': 'No participants in the tournament'}, status=400)
            num_participants = participants.count()
            if num_participants < 3 or num_participants > 8:
                return JsonResponse({'error': 'The tournament must have between 3 and 8 participants'}, status=400)
# chama a rota de adicionar player -> no header de auth tem o jwt nele te o user_id 

            tournament.status = 'ongoing'
            tournament.save()

            games = create_tournament_games(tournament, participants)
            publish_game_to_game_service(games)

            return JsonResponse({'status': 'Tournament started successfully'})

        except Tournament.DoesNotExist:
            return JsonResponse({'error': 'Tournament not found'}, status=404)
    return JsonResponse({'error': 'Invalid request method'}, status=405)
