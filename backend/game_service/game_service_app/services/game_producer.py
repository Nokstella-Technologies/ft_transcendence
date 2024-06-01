from django.views.decorators.csrf import csrf_exempt
from ..rabbitmq import channel, connection
import json
import pika
import uuid

@csrf_exempt
def send_to_queue(queue_name, message):
    result = channel.queue_declare(queue=queue_name, durable=True)
    correlation_id = str(uuid.uuid4())
    response = None

    def on_response(ch, method, properties, body):
        nonlocal response
        if correlation_id == properties.correlation_id:
            response = json.loads(body)
            ch.stop_consuming()

    channel.basic_consume(
        queue='',
        on_message_callback=on_response,
        auto_ack = True,
    )

    channel.basic_publish(
        exchange='',
        routing_key=queue_name,
        properties=pika.BasicProperties(
            reply_to='',
            correlation_id=correlation_id
            ),
        body=json.dumps(message),
    )

    while response is None:
        connection.process_data_events()
    connection.close()
    return response

