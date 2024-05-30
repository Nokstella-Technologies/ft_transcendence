import pika
import os

rabbitmq_host = os.getenv('RABBITMQ_HOST', 'rabbitmq')
rabbitmq_user = os.getenv('RABBITMQ_USER', 'guest')
rabbitmq_pass = os.getenv('RABBITMQ_PASS', 'guest')
try:
    credentials = pika.PlainCredentials("guest", "guest")
    connection = pika.BlockingConnection(pika.ConnectionParameters("rabbitmq", 5672, '/', credentials))
    channel = connection.channel()
    print("ok test rabbitmq connected")

except Exception as e:
    print(e)
