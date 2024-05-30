import json
import pika
import time
from ..utils.jwt import generate_jwt_token
from django.http import JsonResponse
from ..rabbitmq import channel, connection
import uuid

TIMEOUT_SECONDS = 5



def login_service(username, password):
	credentials = {'username': username, 'password': password}

	valid_credentials = authenticate_user(credentials)

	if valid_credentials != None and valid_credentials['valid'] == True:
		token = generate_jwt_token(valid_credentials["user"])
		return JsonResponse({'token': token})
	else:
		return JsonResponse({'error': 'Invalid credentials'}, status=401)

def authenticate_user(credentials):
    channel.queue_declare(queue='CREDENTIALS_TO_AUTHENTICATE')
    response = None
    response_queue = channel.queue_declare(queue='AUTH_LOGIN', exclusive=True).method.queue

    correlation_id = str(uuid.uuid4())

    def on_response(ch, method, properties, body):
        nonlocal response
        if correlation_id == properties.correlation_id:
            response = json.loads(body)
            ch.stop_consuming()

    channel.basic_consume(
        queue=response_queue,
        on_message_callback=on_response,
        auto_ack=True
    )

    channel.basic_publish(
        exchange='',
        routing_key='CREDENTIALS_TO_AUTHENTICATE',
        properties=pika.BasicProperties(
            reply_to=response_queue,
            correlation_id=correlation_id
        ),
        body=json.dumps(credentials)
    )

    start_time = time.time()

    while response is None and (time.time() - start_time) < TIMEOUT_SECONDS:
        connection.process_data_events(time_limit=1)  # Processa eventos por até 1 segundo

    if response is None:
        print("Timeout occurred, no response received.")
        channel.stop_consuming()
        return None
    return response

