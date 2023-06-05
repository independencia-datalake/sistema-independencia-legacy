from rest_framework.response import Response
from rest_framework import generics
from django_filters import rest_framework as filters
from django.db.models import Count
from rest_framework.views import APIView
from datetime import datetime
from django.db.models import Count, Window, F, Case, When, Value, IntegerField
from django.db.models.functions import RowNumber
from django.db.models import Q

from collections import defaultdict

from api.serializers.mapa_legacy_serializers import *
from database.mapa_legacy.models import (
    Empresas,

)
from database.farmacia.models import (
    ComprobanteVenta
)

# FARMACIA
class CountFarmaciaByUV(APIView):
    def get(self, request, fecha_inicio, fecha_fin):
        # Initialize a dict with all UV values, each having ventas = 0.
        uv_values = range(1, 28)
        uv_ventas = {uv: {'ventas': 0} for uv in uv_values}
        # Perform the actual query.
        queryset = ComprobanteVenta.objects.filter(estado='FINALIZADA',created__gte=fecha_inicio, created__lte=fecha_fin).values('comprador__uv').annotate(ventas=Count('id')).order_by('comprador__uv')

        # Update the dict with actual ventas.
        for obj in queryset:
            uv_ventas[obj['comprador__uv']] = obj['ventas']

        # Convert dict items to a list of dicts.
        data = [{'uv': uv, 'ventas': ventas} for uv, ventas in uv_ventas.items()]
        

        return Response(data)

# EMPRESAS

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
    
# class CountEmpresasByUV(APIView):
#     def get(self, request):
#         queryset = Empresas.objects.values('uv').annotate(densidad=Count('id')).order_by('uv')
#         serializer = CountEmpresasByUVSerializer(queryset, many=True)
#         return Response(serializer.data)

class CountEmpresasByUV(APIView):
    def get(self, request, fecha_inicio, fecha_fin):
        uv_values = range(1, 28)
        uv_densities = {uv: {'total': 0, 'comercial': 0, 'alcohol': 0} for uv in uv_values}

        # Cuenta el total de empresas
        queryset_total = Empresas.objects.filter(created__gte=fecha_inicio, created__lte=fecha_fin).values('uv').annotate(total=Count('id')).order_by('uv')


        # Cuenta las empresas comerciales
        queryset_comercial = Empresas.objects.filter(tipo='comercial', created__gte=fecha_inicio, created__lte=fecha_fin).values('uv').annotate(comercial=Count('id')).order_by('uv')

        # Cuenta las empresas de alcohol
        queryset_alcohol = Empresas.objects.filter(tipo='alcohol', created__gte=fecha_inicio, created__lte=fecha_fin).values('uv').annotate(alcohol=Count('id')).order_by('uv')

        # Actualiza uv_densities con los resultados obtenidos
        for qs in [queryset_total, queryset_comercial, queryset_alcohol]:
            for obj in qs:
                uv = obj['uv']
                for key, value in obj.items():
                    if key != 'uv':
                        uv_densities[uv][key] = value

        # Convierte los resultados a la forma requerida
        data = [{'uv': uv, 'total': values['total'], 'comercial': values['comercial'], 'alcohol': values['alcohol']} for uv, values in uv_densities.items()]


        return Response(data)
    
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


    #LICENCIAS DE CONDUCIR

