import json
import pika
import time
import pika.exceptions
from ..rabbitmq import create_connection
from ..models.tournament import TournamentGame, Tournament, TournamentParticipant
from django.forms.models import model_to_dict

UPDATE_QUEUE = 'UPDATE_GAME_TOURNAMENT'
FINISHED_QUEUE = 'FINISHED_GAME_TOURNAMENT'

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
    return { 'game': game }

def start_game(data):
    tournGame = TournamentGame.objects.filter(game_id=data['game_id']).first()
    if tournGame is None or tournGame.status != 'pending':
        return {'status': 'error', 'message': 'Game not found or not pending'}
    tournGame.status = 'active'
    tournGame.save()
    return { 'game': model_to_dict(tournGame) }

def end_game(data):
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
        p1.wins += 1
        p2.losses += 1
        p1.score += 3
    else:
        p2.wins += 1
        p1.losses += 1
        p2.score += 3
    tournGame.status = 'finished'
    tournGame.save()
    p1.save()
    p2.save()

def start_consumer():
    _, channel = create_connection()
    def on_request(ch, method, props, body):
        data = json.loads(body)
        if data.get('action') == 'create_game':
            print("creating game in tournament:", data.get('tournament_id'))
            res = create_game_local(data, data.get('tournament_id'))
            print("response: ", res)
        elif data.get('action') == 'start_game':
            res = start_game(data)
        elif data.get('action') == 'end_game':
            res = end_game(data)
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
        time.sleep(20)
        start_consumer()

if __name__ == '__main__':
    start_consumer()
