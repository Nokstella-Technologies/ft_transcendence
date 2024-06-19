from django.urls import path
from .controllers.stats_controller import update_stats

urlpatterns = [
	path('update_stats/', update_stats, name='update_stats')
]
