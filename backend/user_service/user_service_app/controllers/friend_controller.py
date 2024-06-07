import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from user_service_app.services.user_service import User
from ..models.user import User
from ..models.user_friends import UserFriends
from django.forms.models import model_to_dict

class FriendController:
# Lista todos os amigos de um usuário
    @staticmethod
    @csrf_exempt
    def list_friends(request, id):
        try:
            user = User.objects.get(user_id=id)
            accepted_friends = UserFriends.objects.filter(user=user, status='accepted').values()
            pending_friends = UserFriends.objects.filter(user=user, status='pending').values()
            for friend in accepted_friends:
                friend['friend'] = model_to_dict(User.objects.get(user_id=friend['friend_id']), exclude={"otp_secret", "password"})
            for friend in pending_friends:
                friend['friend'] = model_to_dict(User.objects.get(user_id=friend['friend_id']), exclude={"otp_secret", "password"}) 
            friends_data = {
                'accepted': list(accepted_friends),
                'pending': list(pending_friends)
            }

            return JsonResponse(friends_data, safe=False, status=200)
        except User.DoesNotExist:
            return JsonResponse({'message': 'User not found'}, status=404)

    # Adiciona um amigo ao usuário
    @staticmethod
    @csrf_exempt
    def add_friend(request, id):
        if request.method == 'POST':
            try:
                body = json.loads(request.body.decode('utf-8'))
                user = User.objects.get(user_id=id)
                friend_id = body.get('friend_id')
                friend = User.objects.get(user_id=friend_id)

                # Verificar se já existe uma solicitação pendente ou aceita
                existing_friendship = UserFriends.objects.filter(user=user, friend=friend).first()
                if existing_friendship:
                    return JsonResponse({'message': 'Friend request already sent or friendship already exists'}, status=400)

                UserFriends.objects.create(user=user, friend=friend, status='pending')
                return JsonResponse({'message': 'Friend request sent successfully'}, status=200)
            except User.DoesNotExist:
                return JsonResponse({'message': 'User or Friend not found'}, status=404)
            except Exception as e:
                return JsonResponse({'message': str(e)}, status=400)
        return JsonResponse({'message': 'Invalid request method'}, status=405)

    @csrf_exempt
    def accept_friend(request, id):
        if request.method == 'POST':
            try:
                body = json.loads(request.body.decode('utf-8'))
                friend_id = body.get('friend_id')
                friend = User.objects.get(user_id=friend_id)
                friendship = UserFriends.objects.get(friend=friend, id=id, status='pending')
                friendship.status = 'accepted'
                friendship.save()
                return JsonResponse({'message': 'Friend request accepted successfully'}, status=200)
            except User.DoesNotExist:
                return JsonResponse({'message': 'User or Friend not found'}, status=404)
            except UserFriends.DoesNotExist:
                return JsonResponse({'message': 'Friend request not found'}, status=404)
            except Exception as e:
                return JsonResponse({'message': str(e)}, status=400)
        return JsonResponse({'message': 'Invalid request method'}, status=405)

    # Remove um amigo do usuário
    @staticmethod
    @csrf_exempt
    def remove_friend(request, id):
        if request.method == 'DELETE':
            try:
                UserFriends.objects.filter(id=id).delete()
                return JsonResponse({'message': 'Friend removed successfully'}, status=200)
            except User.DoesNotExist:
                return JsonResponse({'message': 'User or Friend not found'}, status=404)
            except Exception as e:
                return JsonResponse({'message': str(e)}, status=400)
        else:
            return JsonResponse({'message': 'Method not allowed'}, status=405)


    # Procura usuários pelo nome
    @staticmethod
    @csrf_exempt
    def search_user(request):
        if request.method == 'GET':
            query = request.GET.get('query', '')
            try:
                users = User.objects.filter(username__icontains=query)
                users_data = [model_to_dict(user, exclude={"otp_secret", "password"}) for user in users]
                return JsonResponse(users_data, safe=False, status=200)
            except Exception as e:
                return JsonResponse({'message': str(e)}, status=400)
        else:
            return JsonResponse({'message': 'Method not allowed'}, status=405)
