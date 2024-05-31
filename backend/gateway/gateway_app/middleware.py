import requests
from django.http import JsonResponse

class AuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.auth_required_prefixes = [
            '/protected/',  # Example: all routes starting with /protected/
        ]
        # Define the route prefixes that do not require authentication
        self.public_prefixes = [
            '/public/',  # Example: all routes starting with /public/
        ]


    def __call__(self, request):
        path = request.path_info

        # Check if the path matches any public prefixes
        if any(path.startswith(prefix) for prefix in self.public_prefixes):
            # Skip authentication for public routes
            return self.get_response(request)

        # Check if the path matches any auth-required prefixes
        if any(path.startswith(prefix) for prefix in self.auth_required_prefixes):
            bearer = request.headers.get('Authorization', None)
            if bearer:
                try:
                    token = bearer.split(' ')[1]
                    if (token == ''): 
                        return JsonResponse({'error': 'Invalid token'}, status=401)
                    response = requests.post('http://localhost:8002/auth/authorized', headers={'X-Auth-Token': token})
                    if response.status_code != 200:
                        return JsonResponse({'error': 'Invalid token'}, status=401)
                except requests.RequestException as e:
                    return JsonResponse({'error': str(e)}, status=500)
            else:
                return JsonResponse({'error': 'No token provided'}, status=401)
        response = self.get_response(request)
        return response
