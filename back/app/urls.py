from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, EventViewSet
from . import views, auth_views


router = DefaultRouter() #がAPIのルーティングを処理
router.register(r'users', UserViewSet) #/usersへのリクエストがUserViewSetにルーティング
router.register(r'events', EventViewSet) #/eventsへのリクエストがEventViewSetにルーティング


urlpatterns = [
    path('', include(router.urls)), # APIのベースURLを指定
    path('verify-token/', auth_views.verify_token, name='gverify_token'), #Firebaseトークン検証
]