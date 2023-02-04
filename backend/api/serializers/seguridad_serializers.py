from rest_framework import serializers
from database.seguridad.models import *

class ClasificacionDelitoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClasificacionDelito
        fields = '__all__'

class DelitoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Delito
        fields = '__all__'

class LlamadoSeguridadSerializer(serializers.ModelSerializer):
    class Meta:
        model = LlamadoSeguridad
        fields = '__all__'

class DenuncianteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Denunciante
        fields = '__all__'

class RequerimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Requerimiento
        fields = '__all__'
