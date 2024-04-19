
from django.shortcuts import render, get_object_or_404
from django.http import Http404
from django.http import HttpResponseNotAllowed
from .models import User, Event, SpreadSheet, Viewer
from .serializers import UserSerializer, EventSerializer, SpreadSheetSerializer,ViewerSerializer
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
# from rest_framework.exceptions import PermissionDenied
from rest_framework.exceptions import AuthenticationFailed
from django.http import JsonResponse
from langchain_openai import OpenAI
from langchain.prompts import PromptTemplate
from django.conf import settings
from .libs.spreadsheet import SpreadSheetClient
from .libs.firebase import FirebaseClient



class ViewerViewSet(viewsets.ModelViewSet): #Viewerモデルに対するCRUD操作
    queryset = Viewer.objects.all()
    serializer_class = ViewerSerializer

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
        # return fbClient.get_user() #ログインしているユーザー情報取得
        return res

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

        # # プロンプトテンプレートを定義
        # prompt_template = PromptTemplate(
        #     input_variables=["treatment"],
        #     template=f"""
        #     不妊治療について頑張って治療を受ける人に向けて温かい言葉をかけてください。
        #     治療内容: {treatment}。
        #     励ましや応援する優しい言葉をお願いします。
        #     次に向かう感じや成功を目指すようなプレッシャーに感じるような言葉は避けて、
        #     治療前の辛い気持ちに対して共感や寄り添い、支えになるようにお願いします。
        #     大事な人に言うように、その人に思いやりを持った会話口調で、敬語でお願いします。
        #     """
        # )

        # # プロンプトテンプレートに治療内容を埋め込んで LLM に送信し、メッセージを生成
        # response = llm(prompt_template.format(treatment=treatment))

        # # 生成されたメッセージを JSON 形式で返す
        # return JsonResponse({'message': response})
        
        # Userのroleに基づいてプロンプトテンプレートを分岐
        if user.role == 'user':
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
                敬語で表現してください。
                「」など、文章の前後に記号はつけないでください。
                """
            )
        else:  # user.role == 'partner'
            prompt_template = PromptTemplate(
                input_variables=["treatment"],
                template=f"""
                不妊治療を受ける人のパートナーに向けて
                200文字以内で配慮した方がいい言葉をかけてください。
                治療内容: {treatment}。
                具体的にどういった言葉や態度、行動をとるべきかアドバイスをお願いいたします。
                相手のことは「パートナー」という表現にしてください。
                治療前の辛い気持ちに対して共感や寄り添い、支えになるようにお願いします。
                その人に思いやりを持った会話口調で、
                敬語で表現してください。
                「」など、文章の前後に記号はつけないでください。
                """
            )

        # プロンプトテンプレートに治療内容を埋め込んで LLM に送信し、メッセージを生成
        response = llm(prompt_template.format(treatment=treatment))

        # 生成されたメッセージを JSON 形式で返す
        return JsonResponse({'message': response[:200]}) # 最初の200文字まで使用
    
    # listを取得時、firebase tokenを確認し、そのユーザーの情報を取得する
    def list(self, request):
        fbClient = FirebaseClient()
        res = fbClient.verify_token(self.request)
        # リクエストからトークンを抽出
        token = request.headers.get('Authorization').split('Bearer ')[1]
        print("Received accessToken:", token)  # 受け取ったトークンのログ出力

        if res.status_code != 200:
            # raise HttpResponseNotAllowed(
            # raise PermissionDenied( //
            raise AuthenticationFailed(
                "Unauthorized firebase token."
            )
        user = fbClient.get_user()#ログインしているユーザー情報取得
        print(user)
        print(user.email)
        print(user.partner)
        print(user.id)

        if user.role == 'user':
        # 女性ユーザーの場合は、そのユーザーが作成した予定を取得
            queryset = Event.objects.filter(user=user)

        else: #user.role == 'partner':
        # パートナーの場合、許可されたメールアドレスに紐づく予定を取得 
            # allowed_emails = Viewer.objects.filter(
            #     user=user
            # ).values_list('allowed_email', flat=True)
            # queryset = Event.objects.filter(
            #     Q(user__role='user') & Q(user__email__in=allowed_emails)
            # )
            # queryset = Event.objects.filter(
            #     # eventviewer__partner_email=user.email
            #     # user__partner_email=user.email
            # )
            # .values_list('id', flat=True)
            user_ids = User.objects.filter(partner=user.id)
            # print(user_ids)
            # user_ids = [ 3 ]
            queryset = Event.objects.filter(user_id__in=user_ids)
            # queryset = Event.objects.filter(user=user)

        serializer = EventSerializer(queryset, many=True)
        return Response(serializer.data)


    def perform_create(self, serializer):
        # dbに保存
        serializer.save()

        # sperad sheetの更新も行う
        self.update_spreadsheet(serializer.validated_data['user'])
        
    
    def perform_update(self, serializer):
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
