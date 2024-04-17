from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, EventViewSet, SpreadSheetViewSet, ViewerViewSet
from . import views


router = DefaultRouter() #がAPIのルーティングを処理
router.register(r'users', UserViewSet) #/usersへのリクエストがUserViewSetにルーティング
router.register(r'events', EventViewSet) #/eventsへのリクエストがEventViewSetにルーティング
router.register(r'spreadsheets', SpreadSheetViewSet) #/spreadsheetへのリクエストがSpeadSheetViewSetにルーティング
router.register(r'viewers', ViewerViewSet) #/viewersへのリクエストがEventViewSetにルーティング

urlpatterns = [
    path('', include(router.urls)), # APIのベースURLを指定
]