from django.shortcuts import render

# Create your views here.
# userservice/views.py

from django.http import JsonResponse
from .tasks import add

def test_task(request):
    result = add.delay(4, 4)
    return JsonResponse({'task_id': result.id})