import pika
import os
import

rabbitmq_host = os.getenv('RABBITMQ_HOST', 'rabbitmq')
rabbitmq_user = os.getenv('RABBITMQ_USER', 'guest')
rabbitmq_pass = os.getenv('RABBITMQ_PASS', 'guest')
try:
    credentials = pika.PlainCredentials("guest", "guest")
    connection = pika.BlockingConnection(pika.ConnectionParameters("rabbitmq", 5672, '/', credentials))
    channel = connection.channel()
    print("ok test rabbitmq connected")

    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue='CREDENTIALS_TO_AUTHENTICATE', on_message_callback=on_request)
    print(" [x] Awaiting RPC requests")
    channel.start_consuming()

except Exception as e:
    print(e)
