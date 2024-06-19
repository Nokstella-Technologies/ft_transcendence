import pika
import json
from ..models import PlayerStats, User
from ..rabbitmq import create_connection

def process_user_stats(ch, method, properties, body):
    data = json.loads(body)
    try:
        user = User.objects.get(pk=data['user_id'])
        player_stats, created = PlayerStats.objects.get_or_create(user_id=user)
        player_stats.games_played += data.get('games_played', 0)
        player_stats.games_won += data.get('games_won', 0)
        player_stats.games_lost += data.get('games_lost', 0)
        player_stats.total_score += data.get('total_score', 0)
        player_stats.save()
    except User.DoesNotExist:
        print(f"User with id {data['user_id']} does not exist.")
    except Exception as e:
        print(f"Error updating stats for user_id {data['user_id']}: {e}")

def start_user_stats_consuming():
    connection, channel = create_connection()
    channel.queue_declare(queue='USER_STATS_QUEUE', durable=True)

    channel.basic_consume(queue='USER_STATS_QUEUE', on_message_callback=process_user_stats, auto_ack=True)

    print('Waiting for user stats messages. To exit press CTRL+C')
    channel.start_consuming()

if __name__ == '__main__':
    start_user_stats_consuming()
