import json
import pika
from django.utils import timezone
from ..rabbitmq import connect_to_rabbitmq
from ..models import Game
from django.forms.models import model_to_dict

connection, channel = connect_to_rabbitmq()

def reconnect_to_rabbitmq():
    global connection, channel
    if connection is not None:
        connection.close()
    connection, channel = connect_to_rabbitmq()
    return connection, channel

def start_game_local(data):
    player1_id = data.get('player1_id')
    player2_id = data.get('player2_id')
    type = data.get('type')
    game = Game.objects.create(
        player1_id = player1_id,
        player2_id = player2_id,
        type = type,
        status='active',
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
    if not game.end_time and game.status == 'active':
        game.score_player1 = score_player1
        game.score_player2 = score_player2
        if end:
            game.end_time = timezone.now()
            game.status = 'Finished'
    game.save()
    response = model_to_dict(game)
    response['game_id'] = str(game.game_id)
    response['player1_id'] = str(game.player1_id)
    response['player2_id'] = str(game.player2_id)
    return { 'game': response }

def start_consumer():
    def on_request(ch, method, props, body):
        data = json.loads(body)
        action = data.get('action')
        print(f"Received action:{action}")
        if action == 'start_game':
            response = start_game_local(data)
        elif action == 'update_game':
            response = update_game(data)
        else:
           response = {'status': 'error', 'message': 'Unknown action'}
        ch.basic_publish(
            exchange = '',
            routing_key = props.reply_to,
            properties = pika.BasicProperties(correlation_id=props.correlation_id),
            body = json.dumps(response)
        )
        ch.basic_ack(delivery_tag=method.delivery_tag)
    if channel is None or connection is None:
        reconnect_to_rabbitmq()
    channel.basic_qos(prefetch_count=1)
    channel.queue_declare(queue='START_GAME', durable=True)
    channel.basic_consume(queue='START_GAME', on_message_callback=on_request)
    print("[X] Awating RCP request...")
    channel.start_consuming()

if __name__ == '__main__':
    start_consumer()
