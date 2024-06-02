from django.forms import model_to_dict
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse, HttpResponseBadRequest
from ..models.tournament import Tournament, TournamentParticipant
from ..utils.jwt import get_payload

# from ..services.tournament_producer import publish_game_to_game_service
# import json

# @csrf_exempt
# def start_tournament(request, tournament_id):
#     if request.method == 'POST':
#         try:
#             tournament = Tournament.objects.get(tournament_id=tournament_id)
#             participants = TournamentParticipant.objects.filter(tournament_id=tournament_id)

#             if not participants.exists():
#                 return JsonResponse({'error': 'No participants in the tournament'}, status=400)
#             num_participants = participants.count()
#             if num_participants < 3 or num_participants > 8:
#                 return JsonResponse({'error': 'The tournament must have between 3 and 8 participants'}, status=400)
# # chama a rota de adicionar player -> no header de auth tem o jwt nele te o user_id 

#             tournament.status = 'ongoing'
#             tournament.save()

#             games = create_tournament_games(tournament, participants)
#             publish_game_to_game_service(games)

#             return JsonResponse({'status': 'Tournament started successfully'})

#         except Tournament.DoesNotExist:
#             return JsonResponse({'error': 'Tournament not found'}, status=404)
#     return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def create_tournament(request):
    if request.method == 'POST':
        try:
            user_id = get_payload(request, 'user')
            tournament = Tournament.objects.create(status='Created')
            tp = TournamentParticipant.objects.create(tournament=tournament, user_id=user_id)
            print(tournament)
            res = model_to_dict(tournament)
            res['id'] = str(tournament.id)
            res['participants'] = [model_to_dict(tp)]
            return JsonResponse ({'tournament': res}, status=201)
        except Exception as e:
            return JsonResponse ({'Error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def add_participants(request, id):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    user_id = get_payload(request, 'user')
    if user_id is None:
        return JsonResponse({'Error': 'Invalid user id'},status=401)
    try:
        tournament = Tournament.objects.get(id=id)
        if TournamentParticipant.objects.filter(tournament=tournament, user_id=user_id).exists():
            return JsonResponse({'Error': 'User Already registeres in this tournament'},status=400)
        TournamentParticipant.objects.create( tournament=tournament, user_id=user_id)
        res = model_to_dict(tournament)
        tps = TournamentParticipant.objects.filter(tournament=tournament).values('user_id')
        res["id"] = str(tournament.id)
        res["participants"] = [tp for tp in tps]
        return JsonResponse({'tournament': res}, status=200)
    except Tournament.DoesNotExist:
        return JsonResponse({'Error': 'Tournament not found'},status=404)
    except Exception as e:
        return JsonResponse({'Error': str(e)},status=400)

