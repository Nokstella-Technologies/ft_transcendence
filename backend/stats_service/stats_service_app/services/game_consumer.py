import pika
from ..rabbitmq import create_connection
import json
from ..models import GameStats
from .producer import send_to_queue  

USER_STATS_QUEUE = 'USER_STATS_QUEUE'

def process_game_data(ch, method, properties, body):
    data = json.loads(body)
    game_stats = GameStats(
        game_id=data['game_id'],
        player1_id=data['player1_id'],
        player2_id=data['player2_id'],
        score_player1=data['score_player1'],
        score_player2=data['score_player2']
    )
    game_stats.save()

    # Enviando os dados ao serviço de usuário
    stats_data_player1 = {
        'user_id': data['player1_id'],
        'games_played': 1,
        'games_won': 1 if data['score_player1'] > data['score_player2'] else 0,
        'games_lost': 1 if data['score_player1'] < data['score_player2'] else 0,
        'total_score': data['score_player1']
    }
    send_to_queue(USER_STATS_QUEUE, stats_data_player1)

    stats_data_player2 = {
        'user_id': data['player2_id'],
        'games_played': 1,
        'games_won': 1 if data['score_player2'] > data['score_player1'] else 0,
        'games_lost': 1 if data['score_player2'] < data['score_player1'] else 0,
        'total_score': data['score_player2']
    }
    send_to_queue(USER_STATS_QUEUE, stats_data_player2)

def start_game_data_consuming():
    connection, channel = create_connection()
    channel.queue_declare(queue='GAME_DATA_QUEUE', durable=True)

    channel.basic_consume(queue='GAME_DATA_QUEUE', on_message_callback=process_game_data, auto_ack=True)

    print('Waiting for game data messages. To exit press CTRL+C')
    channel.start_consuming()
