from rest_framework.response import Response
from rest_framework import generics
from django_filters import rest_framework as filters
from django.db.models import Count
from rest_framework.views import APIView

from api.serializers.mapa_legacy_serializers import *
from database.mapa_legacy.models import (
    Empresas,

)


#EMPRESAS

class EmpresasListCreateAPIViw(generics.ListCreateAPIView):
    queryset = Empresas.objects.all()
    serializer_class = EmpresasSerializer

    def perfrom_create(self, serializer):
        instance = serializer.save()

class EmpresasByUVAPIViw(generics.ListAPIView):
    serializer_class = EmpresasSerializer
 
    def get_queryset(self):
        uv_id = self.kwargs['uv_id']
        queryset = Empresas.objects.filter(uv__id=uv_id)
        return queryset 
    
class CountEmpresasByUV(APIView):
    def get(self, request):
        queryset = Empresas.objects.values('uv').annotate(densidad=Count('id')).order_by('uv')
        serializer = CountEmpresasByUVSerializer(queryset, many=True)
        return Response(serializer.data)
    
class CountComercialEmpresasByUV(APIView):

    def get(self, request):
        queryset = Empresas.objects.filter(tipo="comercial").values('uv').annotate(densidad=Count('id')).order_by('uv')
        serializer = CountEmpresasByUVSerializer(queryset, many=True)
        return Response(serializer.data)