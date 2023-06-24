from rest_framework import serializers
from database.core.models import *

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

class PersonaSerializer2(serializers.ModelSerializer):
    info_salud = serializers.SerializerMethodField()  # Nuevo campo

    class Meta:
        model = Persona
        fields = ['id', 'numero_identificacion', 'nombre_completo', 'info_salud']  # Asegúrate de incluir los campos necesarios

    def get_info_salud(self, obj):
        info_salud = PersonaInfoSalud.objects.filter(persona=obj)  # Obtiene la información de salud relacionada con esta persona
        return PersonaInfoSaludSerializer(info_salud, many = True).data  # Retorna los datos serializados

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

