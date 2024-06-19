from ..rabbitmq import create_connection
import json
import pika
import uuid
import time

UPDATE_STATUS = 'UPDATE_GAME'
def publish(queue_name, message, id):
    connection, channel = create_connection()
    channel.queue_declare(queue=queue_name, durable=True)

    channel.basic_publish(
        exchange='',
        routing_key=queue_name,
        properties=pika.BasicProperties(
            correlation_id=str(id)
        ),
        body=json.dumps(message),
    )

    connection.close()


def send_to_queue(ch, props, queue_name, message, action):
    ch.queue_declare(queue=queue_name, durable=True)
    message['action'] = action
    ch.basic_publish(
        exchange='',
        routing_key=queue_name,
        properties=pika.BasicProperties(
            reply_to=props.reply_to,
            correlation_id=props.correlation_id
        ),
        body=json.dumps(message),
    )
