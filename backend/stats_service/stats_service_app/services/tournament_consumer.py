import pika
import json
from ..models import TournamentStats
from ..rabbitmq import create_connection
from .producer import send_to_queue

USER_STATS_QUEUE = 'USER_STATS_QUEUE'

def process_tournament_data(ch, method, properties, body):
    data = json.loads(body)
    tournament_stats = TournamentStats(
        tournament_id=data['tournament_id'],
        player1_id=data['player1_id'],
        player2_id=data['player2_id'],
        winner_id=data['winner_id'],
        score=data['score'],
        round_number=data['round_number']
    )
    tournament_stats.save()

    # Enviando os dados ao serviço de usuário
    stats_data = {
        'user_id': data['winner_id'],
        'tournaments_played': 1,
        'tournaments_won': 1,
        'total_score': data['score']
    }
    send_to_queue('USER_STATS_QUEUE', stats_data)

def start_tournament_data_consuming():
    connection, channel = create_connection()
    channel.queue_declare(queue='TOURNAMENT_DATA_QUEUE', durable=True)

    channel.basic_consume(queue='TOURNAMENT_DATA_QUEUE', on_message_callback=process_tournament_data, auto_ack=True)

    print('Waiting for tournament data messages. To exit press CTRL+C')
    channel.start_consuming()
