# userservice/urls.py

from django.urls import path
from .views import test_task

urlpatterns = [
    path('test-task/', test_task, name='test_task'),
]