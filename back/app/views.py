from django.shortcuts import render
from .models import User, Event
from .serializers import UserSerializer, EventSerializer
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import JsonResponse
from langchain_openai import OpenAI
from langchain.prompts import PromptTemplate
from django.conf import settings

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