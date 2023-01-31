from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers.core_serializers import *
from database.models import (
    UV, 
    CallesIndependencia,
    Persona,
    Telefono,
    Correo,
    Direccion,
    PersonaInfoSalud,
    PersonaArchivos,
)

    ## GET

@api_view(['GET'])
def get_data_uv(request):
    items = UV.objects.all()
    serializer = UVSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_data_calles_independencia(request):
    items = CallesIndependencia.objects.all()
    serializer = CallesIndependenciaSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_data_persona(request):
    items = Persona.objects.all()
    serializer = PersonaSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_data_telefono(request):
    items = Telefono.objects.all()
    serializer = TelefonoSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_data_correo(request):
    items = Correo.objects.all()
    serializer = CorreoSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_data_direccion(request):
    items = Direccion.objects.all()
    serializer = DireccionSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_data_persona_info_salud(request):
    items = PersonaInfoSalud.objects.all()
    serializer = PersonaInfoSaludSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_data_persona_archivos(request):
    items = PersonaArchivos.objects.all()
    serializer = PersonaArchivosSerializer(items, many=True)
    return Response(serializer.data)