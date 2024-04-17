import os
import firebase_admin
from firebase_admin import credentials

# 環境変数からサービスアカウントのパスを取得
service_account_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')

# 設定が正しいかチェック　 Firebase Admin SDK の初期化
if service_account_path:
    cred = credentials.Certificate(service_account_path)
    firebase_admin.initialize_app(cred)
else:
    print("Failed to get service account credentials.")
    #環境変数が設定されていない場合には、エラーメッセージを表示