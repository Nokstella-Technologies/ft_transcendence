import requests
from django.http import JsonResponse
from django.views import View

# Create your views here.
class ProxyView(View):
    service_mapping = {
        '/public/user/': 'http://localhost:8002',
        '/public/auth/': 'http://localhost:8002',
        '/game/': 'http://localhost:8003',
        '/auth/': 'http://localhost:8001'
    }

    def get_service_url(self, path):
        for key in self.service_mapping.keys():
            if path.startswith(key):
                return self.service_mapping[key] + path[len(key.split('/', 2)[-1]):]
        return None

    def forward_request(self, request):
        service_url = self.get_service_url(request.path)
        print(service_url)
        if not service_url:
            return JsonResponse({'error': 'Service not found'}, status=404)
        try:
            response = requests.request(
                method=request.method,
                url=service_url,
                headers=request.headers,
                data=request.body,
                params=request.GET
            )
            return JsonResponse(response.json(), status=response.status_code)
        except requests.RequestException as e:
            return JsonResponse({'error': str(e)}, status=500)

    def get(self, request, *args, **kwargs):
        return self.forward_request(request)

    def post(self, request, *args, **kwargs):
        return self.forward_request(request)

    def put(self, request, *args, **kwargs):
        return self.forward_request(request)

    def delete(self, request, *args, **kwargs):
        return self.forward_request(request)

    def patch(self, request, *args, **kwargs):
        return self.forward_request(request)