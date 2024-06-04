import json
import pika
from django.utils import timezone
import pika.exceptions
from ..rabbitmq import create_connection
from ..models import Game
from django.forms.models import model_to_dict

UPDATE_QUEUE = 'UPDATE_GAME_TOURNAMENT'
FINISHED_QUEUE = 'FINISHED_GAME_TOURNAMENT'

def start_game_local(data, status='active'):

    player1_id = data.get('player1_id')
    player2_id = data.get('player2_id')
    type = data.get('type')
    game = Game.objects.create(
        player1_id = player1_id,
        player2_id = player2_id,
        type = type,
        status=status,
    )
    response = model_to_dict(game)
    response['game_id'] = str(game.game_id)
    return { 'game': response }

def update_game(data):
    score_player1 = data.get('score_player1')
    score_player2 = data.get('score_player2')
    end = data.get('end')
    id = data.get('id')
    game = Game.objects.get(game_id=id)
    is_end_now = False
    winner = None
    if (game is None):
        return {'status': 'error', 'message': 'Game not found'}
    if game.status == 'active':
        game.score_player1 = score_player1
        game.score_player2 = score_player2
        if end and game.end_time == None:
            game.end_time = timezone.now()
            is_end_now = True
            game.status = 'Finished'
        if end:
            if score_player1 > score_player2:
                winner = game.player1_id
            elif score_player1 < score_player2:
                winner = game.player2_id
            else:
                winner = "Tie"
    game.save()
    response = model_to_dict(game)
    response['end_time'] = str(game.end_time)
    response['winner'] = str(winner)
    response['game_id'] = str(game.game_id)
    response['player1_id'] = str(game.player1_id)
    response['player2_id'] = str(game.player2_id)
    return { 'game': response }, is_end_now

def start_consumer():
    _, channel = create_connection()
    def on_request(ch, method, props, body):
        data = json.loads(body)
        action = data.get('action')
        if action == 'start_game':
            print(f"Received start game request")
            response = start_game_local(data)
        elif action == 'update_game':
            print(f"Received update game request")
            response, ended = update_game(data)
            print(f"Game ended: {ended}")
            if (response.get('game').get('status') == 'Finished' and data.get('end') == True):
                if (response.get('game').get('type') == 'tournament'):
                    response['action'] = 'end_game'
                    print(f"Sending end game request")
                    ch.basic_publish(
                        exchange = '',
                        routing_key = FINISHED_QUEUE,
                        properties = pika.BasicProperties(correlation_id=props.correlation_id),
                        body = json.dumps(response)
                    )
        else:
           response = {'status': 'error', 'message': 'Unknown action'}
        ch.basic_publish(
            exchange = '',
            routing_key = props.reply_to,
            properties = pika.BasicProperties(correlation_id=props.correlation_id),
            body = json.dumps(response)
        )
        ch.basic_ack(delivery_tag=method.delivery_tag)

    def on_tournament_request(ch, method, props, body):
        print(f"Received tournament request")
        data = json.loads(body)
        print(f"Received data:{data}")
        action = data.get('action')
        if action == 'create_game':
            print(f"Received create game request")
            response = start_game_local(data, status='pending')
            response['round_number'] = data.get('round_number')
        elif action == 'start_game':
            print(f"Received start game request")
            id = data.get('id')
            game = Game.objects.filter(game_id=id).first()
            if game is None:
                response = {'status': 'error', 'message': 'Game not found'}
            game.status = 'active'
            game.save()
            response = model_to_dict(game)
            response['game_id'] = str(game.game_id)
            response['player1_id'] = str(game.player1_id)
            response['player2_id'] = str(game.player2_id)
        else :
            response = {'status': 'error', 'message': 'Unknown action'}
        response['action'] = action
        response['tournament_id'] = data.get('tournament_id')
        print(response)
        ch.basic_publish(
            exchange = '',
            routing_key = UPDATE_QUEUE,
            properties = pika.BasicProperties(correlation_id=props.correlation_id),
            body = json.dumps(response)
        )
        ch.basic_ack(delivery_tag=method.delivery_tag)

    try:
        channel.basic_qos(prefetch_count=1)
        channel.queue_declare(queue='START_GAME', durable=True)
        channel.queue_declare(queue='TOURNAMENT_GAME', durable=True)
        channel.basic_consume(queue='START_GAME', on_message_callback=on_request)
        channel.basic_consume(queue='TOURNAMENT_GAME', on_message_callback=on_tournament_request)
        print("[X] Awating RCP request...")
        channel.start_consuming()
    except pika.exceptions.ConnectionClosedByBroker as e:
        print("lost connection reset",str(e))
        _, channel = create_connection()
        start_consumer()

if __name__ == '__main__':
    start_consumer()
