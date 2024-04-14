from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet
from . import views

router = DefaultRouter() #がAPIのルーティングを処理
router.register(r'events', EventViewSet) #/eventsへのリクエストがEventViewSetにルーティング

urlpatterns = [
    path('', include(router.urls)), # APIのベースURLを指定
]