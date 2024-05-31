import json
import base64

def get_payload(request, field):
	auth_header = request.headers.get('Authorization')

	if not auth_header or not auth_header.startswith('Bearer '):
		return JsonResponse({'error': 'Authorization header missing or malformed'}, status=401)

	token = auth_header.split(' ')[1]

	header, payload, signature = token.split('.')

	payload_data = json.loads(base64.urlsafe_b64decode(payload + '=='))

	return payload_data[field]