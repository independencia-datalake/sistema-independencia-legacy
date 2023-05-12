from rest_framework.response import Response
from rest_framework import generics
from django_filters import rest_framework as filters
from django.db.models import Count
from rest_framework.views import APIView
from datetime import datetime
from django.db.models import Count, Window, F, Case, When, Value, IntegerField
from django.db.models.functions import RowNumber
from django.db.models import Q

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
    
# POR FECHA

class countEmpresasByUVFecha(APIView):
    def get(self, request, fecha_inicio, fecha_fin):
        queryset = Empresas.objects.filter(created__gte=fecha_inicio, created__lte=fecha_fin).values('uv').annotate(densidad=Count('id')).order_by('uv')
        serializer = CountEmpresasByUVSerializer(queryset, many=True)
        return Response(serializer.data)
    
class CountEmpresasByUVFechaTipo(APIView):
    def get(self, request, fecha_inicio, fecha_fin, tipo):
        queryset = Empresas.objects.filter(created__gte=fecha_inicio, created__lte=fecha_fin, tipo=tipo).values('uv').annotate(densidad=Count('id')).order_by('uv')
        serializer = CountEmpresasByUVSerializer(queryset, many=True)
        return Response(serializer.data)


class countEmpresasByUVFechaRank(APIView):
    def get(self, request, fecha_inicio, fecha_fin):
        # Queryset para las filas con uv diferente de 1
        queryset_without_uv1 = Empresas.objects.filter(
            created__gte=fecha_inicio,
            created__lte=fecha_fin
        ).exclude(uv=1).values('uv').annotate(densidad=Count('id')).annotate(
            rank=Window(expression=RowNumber(), order_by=F('densidad').desc())
        ).order_by('uv')

        # Queryset para la fila con uv=1
        queryset_uv1 = Empresas.objects.filter(
            created__gte=fecha_inicio,
            created__lte=fecha_fin,
            uv=1
        ).values('uv').annotate(densidad=Count('id')).annotate(rank=Value(27))

        # Combinamos los dos querysets y ordenamos por uv
        final_queryset = list(queryset_without_uv1) + list(queryset_uv1)
        final_queryset.sort(key=lambda x: x['uv'])

        serializer = CountEmpresasByUVRankSerializer(final_queryset, many=True)
        return Response(serializer.data)
    
    # RANGO FECHAS
class RangoFechasByTipoView(generics.RetrieveAPIView):
    serializer_class = RangoFechasByTipo

    def get_object(self):
        # Obtener el tipo de empresa del parámetro de URL
        tipo = self.kwargs['tipo']

        if tipo == 'total':
            # Obtener la fecha más antigua y la fecha más reciente de todas las empresas
            fecha_inicio = Empresas.objects.earliest('created').created.date()
            fecha_fin = Empresas.objects.latest('created').created.date()
        else:
            # Obtener la fecha más antigua y la fecha más reciente del modelo "Empresas" para el tipo especificado
            fecha_inicio = Empresas.objects.filter(tipo=tipo).earliest('created').created.date()
            fecha_fin = Empresas.objects.filter(tipo=tipo).latest('created').created.date()

        # Devolver los valores en un objeto para ser serializados
        return {'fecha_inicio': fecha_inicio, 'fecha_fin': fecha_fin}