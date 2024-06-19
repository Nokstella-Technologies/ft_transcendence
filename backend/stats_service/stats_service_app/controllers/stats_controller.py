from django.forms import model_to_dict
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from ..models import GameStats, TournamentStats
import json

@csrf_exempt
def update_stats(request):
    if request.method == 'POST':
        try:
            print(f"Request body: {request.body.decode('utf-8')}")
            data = json.loads(request.body.decode('utf-8'))
            stats_type = data.get('type')

            if stats_type == 'game':
                game_id = data.get('game_id')
                player1_id = data.get('player1_id')
                player2_id = data.get('player2_id')
                score_player1 = data.get('score_player1')
                score_player2 = data.get('score_player2')

             # Log parsed values
                print(f"Parsed values - game_id: {game_id}, player1_id: {player1_id}, player2_id: {player2_id}, score_player1: {score_player1}, score_player2: {score_player2}")


                game_stats, created = GameStats.objects.get_or_create(game_id=game_id, player1_id=player1_id, player2_id=player2_id, score_player1=score_player1, score_player2=score_player2)
                print(f"Game stats: {game_stats} created: {created}")
                game_stats.player1_id = player1_id
                game_stats.player2_id = player2_id
                game_stats.score_player1 = score_player1
                game_stats.score_player2 = score_player2
                game_stats.save()

                res = model_to_dict(game_stats)

            elif stats_type == 'tournament':
                tournament_id = data.get('tournament_id')
                game_id = data.get('game_id')
                player1_id = data.get('player1_id')
                player2_id = data.get('player2_id')
                winner = data.get('winner')
                round_number = data.get('round_number')

                tournament_stats, created = TournamentStats.objects.get_or_create(game_id=game_id)
                tournament_stats.tournament_id = tournament_id
                tournament_stats.player1_id = player1_id
                tournament_stats.player2_id = player2_id
                tournament_stats.winner = winner
                tournament_stats.round_number = round_number
                tournament_stats.save()

                res = model_to_dict(tournament_stats)

            else:
                return JsonResponse({'error': 'Invalid stats type'}, status=400)

            return JsonResponse({'message': 'Stats updated successfully', 'data': res}, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)
