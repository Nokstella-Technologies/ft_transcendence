import json
import pika
from django.utils import timezone
from ..rabbitmq import parameters
from ..models import Game

connection = pika.BlockingConnection(parameters=parameters)
channel = connection.channel()

def start_game_local(data):
    player1_id = data.get('player1_id')
    player2_id = data.get('player2_id')
    type = data.get('type')
    game = Game.objects.create(
        player1_id = player1_id,
        player2_id = player2_id,
        type = type,
        status='active',
        start_time=timezone.now()
    )
    return {'status': 'success','game_id':str(game.game_id)}


def start_consumer():
    def on_request(ch, method, props, body):
        data = json.loads(body)
        action = data.get('action')
        print(f"Received action: {action}")
        if action == 'start_game':
            response = start_game_local(data)
        else:
           response = {'status': 'error', 'message': 'Unknown action'}
        ch.basic_publish(
            exchange = '',
            routing_key = props.reply_to,
            properties = pika.BasicProperties(correlation_id=props.correlation_id),
            body = json.dumps(response)
        )
        ch.basic_ack(delivery_tag=method.delivery_tag)

    channel.basic_qos(prefetch_count=1)
    channel.queue_declare(queue='START_GAME', durable=True)
    channel.basic_consume(queue='START_GAME', on_message_callback=on_request)
    print("[X] Awating RCP request...")
    channel.start_consuming()

if __name__ == '__main__':
    start_consumer()
