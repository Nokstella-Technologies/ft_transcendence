# auth_app/views.py
import base64
import hashlib
import hmac
import os

def generate_jwt_token(user_id):
    header = base64.urlsafe_b64encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode()).decode().strip('=')
    payload = base64.urlsafe_b64encode(json.dumps({
        "user_id": user_id,
        "exp": int((datetime.utcnow() + timedelta(hours=24)).timestamp())
    }).encode()).decode().strip('=')
    secret_key = os.environ.get('SECRET_KEY')
    signature = base64.urlsafe_b64encode(hmac.new(secret_key.encode(), f"{header}.{payload}".encode(), hashlib.sha256).digest()).decode().strip('=')
    
    return f"{header}.{payload}.{signature}"