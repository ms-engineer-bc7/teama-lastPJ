from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer): # Eventテーブル
    class Meta:
        model = Event
        fields = '__all__'  # すべてのフィールドを含める