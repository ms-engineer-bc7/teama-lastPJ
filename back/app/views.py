from django.shortcuts import render
from .models import Event
from .serializers import EventSerializer
from rest_framework import viewsets

class EventViewSet(viewsets.ModelViewSet): #ModelViewSetを継承。CRUD操作を行うための一連のビューが自動的に作成
    queryset = Event.objects.all() #Eventモデルの全オブジェクトを取得
    serializer_class = EventSerializer #リクエストのデータが適切にシリアライズされるようになる
