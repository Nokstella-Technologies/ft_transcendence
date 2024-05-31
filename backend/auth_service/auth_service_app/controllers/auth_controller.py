import json
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from ..service.auth_service import login_service
from ..utils.jwt import decode_jwt


@csrf_exempt
def verify_jwt_token(request):
    print(request.headers)
    if request.method != 'GET':
        return JsonResponse({"message":"Only GET requests are allowed"}, 405)
    token = request.headers.get('X-Auth-Token')
    if not token:
        return JsonResponse({'error': 'Authorization header missing or malformed'}, status=401)

    try:
        strn, status = decode_jwt(token)

        return JsonResponse({'message': strn}, status=status)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def login(request):
    if request.method != 'POST':
        return HttpResponseBadRequest("Only POST requests are allowed")
    else:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return JsonResponse({'error': 'Username and password are required'}, status=400)
        return login_service(username, password)
