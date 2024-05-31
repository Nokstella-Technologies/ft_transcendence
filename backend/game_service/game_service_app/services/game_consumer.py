# game/consumers.py

import json
import pika
from ..models import Game, PlayerStats
from .rabbitmq import channel

def start_consumer():
    def on_request(ch, method, props, body):
        data = json.loads(body)
        action = data.get('action')

        if action == 'start_game':
            response = start_game(data)
        elif action == 'update_score':
            response = update_score(data)
        elif action == 'end_game':
            response = end_game(data)
        else:
            response = {'status': 'error', 'message': 'Invalid action'}

        ch.basic_publish(
            exchange='',
            routing_key=props.reply_to,
            properties=pika.BasicProperties(correlation_id=props.correlation_id),
            body=json.dumps(response)
        )
        ch.basic_ack(delivery_tag=method.delivery_tag)

    channel.basic_qos(prefetch_count=1)
    channel.queue_declare(queue='game_service')
    channel.basic_consume(queue='game_service', on_message_callback=on_request)
    print(" [x] Awaiting RPC requests")
    channel.start_consuming()

def start_game(data):
    player1_id = data.get('player1_id')
    player2_id = data.get('player2_id')
    # Lógica para iniciar o jogo
    # ...
    return {'status': 'success', 'game_id': 'game_id'}

def update_score(data):
    game_id = data.get('game_id')
    player1_score = data.get('player1_score')
    player2_score = data.get('player2_score')
    # Lógica para atualizar o placar
    # ...
    return {'status': 'success', 'game_id': game_id}

def end_game(data):
    game_id = data.get('game_id')
    winner_id = data.get('winner_id')
    # Lógica para finalizar o jogo e atualizar as estatísticas
    # ...
    return {'status': 'success', 'game_id': game_id}

if __name__ == '__main__':
    start_consumer()
