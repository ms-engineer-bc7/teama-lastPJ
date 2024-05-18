from django.test import TestCase, RequestFactory
from django.conf import settings
from rest_framework.test import APIClient
from ..views import EventViewSet
from ..serializers import EventSerializer  
from ..models import Event  

class EventViewSetTestCase(TestCase):
    def setUp(self):
        # テストのセットアップ
        # テストクライアントを作成し、APIキーを設定
        self.client = APIClient()
        settings.OPENAI_API_KEY = 'test_key'

        # テスト用のイベントを作成
        self.event = Event.objects.create(title='検査')

    def test_set_llm_message(self):
        # set_llm_messageメソッドが期待通りに動作することをテスト

        # 適切なリクエストデータを用意
        request_data = {'title': self.event.title}
        serializer = EventSerializer(data=request_data)

        # シリアライザが有効であることを確認
        self.assertTrue(serializer.is_valid())

        # イベントビューセットのインスタンスを作成
        viewset = EventViewSet()
        viewset.request = RequestFactory().get('/')

        # set_llm_messageメソッドを呼び出し
        updated_serializer = viewset.set_llm_message(serializer)

        # メッセージが正しく生成されていることを検証
        # テスト環境では、OpenAIからの実際のレスポンスは模擬
        # 以下のassertは、レスポンスが適切に設定されているか確認
        self.assertIn('alert_message_for_u', updated_serializer.validated_data)
        self.assertIn('alert_message_for_p', updated_serializer.validated_data)

        # レスポンスの文字数が200文字以内であるかを確認
        self.assertLessEqual(len(updated_serializer.validated_data['alert_message_for_u']), 200)
        self.assertLessEqual(len(updated_serializer.validated_data['alert_message_for_p']), 200)

        # 必要なキーワードが含まれているかどうかをテスト
        # ここでは例として'サポート'という単語が含まれているかをチェック
        self.assertIn('サポート', updated_serializer.validated_data['alert_message_for_u'])
        self.assertIn('サポート', updated_serializer.validated_data['alert_message_for_p'])
