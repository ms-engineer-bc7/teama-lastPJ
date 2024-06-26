from django.http import JsonResponse
import firebase_admin
from firebase_admin import auth, credentials, exceptions


from ..models import User
from django.conf import settings


class FirebaseClient():
    user=None
    def __init__(self):
        if not firebase_admin._apps:
            cred = credentials.Certificate(
                {
                    "type": "service_account",
                    "project_id": settings.FIREBASE_PROJECT_ID,
                    "private_key_id": settings.FIREBASE_PRIVATE_KEY_ID,
                    "private_key": settings.FIREBASE_PRIVATE_KEY,
                    "client_email": settings.FIREBASE_CLIENT_MAIL,
                    "client_id": settings.FIREBASE_CLIENT_ID,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/mse-spreadsheet%40scpro-302715.iam.gserviceaccount.com",
                    "universe_domain": "googleapis.com",
                })
            firebase_admin.initialize_app(cred)


    def verify_token(self, request):
        # Authorization headerからトークンを取得
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'Invalid token format'}, status=400)
        try:
            token = auth_header.split(' ')[1]
            # リクエストからトークンを抽出
            # token = request.headers.get('Authorization').split('Bearer ')[1]
            print("Received accessToken:", token)  # 受け取ったトークンのログ出力
            # トークンの検証
            decoded_token = auth.verify_id_token(token)
            uid = decoded_token['uid']
            # トークンが有効であれば、データベースからユーザー情報を取得
            self.user = User.objects.get(uid=uid)
            return JsonResponse({
                'id': self.user.id,
                'uid': uid,
                'name': self.user.name,
                'email': self.user.email,
                'role': self.user.role,
                'partner': self.user.partner.id if self.user.partner else None,
                'partner_email': self.user.partner.email if self.user.partner else None,
            }, safe=False)
        except exceptions.FirebaseError as e:
            # トークンが無効の場合
            return JsonResponse({'error': str(e)}, status=401)
        except User.DoesNotExist:
            # ユーザーが見つからない場合
            return JsonResponse({'error': 'User not found'}, status=404)
        
    def get_user(self):
        return self.user
    