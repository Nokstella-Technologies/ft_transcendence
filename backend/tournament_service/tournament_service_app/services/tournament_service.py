from django.views.decorators.csrf import csrf_exempt
from ..models.tournament import TournamentGame
import uuid

@csrf_exempt
def create_tournament_games(tournament, participants):
    games = []
    participants_ids = list(participants.values_list('user_id', flat=True))
    num_participants = len(participants_ids)

    round_number = 1
    while num_participants > 1:
        round_games = []
        #Se houver um numero impar de participantes, um jogador recebe um bye
        if num_participants % 2 != 0:
            bye_player = participants_ids.pop()
            game_id = uuid.uuid4()
            game = TournamentGame.objects.create(
                tournament=tournament,
                game_id=game_id,
                round=round_number,
                player1_id=bye_player,
                player2_id=None,
                status='bye'
            )
            games.append({
                'game_id': game_id,
                'player1_id': bye_player,
                'player2_id': None,
                tournament: tournament.tournament_id,
                'round': round_number,
                'status': 'bye'
            })
            num_participants -= 1

        for i in range(0, num_participants, 2):
            game_id = uuid.uuid4()
            game = TournamentGame.objects.create(
                tournament=tournament,
                game_id=game_id,
                round=round_number,
                player1_id=participants_ids[i],
                player2_id=participants_ids[i+1],
                status='pending'
            )
            games.append({
                'game_id': game_id,
                'player1_id': participants_ids[i],
                'player2_id': participants_ids[i+1],
                tournament: tournament.tournament_id,
                'round': round_number,
                'status': 'pending'
            })
            round_games.append(game_id)

        participants_ids = round_games
        num_participants = len(participants_ids)
        round_number += 1
    return games

