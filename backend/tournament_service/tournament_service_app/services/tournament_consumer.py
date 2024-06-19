import json
import pika
import pika.exceptions
from ..rabbitmq import create_connection
from ..models.tournament import TournamentGame, Tournament, TournamentParticipant
from django.forms.models import model_to_dict
from .tournament_producer import send_to_queue

UPDATE_QUEUE = 'UPDATE_GAME_TOURNAMENT'
FINISHED_QUEUE = 'FINISHED_GAME_TOURNAMENT'
TOURNAMENT_STATS_QUEUE = 'TOURNAMENT_DATA_QUEUE'

def create_game_local(data, tournament_id):

    tournament = Tournament.objects.filter(id=tournament_id).first()
    if tournament is None or tournament.status != 'Started':
        return {'status': 'error', 'message': 'Tournament not found or not created'}
    game = data.get('game')
    player1 = TournamentParticipant.objects.filter(user_id = game.get('player1_id'), tournament=tournament).first()
    player2 = TournamentParticipant.objects.filter(user_id = game.get('player2_id'), tournament=tournament).first()
    round_number = data.get('round_number')
    if tournament is None or player1 is None or player2 is None:
        return {'status': 'error', 'message': 'Tournament or player not found'}
    tg = TournamentGame.objects.filter(tournament=tournament, round_number=round_number).first()
    if tg is not None:
        return {'status': 'error', 'message': 'Game already exists'}
    game = TournamentGame.objects.create(
        game_id= game.get('game_id'),
        tournament=tournament,
        player1_id=player1,
        player2_id=player2,
        round_number=round_number,
        status='pending'
    )

    stats_message = {
        'action': 'create_game',
        'game_id': str(game.game_id),
        'player1_id': str(game.player1_id.user_id),
        'player2_id': str(game.player2_id.user_id),
        'tournament_id': str(tournament.id),
        'round_number': round_number,
        'status': game.status
    }
    send_to_queue(TOURNAMENT_STATS_QUEUE, stats_message)

    return { 'game': game }

def start_game(data):
    tournGame = TournamentGame.objects.filter(game_id=data['game_id']).first()
    if tournGame is None or tournGame.status != 'pending':
        return {'status': 'error', 'message': 'Game not found or not pending'}
    tournGame.status = 'active'
    tournGame.save()
    return { 'game': model_to_dict(tournGame) }

def end_game(ch, props, data):
    game = data.get('game')
    print("game: ", data)
    tournGame = TournamentGame.objects.filter(game_id=game['game_id']).first()
    if tournGame is None or tournGame.status != 'active':
        return {'status': 'error', 'message': 'Game not found or not active'}
    p1 =tournGame.player1_id
    p2 =tournGame.player2_id
    winner = game['winner']
    if (winner == 'Tie'):
        p1.score += 1
        p2.score += 1
    elif (winner == p1.user_id):
        p1.score += 3
    else:
        p2.score += 3
    tournGame.status = 'finished'
    tournGame.save()
    p1.save()
    p2.save()

    tournament = tournGame.tournament
    if all(game.status == 'finished' for game in TournamentGame.objects.filter(tournament=tournament)):
        tournament.status = 'Finished'
        tournament.save()

        stats_message = {
            'action': 'end_tournament',
            'tournament_id': str(tournament.id),
            'winner_id': str(winner)
        }
        send_to_queue(ch, props, TOURNAMENT_STATS_QUEUE, stats_message, 'end_tournament')

def start_consumer():
    _, channel = create_connection()
    def on_request(ch, method, props, body):
        data = json.loads(body)
        if data.get('action') == 'create_game':
            res = create_game_local(data, data.get('tournament_id'))
        elif data.get('action') == 'start_game':
            res = start_game(data)
        elif data.get('action') == 'end_game':
            res = end_game(ch, props, data)
        print("response: ", res)
        ch.basic_ack(delivery_tag=method.delivery_tag)

    try:
        channel.basic_qos(prefetch_count=1)
        channel.queue_declare(queue=UPDATE_QUEUE, durable=True)
        channel.basic_consume(queue=UPDATE_QUEUE, on_message_callback=on_request)
        channel.queue_declare(queue=FINISHED_QUEUE, durable=True)
        channel.basic_consume(queue=FINISHED_QUEUE, on_message_callback=on_request)
        print("[X] Awating RCP request...")
        channel.start_consuming()
    except pika.exceptions.ConnectionClosedByBroker as e:
        print("lost connection reset",str(e))
        start_consumer()

if __name__ == '__main__':
    start_consumer()
