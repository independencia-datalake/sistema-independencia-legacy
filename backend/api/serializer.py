from rest_framework import serializers
from core.models import UV, CallesIndependencia

class UVSerializer(serializers.ModelSerializer):
    class Meta:
        model = UV
        fields = '__all__'

class CallesIndependenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CallesIndependencia
        fields = '__all__'
