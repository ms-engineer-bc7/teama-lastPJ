from django.shortcuts import render, get_object_or_404
from .models import User, Event, SpreadSheet
from .serializers import UserSerializer, EventSerializer, SpreadSheetSerializer
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from django.http import JsonResponse
from langchain_openai import OpenAI
from langchain.prompts import PromptTemplate
from django.conf import settings
from .libs.spreadsheet import SpreadSheetClient



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
        serializer.save()
        # sperad sheetの更新も行う
        self.update_spreadsheet(serializer.validated_data["user"])
        
    
    def perform_update(self, serializer):
        instance = serializer.save()
        # sperad sheetの更新も行う
        self.update_spreadsheet(serializer.validated_data["user"])

    
    def update_spreadsheet(self, user=None):
        ss = SpreadSheet.objects.filter(user=user)
        if not ss:
            return
        events = Event.objects.filter(user=user)
        ssClient = SpreadSheetClient()
        ssClient.update_calendar(ss.first().sheet_id, events)



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
        ssClient = SpreadSheetClient()
        shared_email = serializer.validated_data['shared_email']
        sheet = ssClient.create_spreadsheet(self.user.email, shared_email, 'Sharecleカレンダー共有')
        
        # updateカレンダー
        ssClient.update_calendar(sheet.id)
        
        #DBに保存
        serializer.save(
            sheet_id=sheet.id,
            user=self.user,
            shared_email=shared_email,
        )
