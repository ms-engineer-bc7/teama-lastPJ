from django.http import JsonResponse
from firebase_admin import auth, exceptions
from .models import User

def verify_token(request):
    # Authorization headerからトークンを取得
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return JsonResponse({'error': 'Invalid token format'}, status=400)

    token = auth_header.split(' ')[1]
    try:
        # トークンの検証
        decoded_token = auth.verify_id_token(token)
        # トークンが有効であれば、データベースからユーザー情報を取得
        user = User.objects.get(uid=decoded_token['uid'])
        return JsonResponse({
            'name': user.name,
            'email': user.email,
            'role': user.role
        })
    except exceptions.FirebaseError as e:
        # トークンが無効の場合
        return JsonResponse({'error': str(e)}, status=401)
    except User.DoesNotExist:
        # ユーザーが見つからない場合
        return JsonResponse({'error': 'User not found'}, status=404)
