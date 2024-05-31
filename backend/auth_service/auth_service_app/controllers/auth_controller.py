import json
import http.client
from urllib.parse import urlencode
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from ..service.auth_service import login_service, authenticate_or_register_user
from ..utils.jwt import decode_jwt, generate_jwt_token




@csrf_exempt
def verify_jwt_token(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return JsonResponse({'error': 'Authorization header missing or malformed'}, status=401)

    token = auth_header.split(' ')[1]

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

@csrf_exempt
def oauth_callback(request):
    code =  json.loads(request.body).get('code')
    client_id = 'u-s4t2ud-02969ded8f525ab740688ae88c19e30b6f5f25582c0fa571d8db9c20e27ccfe3'
    client_secret = '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'
    redirect_uri = 'https://localhost'
    token_host = 'api.intra.42.fr'
    token_path = '/oauth/token'

    token_data = {
        'grant_type': 'authorization_code',
        'client_id': client_id,
        'client_secret': client_secret,
        'code': code,
        'redirect_uri': redirect_uri
    }

    print("Token Data:", token_data)

    conn = http.client.HTTPSConnection(token_host)
    headers = {'Content-type': 'application/x-www-form-urlencoded'}
    conn.request('POST', token_path, urlencode(token_data), headers)
    response = conn.getresponse()
    print (response)
    token_response = response.read().decode()
    token_json = json.loads(token_response)
    access_token = token_json.get('access_token')
    conn.close()

    print("Response Status:", response.status)
    print("Response Reason:", response.reason)
    print("Token Response:", token_json)

    if access_token:
        user_info_host = 'api.intra.42.fr'
        user_info_path = '/v2/me'
        conn = http.client.HTTPSConnection(user_info_host)
        headers = {'Authorization': f'Bearer {access_token}'}
        conn.request('GET', user_info_path, headers=headers)
        response = conn.getresponse()
        user_info_response = response.read().decode()
        user_info = json.loads(user_info_response)
        conn.close()

        user = authenticate_or_register_user(user_info)
        if user != None and user['valid'] == True:
            jwt_token = generate_jwt_token(user["user"])
            return JsonResponse({'jwt_token': jwt_token})
    return JsonResponse({'error': 'Failed to retrieve access token'}, status=400)

