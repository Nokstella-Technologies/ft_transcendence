import json
import pika
from django.utils import timezone
import pika.exceptions
from ..rabbitmq import create_connection
from ..models.tournament import TournamentGame, Tournament, TournamentParticipant
from django.forms.models import model_to_dict

UPDATE_QUEUE = 'UPDATE_GAME_TOURNAMENT'
FINISHED_QUEUE = 'FINISHED_GAME_TOURNAMENT'

def start_game_local(data, tournament_id):
    tournament = Tournament.objects.filter(id=tournament_id).first()
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
        tournament=tournament,
        player1_id=player1,
        player2_id=player2,
        round_number=round_number,
        status='pending'
    )
    return { 'game': game }

# def update_game(data):
#     score_player1 = data.get('score_player1')
#     score_player2 = data.get('score_player2')
#     status = data.get('status')
#     end = data.get('end')
#     id = data.get('id')
#     game = Game.objects.filter(game_id=id).first()
#     game.status = status
#     if (game is None):
#         return {'status': 'error', 'message': 'Game not found'}
#     if not game.end_time and game.status == 'active':
#         game.score_player1 = score_player1
#         game.score_player2 = score_player2
#         if end:
#             game.end_time = timezone.now()
#             game.status = 'Finished'
#     game.save()
#     response = model_to_dict(game)
#     response['game_id'] = str(game.game_id)
#     response['player1_id'] = str(game.player1_id)
#     response['player2_id'] = str(game.player2_id)
#     return { 'game': response }

def start_consumer():
    _, channel = create_connection()
    def on_request(ch, method, props, body):
        data = json.loads(body)
        if data.get('action') == 'start_game':
            start_game_local(data, props.correlation_id)
            ch.basic_ack(delivery_tag=method.delivery_tag)
        

    try:
        channel.basic_qos(prefetch_count=1)
        channel.queue_declare(queue=UPDATE_QUEUE, durable=True)
        channel.basic_consume(queue=UPDATE_QUEUE, on_message_callback=on_request)
        print("[X] Awating RCP request...")
        channel.start_consuming()
    except pika.exceptions.ConnectionClosedByBroker as e:
        print("lost connection reset",str(e))
        _, channel = create_connection()
        start_consumer()

if __name__ == '__main__':
    start_consumer()
