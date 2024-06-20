from django.urls import path, include

urlpatterns = [
    path('user/', include('user_service_app.urls')),
	path('', include('django_prometheus.urls')),
]
