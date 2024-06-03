from ..models.tournament import Tournament, TournamentParticipant, TournamentGame
from .tournament_producer import publish
from django.forms.models import model_to_dict
def create_next_match(tournamet):
    if (tournamet.status == 'Created'):
        participants = TournamentParticipant.objects.filter(tournament=tournamet)
        if len(participants) < 3 or len(participants) > 8:
            return {'error': 'Number of participants is less than 3'}
        matches = TournamentGame.objects.filter(tournament=tournamet)
        if len(matches) > 0:
            return {'error': 'Round already started'}
        round_number = 1
        for round_combinations in get_round_combinations(participants):
            for player1, player2 in round_combinations:
                message={
                    "action": "create_game",
                    "player1_id": str(player1.user_id),
                    "player2_id": str(player2.user_id),
                    "round_number": round_number,
                    "type": "tournament",
		        }
                if (round_number == 1):
                    publish("TOURNAMENT_GAME", message, str(tournamet.id))
            round_number += 1
        tournamet.status = 'Started'
        tournamet.round_now = 1
        tournamet.save()
        return { "tournament": model_to_dict(tournamet)}
    else:
        return {'error': 'Error on tournament status is not created'}
        
def get_round_combinations(participants):
    num_participants = len(participants)
    tmp_participants = [tp for tp in participants]
    combinations_per_round = []
    
    for i in range(num_participants - 1):
        round_combinations = []
        for j in range(num_participants // 2):
            player1 = tmp_participants[j]
            player2 = tmp_participants[num_participants - j - 1]
            round_combinations.append((player1, player2))
        tmp_participants.insert(1, tmp_participants.pop())
        combinations_per_round.append(round_combinations)
    
    return combinations_per_round


def find_next_match(tournament_id):
    tournament = Tournament.objects.get(id=tournament_id)
    if tournament.status != 'Started' and tournament.status != 'ongoing':
        return {'error': 'Tournament is not ongoing'}
    matches = TournamentGame.objects.filter(tournament=tournament, round_number=tournament.round_now).first()
    if matches is None and tournament.round_now > 2:
        tournament.status = 'finished'
        tournament.save()
        return {"status": "finished"}
    if matches.status == 'pending':
        matches.status = 'active'
        matches.save()
        res = model_to_dict(matches)
    elif matches.status == 'active':
        res = model_to_dict(matches)
    elif matches.status == 'finished':
        tournament.round_now += 1
        tournament.save()
        return find_next_match(tournament_id)
    else :
        return {'error': 'Error on match status'}
    res['id'] = str(matches.id)
    res['game_id'] = str(matches.game_id)
    res['player1_id'] = str(matches.player1_id)
    res['player2_id'] = str(matches.player2_id)
    return { "game": res }