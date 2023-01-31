from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers.seguridad_serializers import (
    ClasificacionDelitoSerializer, 
    DelitoSerializer,
    LlamadoSeguridadSerializer,
    DenuncianteSerializer,
    RequerimientoSerializer,
)
from database.models import (
    ClasificacionDelito, 
    Delito,
    LlamadoSeguridad,
    Denunciante,
    Requerimiento,
)

@api_view(['GET'])
def get_clasificacion_delito(request):
    items = ClasificacionDelito.objects.all()
    serializer = ClasificacionDelitoSerializer(items, many=True)
    return Response(serializer.data)

def get_delito(request):
    items = Delito.objects.all()
    serializer = DelitoSerializer(items, many=True)
    return Response(serializer.data)

def get_llamado_seguridad(request):
    items = LlamadoSeguridad.objects.all()
    serializer = LlamadoSeguridadSerializer(items, many=True)
    return Response(serializer.data)

def get_denunciante(request):
    items = Denunciante.objects.all()
    serializer = DenuncianteSerializer(items, many=True)
    return Response(serializer.data)

def get_requerimiento(request):
    items = Requerimiento.objects.all()
    serializer = RequerimientoSerializer(items, many=True)
    return Response(serializer.data)