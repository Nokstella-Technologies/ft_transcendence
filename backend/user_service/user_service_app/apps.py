from django.apps import AppConfig
import threading
class UserServiceAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'user_service_app'
    def ready(self):
        from .services.user_consumer import start_consumer
        # Iniciar o consumidor RabbitMQ em uma nova thread
        consumer_thread = threading.Thread(target=start_consumer)
        consumer_thread.daemon = True  # Permite que o Django pare mesmo que esta thread esteja ativa
        consumer_thread.start()

