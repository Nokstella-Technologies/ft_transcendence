from django.urls import path, include

urlpatterns = [
	path('stats/', include('stats_service_app.urls')),
]
