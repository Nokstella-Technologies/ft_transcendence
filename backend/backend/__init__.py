from prometheus_client import start_http_server, Counter

REQUEST_COUNT = Counter('django_request_count', 'Total number of requests')

class MetricsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        REQUEST_COUNT.inc()
        response = self.get_response(request)
        return response