class CountTransitoByUV(APIView):
    def get(self, request, fecha_inicio, fecha_fin):
        uv_values = range(1, 28)  # Define the range of UV values.

        # Initialize a dict with all UV values, each having density = 0.
        uv_densities = {uv: {'licencia_conducir': 0, 'permiso_circulacion': 0} for uv in uv_values}

        # Perform the actual query for LicenciaConducir.
        # queryset_licencia = LicenciaConducir.objects.values('uv').annotate(licencia_conducir=Count('id')).order_by('uv')
        queryset_licencia = LicenciaConducir.objects.filter(fecha__gte=fecha_inicio, fecha__lte=fecha_fin).values('uv').annotate(licencia_conducir=Count('id')).order_by('uv')

        # Perform the actual query for PermisoCirculacion.
        # queryset_permiso = PermisosCirculacion.objects.values('uv').annotate(permiso_circulacion=Count('id')).order_by('uv')
        queryset_permiso = PermisosCirculacion.objects.filter(fecha__gte=fecha_inicio, fecha__lte=fecha_fin).values('uv').annotate(permiso_circulacion=Count('id')).order_by('uv')

        # Update the dict with actual densities for LicenciaConducir.
        for obj in queryset_licencia:
            uv_densities[obj['uv']]['licencia_conducir'] = obj['licencia_conducir']

        # Update the dict with actual densities for PermisoCirculacion.
        for obj in queryset_permiso:
            uv_densities[obj['uv']]['permiso_circulacion'] = obj['permiso_circulacion']

        # Convert dict items to a list of dicts.
        data = [{'uv': uv, 'licencia_conducir': values['licencia_conducir'], 'permiso_circulacion': values['permiso_circulacion']} for uv, values in uv_densities.items()]

        return Response(data)
    

    #DOM OBRAS MUNICIPALES

class CountObrasMunicipalesByUV(APIView):
    def get(self, request):
        uv_values = range(1, 28)  # Define the range of UV values.

        # Initialize a dict with all UV values, each having density = 0.
        uv_densities = {uv: 0 for uv in uv_values}

        # Perform the actual query.
        queryset = DOM.objects.values('uv').annotate(densidad=Count('id')).order_by('uv')

        # Update the dict with actual densities.
        for obj in queryset:
            uv_densities[obj['uv']] = obj['densidad']

        # Convert dict items to a list of dicts.
        data = [{'uv': uv, 'densidad': density} for uv, density in uv_densities.items()]

        return Response(data)
    
    # RANGO FECHAS
class RangoFechasGeneralView(generics.RetrieveAPIView):
    serializer_class = RangoFechasByTipo

    def get_object(self):
        # Obtener el tipo de empresa del parámetro de URL
        mapa = self.kwargs['mapa']
        tipo = self.kwargs['tipo']

        if mapa == "farmacia":
    # Código para el caso "farmacia"
            print("Estás en la sección de la farmacia.")
        elif mapa == "dimap":
            # Código para el caso "dimap"
            print("Estás en la sección de dimap.")
        elif mapa == "seguridad":
            # Código para el caso "seguridad"
            print("Estás en la sección de seguridad.")
        elif mapa == "impuestosyderechos":
            # Código para el caso "impuestosyderechos"
            if tipo == 'total':
                fecha_inicio = Empresas.objects.earliest('created').created.date()
                fecha_fin = Empresas.objects.latest('created').created.date()
            elif tipo == 'comercial':
                fecha_inicio = Empresas.objects.filter(tipo='comercial').earliest('created').created.date()
                fecha_fin = Empresas.objects.filter(tipo='comercial').latest('created').created.date()
            elif tipo == 'alcohol':
                fecha_inicio = Empresas.objects.filter(tipo='alcohol').earliest('created').created.date()
                fecha_fin = Empresas.objects.filter(tipo='alcohol').latest('created').created.date()                
        elif mapa == "ayudasocial":
            # Código para el caso "ayudasocial"
            print("Estás en la sección de ayuda social.")
        elif mapa == "excensionbasura":
            # Código para el caso "excensionbasura"
            print("Estás en la sección de excensión de basura.")
        elif mapa == "obrasmunicipales":
            # Código para el caso "obrasmunicipales"
            print("Estás en la sección de obras municipales.")
        elif mapa == "transito":
            # Código para el caso "transito"
            if tipo == 'licencia conducir':
                fecha_inicio = LicenciaConducir.objects.earliest('fecha').fecha
                fecha_fin = LicenciaConducir.objects.latest('fecha').fecha
            elif tipo == 'permiso circulacion':
                fecha_inicio = PermisosCirculacion.objects.earliest('fecha').fecha
                fecha_fin = PermisosCirculacion.objects.latest('fecha').fecha             
        else:
            # Código para cualquier otro caso
            print("Sección desconocida.")

        # Devolver los valores en un objeto para ser serializados
        return {'fecha_inicio': fecha_inicio, 'fecha_fin': fecha_fin}