from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializer import CallesIndependenciaSerializer, UVSerializer
from core.models import UV, CallesIndependencia

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