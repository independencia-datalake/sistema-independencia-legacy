from rest_framework import serializers
from database.mapa_legacy.models import *

class EmpresasSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Empresas
        fields = '__all__'

class CountEmpresasByUVSerializer(serializers.Serializer):
    uv = serializers.IntegerField()
    densidad = serializers.IntegerField()
    comercial = serializers.IntegerField()
    alcohol = serializers.IntegerField()

class CountEmpresasByUVRankSerializer(serializers.Serializer):
    uv = serializers.IntegerField()
    densidad = serializers.IntegerField()
    rank = serializers.IntegerField()

class GSLSerializer(serializers.ModelSerializer):
    class Meta:
        model = GestionSocialLocal
        fields = '__all__'

class RangoFechasByTipo(serializers.Serializer):
    fecha_inicio = serializers.DateField()
    fecha_fin = serializers.DateField()


# FARMACIA
class CountFarmaciaByUVSerializer(serializers.Serializer):
    uv = serializers.IntegerField()
    ventas = serializers.IntegerField()
    
# TRANSITO

class CountLicenciaConducirByUVSerializer(serializers.Serializer):
    uv = serializers.IntegerField()
    licencia_conducir = serializers.IntegerField()
    permiso_circulacion = serializers.IntegerField()


#DOM OBRAS MUNICIPALES

class CountObrasMunicipalesByUVSerializer(serializers.Serializer):
    uv = serializers.IntegerField()
    densidad = serializers.IntegerField()