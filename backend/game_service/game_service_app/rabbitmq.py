import pika
import os

rabbitmq_host = os.getenv('RABBITMQ_HOST', 'rabbitmq')
rabbitmq_user = os.getenv('RABBITMQ_USER', 'guest')
rabbitmq_pass = os.getenv('RABBITMQ_PASS', 'guest')
try:
    credentials = pika.PlainCredentials("guest", "guest")
    parameters = pika.ConnectionParameters("rabbitmq", 5672, '/', credentials)
    connection = pika.BlockingConnection(parameters=parameters)
    channel = connection.channel()
    print("Rabbitmq connected")
except Exception as e:
    print(e)
