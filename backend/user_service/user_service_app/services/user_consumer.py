import json
import pika
from django.contrib.auth.hashers import check_password
from django.forms.models import model_to_dict
from ..rabbitmq import channel
from ..models.user import User

def start_consumer():
    def on_request(ch, method, props, body):
        credentials = json.loads(body)
        username = credentials.get('username')
        password = credentials.get('password')

        # Verificar as credenciais no banco de dados
        user = User.objects.get(username=username)
        
        if check_password(password, user.password):
            response = json.dumps({'valid': True, 'user': model_to_dict(user)})
        else:
            response = json.dumps({'valid': False, 'user': {}})

        ch.basic_publish(
            exchange='',
            routing_key=props.reply_to,
            properties=pika.BasicProperties(correlation_id=props.correlation_id),
            body=response
        )
        ch.basic_ack(delivery_tag=method.delivery_tag)


    channel.basic_qos(prefetch_count=1)
    channel.queue_declare(queue='CREDENTIALS_TO_AUTHENTICATE')
    channel.basic_consume(queue='CREDENTIALS_TO_AUTHENTICATE', on_message_callback=on_request)
    print(" [x] Awaiting RPC requests")
    channel.start_consuming()