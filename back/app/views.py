import json
from django.shortcuts import render, get_object_or_404
from django.http import Http404
from django.http import HttpResponseNotAllowed
from .models import User, Event, SpreadSheet
from .serializers import UserSerializer, EventSerializer, SpreadSheetSerializer
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from langchain_openai import OpenAI
from langchain.prompts import PromptTemplate
from django.conf import settings
from .libs.spreadsheet import SpreadSheetClient
from .libs.firebase import FirebaseClient




class UserViewSet(viewsets.ModelViewSet): #Userモデルに対するCRUD操作
    queryset = User.objects.all()
    serializer_class = UserSerializer  
    lookup_field = 'uid'

    # userの詳細データ取得時に、firebase tokenを確認する
    def retrieve(self, request, uid):
        fbClient = FirebaseClient()
        res = fbClient.verify_token(self.request)
        print(res.status_code)
        if res.status_code == 404:
            raise Http404(
                "User Not Found."
            )
        if res.status_code != 200:
            raise HttpResponseNotAllowed(
                "Unauthorized firebase token."
            )
        return res

class EventViewSet(viewsets.ModelViewSet): #ModelViewSetを継承。CRUD操作を行うための一連のビューが自動的に作成
    queryset = Event.objects.all() #Eventモデルの全オブジェクトを取得
    serializer_class = EventSerializer #リクエストのデータが適切にシリアライズされるようになる

    #LLM
    def set_llm_message(self, serializer):
        # イベントのタイトルを治療内容（treatment）として取得
        treatment = serializer.validated_data['title']

        # OpenAI LLM のインスタンスを作成
        llm = OpenAI(api_key=settings.OPENAI_API_KEY, temperature=0.9)
        
        # Userのroleに基づいてプロンプトテンプレートを分岐
        # プロンプトテンプレートを定義    
        prompt_template = PromptTemplate(
            input_variables=["treatment"],
            template=f"""
            不妊治療について頑張って治療を受ける人に向けて
            200文字以内の温かい言葉をかけてください。
            治療内容: {treatment}。
            励ましや応援する優しい言葉をお願いします。
            次に向かう感じや成功を目指すようなプレッシャーに感じるような言葉は避けて、
            治療前の辛い気持ちに対して共感や寄り添い、支えになるようにお願いします。
            大事な人に言うように、その人に思いやりを持った会話口調で、
            敬語で簡潔に表現してください。引用符は付けないでください。
            """
        )
        # プロンプトテンプレートに治療内容を埋め込んで LLM に送信し、メッセージを生成
        response = llm(prompt_template.format(treatment=treatment))
        serializer.validated_data['alert_message_for_u'] = response

        prompt_template = PromptTemplate(
            input_variables=["treatment"],
            template=f"""
            不妊治療を受ける女性を支えるパートナーに向けて、
            200文字以内で具体的なサポートの方法を一つ提案してください。
            女性が受ける治療内容は{treatment}です。
            治療によるストレスを軽減するため、
            日常生活でパートナーができる具体的な支援の一例を挙げて、
            過度ではなく気遣いが感じられる言葉遣いでアドバイスしてください。
            治療の内容に合わせて、最も適切な支援方法を提案してください。
            引用符は使用せず、シンプルかつ温かみのある表現を用いてください。
            """
        )
        # プロンプトテンプレートに治療内容を埋め込んで LLM に送信し、メッセージを生成
        response = llm(prompt_template.format(treatment=treatment))
        serializer.validated_data['alert_message_for_p'] = response

        # 生成されたメッセージを JSON 形式で返す
        return serializer

    
    # listを取得時、firebase tokenを確認し、そのユーザーの情報を取得する
    def list(self, request):
        fbClient = FirebaseClient()
        res = fbClient.verify_token(self.request)
        # リクエストからトークンを抽出
        token = request.headers.get('Authorization').split('Bearer ')[1]
        print("Received accessToken:", token)  # 受け取ったトークンのログ出力

        if res.status_code != 200:
            raise AuthenticationFailed(
                "Unauthorized firebase token."
            )
        user = fbClient.get_user()#ログインしているユーザー情報取得


        if user.role == 'user':
        # 女性ユーザーの場合は、そのユーザーが作成した予定を取得
            queryset = Event.objects.filter(user=user)

        else: 
        # パートナーの場合、許可されたメールアドレスに紐づく予定を取得 
            user_ids = User.objects.filter(partner=user.id)
            queryset = Event.objects.filter(user_id__in=user_ids)


        serializer = EventSerializer(queryset, many=True)
        return Response(serializer.data)


    def perform_create(self, serializer):
        # llmの情報をセット
        serializer = self.set_llm_message(serializer)


        # dbに保存
        serializer.save()

        # sperad sheetの更新も行う
        self.update_spreadsheet(serializer.validated_data['user'] )
        
    
    def perform_update(self, serializer):
        # llmの情報をセット
        serializer = self.set_llm_message(serializer)
        # dbに保存
        instance = serializer.save()

        # sperad sheetの更新も行う
        self.update_spreadsheet(instance.user)
        
    
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
        if self.action in ['get', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]
    
     # listを取得時、firebase tokenを確認し、そのユーザーの情報を取得する
    def list(self, request):
        fbClient = FirebaseClient()
        res = fbClient.verify_token(self.request)
        if res.status_code != 200:
            raise HttpResponseNotAllowed(
                "Unauthorized firebase token."
            )
        user = fbClient.get_user()
        queryset = SpreadSheet.objects.filter(user=user)
        serializer = SpreadSheetSerializer(queryset, many=True)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        # firebase tokenからuserデータを取得する
        fbClient = FirebaseClient()
        res = fbClient.verify_token(self.request)
        if res.status_code != 200:
            raise HttpResponseNotAllowed(
                "Unauthorized firebase token."
            )
        # firebaseの情報からUser情報を取得
        user = fbClient.get_user()
        # spreadsheetの設定
        ssClient = SpreadSheetClient()
        shared_email = serializer.validated_data['shared_email']
        sheet = ssClient.create_spreadsheet(user.email, shared_email, 'Sharecleカレンダー共有')
        
        events = Event.objects.filter(user=user)

        # updateカレンダー
        ssClient.update_calendar(sheet.id, events)
        
        #DBに保存
        serializer.save(
            sheet_id=sheet.id,
            user=user,
            shared_email=shared_email,
        )
