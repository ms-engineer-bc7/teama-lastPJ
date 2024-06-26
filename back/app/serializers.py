from rest_framework import serializers
from .models import User, Event, SpreadSheet

class UserSerializer(serializers.ModelSerializer): #Userテーブル
    # partner_email = serializers.EmailField(source='partner.email', allow_null=True) #ユーザーのパートナーのメールアドレス
    class Meta:
        model = User
        fields = '__all__' # すべてのフィールドを含める

class EventSerializer(serializers.ModelSerializer): # Eventテーブル
    # user = UserSerializer #イベントがユーザーに関連している
    class Meta:
        model = Event
        fields = '__all__'  


class SpreadSheetSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = SpreadSheet
        fields = ['sheet_id', 'shared_email']


