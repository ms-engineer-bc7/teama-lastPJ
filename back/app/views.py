from django.shortcuts import render, get_object_or_404
from .models import User, Event, SpreadSheet
from .serializers import UserSerializer, EventSerializer, SpreadSheetSerializer
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import JsonResponse
from langchain_openai import OpenAI
from langchain.prompts import PromptTemplate
from django.conf import settings
from google.oauth2.service_account import Credentials
import gspread

class UserViewSet(viewsets.ModelViewSet): #Userモデルに対するCRUD操作
    queryset = User.objects.all()
    serializer_class = UserSerializer

class EventViewSet(viewsets.ModelViewSet): #ModelViewSetを継承。CRUD操作を行うための一連のビューが自動的に作成
    queryset = Event.objects.all() #Eventモデルの全オブジェクトを取得
    serializer_class = EventSerializer #リクエストのデータが適切にシリアライズされるようになる

    #LLM
    @action(detail=True, methods=['get'])
    def generate_message(self, request, pk=None):
        # event_id (pk) を用いて Event モデルから特定のイベントを取得
        try:
            event = self.get_object()
        except Event.DoesNotExist:
            return JsonResponse({'error': 'Event not found'}, status=404)

        # イベントのタイトルを治療内容（treatment）として取得
        treatment = event.title

        # OpenAI LLM のインスタンスを作成
        llm = OpenAI(api_key=settings.OPENAI_API_KEY, temperature=0.9)

        # プロンプトテンプレートを定義
        prompt_template = PromptTemplate(
            input_variables=["treatment"],
            template=f"""
            不妊治療について頑張って治療を受ける人に向けて温かい言葉をかけてください。
            治療内容: {treatment}。
            励ましや応援する優しい言葉をお願いします。
            次に向かう感じや成功を目指すようなプレッシャーに感じるような言葉は避けて、
            治療前の辛い気持ちに対して共感や寄り添い、支えになるようにお願いします。
            大事な人に言うように、その人に思いやりを持った会話口調で、敬語でお願いします。
            """
        )

        # プロンプトテンプレートに治療内容を埋め込んで LLM に送信し、メッセージを生成
        response = llm(prompt_template.format(treatment=treatment))

        # 生成されたメッセージを JSON 形式で返す
        return JsonResponse({'message': response})
    
    def perform_create(self, serializer):
        serializer.save(event=self.request.event)
        # sperad sheetの更新も行う
        

    
    def perform_update(self, serializer):
        instance = serializer.save()
        # sperad sheetの更新も行う



class SpreadSheetViewSet(viewsets.ModelViewSet):
    queryset = SpreadSheet.objects.all()
    serializer_class = SpreadSheetSerializer
    user = None

    # anyone has permit only get, create
    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        user_id = int(self.request.GET.get('user', 0))
        self.user = get_object_or_404(User, pk=user_id)
        return SpreadSheet.objects.filter(user=self.user)
    
    def perform_create(self, serializer):
        # POSTの際は、queryset呼ばれないので、強制的に呼び出し
        self.get_queryset()

        # spreadsheetの設定
        gclient = self.get_spreadsheet_client()
        spreadsheet = gclient.create('Sharecleカレンダー共有')
        shared_email = serializer.validated_data['shared_email']
        
        #　権限の付与
        spreadsheet.share(self.user.email, perm_type='user', role='writer')
        spreadsheet.share(shared_email, perm_type='user', role='reader')

        # updateカレンダー
        self.update_calendar(spreadsheet.id)
        
        #DBに保存
        serializer.save(
            sheet_id=spreadsheet.id,
            user=self.user,
            shared_email=shared_email,
        )
        
    def get_spreadsheet_client(self):
        scopes = [
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive'
        ]

        credentials = Credentials.from_service_account_info(
            {
                "type": "service_account",
                "project_id": settings.GCP_PROJECT_ID,
                "private_key_id": settings.GCP_PRIVATE_KEY_ID,
                "private_key": settings.GCP_PRIVATE_KEY,
                "client_email": settings.GCP_CLIENT_MAIL,
                "client_id": settings.GCP_CLIENT_ID,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/mse-spreadsheet%40scpro-302715.iam.gserviceaccount.com",
                "universe_domain": "googleapis.com"
            },
            scopes=scopes
        )
        client = gspread.authorize(credentials)
        return client

    def update_calendar(self, sheet_id):
        gclient = self.get_spreadsheet_client()
        spreadsheet = gclient.open_by_key(sheet_id)
        sheet = spreadsheet.sheet1
        # TODO スケジュールデータを取得し2重配列にする
        sheet.update('A1', [["2024-04-01", "aaaa"], ["2024-04-02", "bbbbb"]])
          
