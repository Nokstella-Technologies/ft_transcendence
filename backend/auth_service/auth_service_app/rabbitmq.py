import pika
import os
import time
max_retries = 5  # Número máximo de tentativas de reconexão
retry_delay = 5 

rabbitmq_host = os.getenv('RABBITMQ_HOST', 'rabbitmq')
rabbitmq_user = os.getenv('RABBITMQ_USER', 'guest')
rabbitmq_pass = os.getenv('RABBITMQ_PASS', 'guest')
credentials = pika.PlainCredentials(rabbitmq_user, rabbitmq_pass)

def connect_to_rabbitmq():
    for attempt in range(max_retries):
        try:
            connection = pika.BlockingConnection(pika.ConnectionParameters(rabbitmq_host, 5672, '/', credentials))
            channel = connection.channel()
            print("ok test rabbitmq connected")
            return connection, channel
        except Exception as e:
            print(f"Connection attempt {attempt + 1} failed: {e}")
            if attempt < max_retries - 1:
                print(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                print("Max retries reached, exiting.")
                raise
    return None, None

connection, channel = connect_to_rabbitmq()


def reconnect_to_rabbitmq():
    global connection, channel
    if connection is not None:
        connection.close()
    connection, channel = connect_to_rabbitmq()
    return connection, channel