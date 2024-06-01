import json
import pika
from ..rabbitmq import channel, connection
from ..models import Game
from django.utils import timezone

def start_game(data):
    player1_id = data.get('player1_id')
    player2_id = data.get('player2_id')
    game = Game.objects.create(
        player1_id = player1_id,
        player2_id = player2_id,
        status='active',
        start_time=timezone.now()
    )
    return {'status': 'success','game_id':str(game.game_id)}

def on_request(ch, method, props, body):
    data = json.loads(body)
    action = data.get('action')
    print(f"Received action: {action}")
    if action == 'start_game':
        response = start_game(data)
    else:
       response = {'status': 'error', 'message': 'Unknown action'}
    ch.basic_publish(
        exchange = '',
        routing_key = props.reply_to,
        properties = pika.BasicProperties(correlation_id=props.correlation_id),
        body = json.dumps(response)
    )
    ch.basic_ack(delivery_tag=method.delivery_tag)

def start_consuming():
    print("Pênis chegou aqui")
    channel.queue_declare(queue='GAME_SERVICE', durable=True)
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue='GAME_SERVICE', on_message_callback=on_request)
    print("[X] Awating RCP request...")
    channel.start_consuming()

if __name__ == '__main__':
    start_consuming()
