from ..rabbitmq import channel
import json
import pika
from ..models.user import User

def on_request(ch, method, props, body):
    credentials = json.loads(body)
    username = credentials.get('username')
    password = credentials.get('password')

    # Verificar as credenciais no banco de dados
    user = User.objects.get(username=username)

	if user.check_password(password):
        response = json.dumps({'valid': True, 'user': user})
    else:
        response = json.dumps({'valid': False, 'user': {}})

    ch.basic_publish(
        exchange='',
        routing_key=props.reply_to,
        properties=pika.BasicProperties(correlation_id=props.correlation_id),
        body=response
    )
    ch.basic_ack(delivery_tag=method.delivery_tag)