import json
import pika
from django.contrib.auth.hashers import check_password
from django.forms.models import model_to_dict
from ..rabbitmq import channel
from ..models.user import User

def handle_authenticate(credentials):
    username = credentials.get('username')
    password = credentials.get('password')

    try:
        user = User.objects.filter(username=username).values('user_id', 'username', 'email', 'is_auth', 'status', 'password').first()
        if check_password(password, user.get('password')):
            user['password'] = None
            user['user_id'] = str(user['user_id'])
            response = {'valid': True, 'user': user}
        else:
            response = {'valid': False, 'user': {}}
    except Exception as e:
        response = {'valid': False, 'user': {}, 'error': str(e)}
    return response

# Função para autenticar ou registrar usuário pela API 42
def handle_authenticate_or_register(user_info):
    email = user_info.get('email')
    username = user_info.get('login')

    try:
        user = User.objects.filter(email=email).first()
        if user:
            response = {'valid': True, 'user': model_to_dict(user)}
        else:
            user = User.objects.create(
                username=username,
                email=email,
                status='online')
            response = {'valid': True, 'user': model_to_dict(user)}
    except Exception as e:
        response = {'valid': False, 'user': {}, 'error': str(e)}
    return response


def start_consumer():
    def on_request(ch, method, props, body):
        data = json.loads(body)
        action = data.get('action')
        response = {}

         # Diferencia entre os tipos de ação
        if action == 'authenticate':
            response = handle_authenticate(data)
        elif action == 'authenticate_or_register':
            response = handle_authenticate_or_register(data)
        else:
            response = {'valid': False, 'user': {}}


        # Envia a resposta de volta para o `auth_service`
        ch.basic_publish(
            exchange='',
            routing_key=props.reply_to,
            properties=pika.BasicProperties(correlation_id=props.correlation_id),
            body=json.dumps(response)
        )
        ch.basic_ack(delivery_tag=method.delivery_tag)

        # Função para autenticar usuário por email e senha


    channel.basic_qos(prefetch_count=1)
    channel.queue_declare(queue='CREDENTIALS_TO_AUTHENTICATE')
    channel.basic_consume(queue='CREDENTIALS_TO_AUTHENTICATE', on_message_callback=on_request)
    channel.queue_declare(queue='USER_INFO_TO_AUTHENTICATE')
    channel.basic_consume(queue='USER_INFO_TO_AUTHENTICATE', on_message_callback=on_request)
    print(" [x] Awaiting RPC requests")
    channel.start_consuming()

if __name__ == '__main__':
    start_consumer()
