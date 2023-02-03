from rest_framework import serializers
from database.models import *

class UVSerializer(serializers.ModelSerializer):
    class Meta:
        model = UV
        fields = '__all__'

class CallesIndependenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CallesIndependencia
        fields = '__all__'

class PersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Persona
        fields = '__all__'

class TelefonoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Telefono
        fields = '__all__'

class CorreoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Correo
        fields = '__all__'

class DireccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direccion
        fields = '__all__'

class PersonaInfoSaludSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonaInfoSalud
        fields = '__all__'

class PersonaArchivosSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonaArchivos
        fields = '__all__'

