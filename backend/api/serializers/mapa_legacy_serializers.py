from rest_framework import serializers
from database.mapa_legacy.models import *

class EmpresasSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Empresas
        fields = '__all__'

class CountEmpresasByUVSerializer(serializers.Serializer):
    uv = serializers.IntegerField()
    densidad = serializers.IntegerField()

