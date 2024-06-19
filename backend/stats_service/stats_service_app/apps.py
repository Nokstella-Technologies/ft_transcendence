from django.apps import AppConfig
import sys
import threading


class StatsServiceAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'stats_service_app'

    def ready(self):
        if 'runserver' in sys.argv or 'gunicorn' in sys.argv:
            from .services.game_consumer import start_game_data_consuming
            from .services.tournament_consumer import start_tournament_data_consuming

            # Iniciar os consumidores RabbitMQ em novas threads
            game_data_thread = threading.Thread(target=start_game_data_consuming)
            game_data_thread.daemon = True  # Permite que o Django pare mesmo que esta thread esteja ativa
            game_data_thread.start()

            tournament_data_thread = threading.Thread(target=start_tournament_data_consuming)
            tournament_data_thread.daemon = True  # Permite que o Django pare mesmo que esta thread esteja ativa
            tournament_data_thread.start()
