from django.apps import AppConfig
import sys
import threading

class UserServiceAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'user_service_app'

    def ready(self):
        if 'runserver' in sys.argv or 'gunicorn' in sys.argv:
            from .services.user_consumer import start_auth_consumer, start_stats_consumer

            # Iniciar o consumidor de autenticação em uma nova thread
            auth_consumer_thread = threading.Thread(target=start_auth_consumer)
            auth_consumer_thread.daemon = True  # Permite que o Django pare mesmo que esta thread esteja ativa
            auth_consumer_thread.start()

            # Iniciar o consumidor de estatísticas em uma nova thread
            stats_consumer_thread = threading.Thread(target=start_stats_consumer)
            stats_consumer_thread.daemon = True  # Permite que o Django pare mesmo que esta thread esteja ativa
            stats_consumer_thread.start()
