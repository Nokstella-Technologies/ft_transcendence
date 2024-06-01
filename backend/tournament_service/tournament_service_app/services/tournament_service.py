from django.views.decorators.csrf import csrf_exempt
from ..models.tournament import Tournament, TournamentGame, TournamentParticipant
import uuid

def create_tournament_game(tournament, participants):
    games = []
    participants_ids = list(participants.values_list('user_id', flat=True))
    for i in range(0, len(participants_ids), 2):
        if i + 1 < len(participants_ids):
            game_id = uuid.uuid4()
            game = TournamentGame.objects.create(
                tournament_id=tournament,
                game_id=game_id,
                round=1
            )
            games.append({
                'game_id': game_id,
                'player1_id': participants_ids[i]
                'player2_id': participants_ids[i + 1]
            })

