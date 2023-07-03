from rest_framework.response import Response
from rest_framework import generics
from django_filters import rest_framework as filters
from django.db.models import Count
from rest_framework.views import APIView
from datetime import datetime, timedelta
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
        queryset = ComprobanteVenta.objects.filter(
            estado='FINALIZADA',
            created__gte=fecha_inicio,
            created__lte=fecha_fin
        ).values('comprador__direcciones__uv').annotate(
            ventas=Count('id')
        ).order_by('comprador__direcciones__uv')

        # Update the dict with actual ventas.
        for obj in queryset:
            uv_ventas[obj['comprador__direcciones__uv']]['ventas'] = obj['ventas']

        # Convert dict items to a list of dicts.
        data = [{'uv': uv, 'ventas': ventas['ventas']} for uv, ventas in uv_ventas.items()]

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

class CountEmpresasByUV(APIView):
    def get(self, request, fecha_inicio, fecha_fin):

        # Convertir las fechas de string a datetime
        fecha_inicio_dt = datetime.strptime(fecha_inicio, '%Y-%m-%d')
        fecha_fin_dt = datetime.strptime(fecha_fin, '%Y-%m-%d')

        # Calcular las fechas del año pasado
        fecha_inicio_ly = fecha_inicio_dt - timedelta(days=365)
        fecha_fin_ly = fecha_fin_dt - timedelta(days=365)

        uv_values = range(1, 28)  # Incluyendo la UV 1 para el resto de las variables

        uv_densities = {uv: {'total': 0, 'alcohol': 0, 'comercial': 0, 'profesional': 0, 'industrial': 0, 'microempresa': 0, 'estacionada': 0} for uv in uv_values}
        uv_densities_ly = {uv: {'total': 0} for uv in uv_values}

        # Cuenta el total de empresas
        queryset_total = Empresas.objects.filter(created__gte=fecha_inicio, created__lte=fecha_fin).values('uv').annotate(total=Count('id')).order_by('uv')
        queryset_total_ly = Empresas.objects.filter(created__gte=fecha_inicio_ly, created__lte=fecha_fin_ly).values('uv').annotate(total=Count('id')).order_by('uv')

        # Cuenta las empresas de alcohol
        queryset_alcohol = Empresas.objects.filter(tipo='alcohol', created__gte=fecha_inicio, created__lte=fecha_fin).values('uv').annotate(alcohol=Count('id')).order_by('uv')
        queryset_alcohol_ly = Empresas.objects.filter(tipo='alcohol', created__gte=fecha_inicio_ly, created__lte=fecha_fin_ly).values('uv').annotate(alcohol=Count('id')).order_by('uv')

        # Cuenta las empresas comerciales
        queryset_comercial = Empresas.objects.filter(tipo='comercial', created__gte=fecha_inicio, created__lte=fecha_fin).values('uv').annotate(comercial=Count('id')).order_by('uv')
        queryset_comercial_ly = Empresas.objects.filter(tipo='comercial', created__gte=fecha_inicio_ly, created__lte=fecha_fin_ly).values('uv').annotate(comercial=Count('id')).order_by('uv')

        # Cuenta las empresas profesionales
        queryset_profesional = Empresas.objects.filter(tipo='profesional', created__gte=fecha_inicio, created__lte=fecha_fin).values('uv').annotate(profesional=Count('id')).order_by('uv')
        queryset_profesional_ly = Empresas.objects.filter(tipo='profesional', created__gte=fecha_inicio_ly, created__lte=fecha_fin_ly).values('uv').annotate(profesional=Count('id')).order_by('uv')

        # Cuentas las empresas de industrial
        queryset_industrial = Empresas.objects.filter(tipo='industrial', created__gte=fecha_inicio, created__lte=fecha_fin).values('uv').annotate(industrial=Count('id')).order_by('uv')
        queryset_industrial_ly = Empresas.objects.filter(tipo='industrial', created__gte=fecha_inicio_ly, created__lte=fecha_fin_ly).values('uv').annotate(industrial=Count('id')).order_by('uv')

        # Cuenta las empresas microempresas
        queryset_microempresa = Empresas.objects.filter(tipo='microempresa', created__gte=fecha_inicio, created__lte=fecha_fin).values('uv').annotate(microempresa=Count('id')).order_by('uv')
        queryset_microempresa_ly = Empresas.objects.filter(tipo='microempresa', created__gte=fecha_inicio_ly, created__lte=fecha_fin_ly).values('uv').annotate(microempresa=Count('id')).order_by('uv')

        # Cuenta las empresas estacionada
        queryset_estacionada = Empresas.objects.filter(tipo='estacionado', created__gte=fecha_inicio, created__lte=fecha_fin).values('uv').annotate(estacionada=Count('id')).order_by('uv')
        queryset_estacionada_ly = Empresas.objects.filter(tipo='estacionado', created__gte=fecha_inicio_ly, created__lte=fecha_fin_ly).values('uv').annotate(estacionada=Count('id')).order_by('uv')

        # Actualiza uv_densities con los resultados obtenidos
        for qs in [queryset_total, queryset_alcohol, queryset_comercial, queryset_profesional, queryset_industrial, queryset_microempresa, queryset_estacionada]:
            for obj in qs:
                uv = obj['uv']
                for key, value in obj.items():
                    if key != 'uv':
                        uv_densities[uv][key] = value

        list_names = ['total', 'alcohol', 'comercial', 'profesional', 'industrial', 'microempresa', 'estacionada']

        ranked_lists = {list_name: [(uv, values[list_name]) for uv, values in uv_densities.items() if uv != 1] for list_name in list_names}

        ranks = {key: 1 for key in ranked_lists.keys()}

        for list_name, uv_list in ranked_lists.items():
            uv_list.sort(key=lambda x: x[1], reverse=True)
            for uv, _ in uv_list:
                uv_densities[uv]['rank_'+list_name] = ranks[list_name]
                ranks[list_name] += 1

        # # Crear listas de tuples para los rankings
        # uv_totals = [(uv, values['total']) for uv, values in uv_densities.items() if uv != 1]
        # uv_comerciales = [(uv, values['comercial']) for uv, values in uv_densities.items() if uv != 1]
        # uv_alcohol = [(uv, values['alcohol']) for uv, values in uv_densities.items() if uv != 1]
        # uv_industrial = [(uv, values['industrial']) for uv, values in uv_densities.items() if uv != 1]
        # uv_totals.sort(key=lambda x: x[1], reverse=True)
        # uv_comerciales.sort(key=lambda x: x[1], reverse=True)
        # uv_alcohol.sort(key=lambda x: x[1], reverse=True)
        # uv_industrial.sort(key=lambda x: x[1], reverse=True)

        # # Asignar ranking a cada UV basado en el total y el número de comerciales, alcohol y industrial
        # rank_total = 1
        # rank_comercial = 1
        # rank_alcohol = 1
        # rank_industrial = 1
        # for uv, total in uv_totals:
        #     uv_densities[uv]['rank_total'] = rank_total
        #     rank_total += 1
        # for uv, comercial in uv_comerciales:
        #     uv_densities[uv]['rank_comercial'] = rank_comercial
        #     rank_comercial += 1
        # for uv, alcohol in uv_alcohol:
        #     uv_densities[uv]['rank_alcohol'] = rank_alcohol
        #     rank_alcohol += 1
        # for uv, industrial in uv_industrial:
        #     uv_densities[uv]['rank_industrial'] = rank_industrial
        #     rank_industrial += 1

        # # Si la UV 1 está en los datos, asignarle un valor por defecto para los rankings
        # if 1 in uv_densities:
        #     uv_densities[1]['rank_total'] = None
        #     uv_densities[1]['rank_comercial'] = None
        #     uv_densities[1]['rank_alcohol'] = None
        #     uv_densities[1]['rank_industrial'] = None

        # # LAST YEAR
        # uv_densities_ly = {uv: {'total': 0, 'comercial': 0, 'alcohol': 0, 'industrial': 0} for uv in uv_values}

        # for qs_ly in [queryset_total_ly, queryset_comercial_ly, queryset_alcohol_ly, queryset_industrial_ly]:
        #     for obj in qs_ly:
        #         uv = obj['uv']
        #         for key, value in obj.items():
        #             if key != 'uv':
        #                 uv_densities_ly[uv][key] = value

        # uv_totals_ly = [(uv, values['total']) for uv, values in uv_densities_ly.items() if uv != 1]
        # uv_comerciales_ly = [(uv, values['comercial']) for uv, values in uv_densities_ly.items() if uv != 1]
        # uv_alcohol_ly = [(uv, values['alcohol']) for uv, values in uv_densities_ly.items() if uv != 1]
        # uv_industrial_ly = [(uv, values['industrial']) for uv, values in uv_densities_ly.items() if uv != 1]

        # uv_totals_ly.sort(key=lambda x: x[1], reverse=True)
        # uv_comerciales_ly.sort(key=lambda x: x[1], reverse=True)
        # uv_alcohol_ly.sort(key=lambda x: x[1], reverse=True)
        # uv_industrial_ly.sort(key=lambda x: x[1], reverse=True)

        # rank_total_ly = 1
        # rank_comercial_ly = 1
        # rank_alcohol_ly = 1
        # rank_industrial_ly = 1

        # for uv, total in uv_totals_ly:
        #     uv_densities_ly[uv]['rank_total_ly'] = rank_total_ly
        #     rank_total_ly += 1

        # for uv, comercial in uv_comerciales_ly:
        #     uv_densities_ly[uv]['rank_comercial_ly'] = rank_comercial_ly
        #     rank_comercial_ly += 1

        # for uv, alcohol in uv_alcohol_ly:
        #     uv_densities_ly[uv]['rank_alcohol_ly'] = rank_alcohol_ly
        #     rank_alcohol_ly += 1

        # for uv, industrial in uv_industrial_ly:
        #     uv_densities_ly[uv]['rank_industrial_ly'] = rank_industrial_ly
        #     rank_industrial_ly += 1

        # if 1 in uv_densities_ly:
        #     uv_densities_ly[1]['rank_total_ly'] = None
        #     uv_densities_ly[1]['rank_comercial_ly'] = None
        #     uv_densities_ly[1]['rank_alcohol_ly'] = None
        #     uv_densities_ly[1]['rank_industrial_ly'] = None

        # Convierte los resultados a la forma requerida
        data = [{'uv': uv, 
                 'total': values['total'], 
                 'alcohol': values['alcohol'], 
                 'comercial': values['comercial'], 
                 'profesional': values['profesional'],
                 'industrial': values['industrial'], 
                 'microempresa': values['microempresa'],
                 'estacionada': values['estacionada'],
                 'rank_total': values.get('rank_total', None), 
                 'rank_alcohol': values.get('rank_alcohol', None), 
                 'rank_comercial': values.get('rank_comercial', None),
                 'rank_profesional': values.get('rank_profesional', None),                
                 'rank_industrial': values.get('rank_industrial', None),  
                 'rank_microempresa': values.get('rank_microempresa', None),
                 'rank_estacionada': values.get('rank_estacionada', None),
                #  'rank_total_ly': uv_densities_ly[uv].get('rank_total_ly', None),
                #  'rank_comercial_ly': uv_densities_ly[uv].get('rank_comercial_ly', None),
                #  'rank_alcohol_ly': uv_densities_ly[uv].get('rank_alcohol_ly', None),
                #  'rank_industrial_ly': uv_densities_ly[uv].get('rank_industrial_ly', None)
                 } for uv, values in uv_densities.items()]

        return Response(data)

    #LICENCIAS DE CONDUCIR

class CountTransitoByUV(APIView):
    def get(self, request, fecha_inicio, fecha_fin):

        # Convertir las fechas de string a datetime
        fecha_inicio_dt = datetime.strptime(fecha_inicio, '%Y-%m-%d')
        fecha_fin_dt = datetime.strptime(fecha_fin, '%Y-%m-%d')

        # Calcular las fechas del año pasado
        fecha_inicio_ly = fecha_inicio_dt - timedelta(days=365)
        fecha_fin_ly = fecha_fin_dt - timedelta(days=365)

        uv_values = range(1, 28)  # Define the range of UV values.

        # Initialize a dict with all UV values, each having density = 0.
        uv_densities = {uv: {'licencia_conducir': 0, 'permiso_circulacion': 0} for uv in uv_values}
        uv_densities_ly = {uv: {'total': 0} for uv in uv_values}

        # Perform the actual query for LicenciaConducir.
        queryset_licencia = LicenciaConducir.objects.filter(fecha__gte=fecha_inicio, fecha__lte=fecha_fin).values('uv').annotate(licencia_conducir=Count('id')).order_by('uv')
        queryset_licencia_ly = LicenciaConducir.objects.filter(fecha__gte=fecha_inicio_ly, fecha__lte=fecha_fin_ly).values('uv').annotate(licencia_conducir=Count('id')).order_by('uv')
        # Perform the actual query for PermisoCirculacion.
        queryset_permiso = PermisosCirculacion.objects.filter(fecha__gte=fecha_inicio, fecha__lte=fecha_fin).values('uv').annotate(permiso_circulacion=Count('id')).order_by('uv')
        queryset_permiso_ly = PermisosCirculacion.objects.filter(fecha__gte=fecha_inicio_ly, fecha__lte=fecha_fin_ly).values('uv').annotate(permiso_circulacion=Count('id')).order_by('uv')
        # Update the dict with actual densities for LicenciaConducir.
        for obj in queryset_licencia:
            uv_densities[obj['uv']]['licencia_conducir'] = obj['licencia_conducir']

        # Update the dict with actual densities for PermisoCirculacion.
        for obj in queryset_permiso:
            uv_densities[obj['uv']]['permiso_circulacion'] = obj['permiso_circulacion']

        uv_licencia = [(uv, values['licencia_conducir']) for uv, values in uv_densities.items() if uv != 1]
        uv_permiso = [(uv, values['permiso_circulacion']) for uv, values in uv_densities.items() if uv != 1]
        uv_licencia.sort(key=lambda x: x[1], reverse=True)
        uv_permiso.sort(key=lambda x: x[1], reverse=True)

        rank_licencia = 1
        rank_permiso = 1
        for uv, licencia in uv_licencia:
            uv_densities[uv]['rank_licencia'] = rank_licencia
            rank_licencia += 1
        for uv, permiso in uv_permiso:
            uv_densities[uv]['rank_permiso'] = rank_permiso
            rank_permiso += 1

        if 1 in uv_densities:
            uv_densities[1]['rank_licencia'] = None
            uv_densities[1]['rank_permiso'] = None

        # LAST YEAR
        uv_densities_ly = {uv: {'licencia_conducir': 0, 'permiso_circulacion': 0} for uv in uv_values}
        for obj in queryset_licencia_ly:
            uv_densities_ly[obj['uv']]['licencia_conducir'] = obj['licencia_conducir']

        # Update the dict with actual densities for PermisoCirculacion.
        for obj in queryset_permiso_ly:
            uv_densities_ly[obj['uv']]['permiso_circulacion'] = obj['permiso_circulacion']

        uv_licencia_ly = [(uv, values['licencia_conducir']) for uv, values in uv_densities_ly.items() if uv != 1]
        uv_permiso_ly = [(uv, values['permiso_circulacion']) for uv, values in uv_densities_ly.items() if uv != 1]

        uv_licencia_ly.sort(key=lambda x: x[1], reverse=True)
        uv_permiso_ly.sort(key=lambda x: x[1], reverse=True)

        rank_licencia_ly = 1
        rank_permiso_ly = 1

        for uv, licencia in uv_licencia_ly:
            uv_densities_ly[uv]['rank_licencia_ly'] = rank_licencia_ly
            rank_licencia_ly += 1
        for uv, permiso in uv_permiso_ly:
            uv_densities_ly[uv]['rank_permiso_ly'] = rank_permiso_ly
            rank_permiso_ly += 1

        if 1 in uv_densities_ly:
            uv_densities_ly[1]['rank_licencia_ly'] = None
            uv_densities_ly[1]['rank_permiso_ly'] = None


        # Convert dict items to a list of dicts.
        data = [{'uv': uv, 
                 'licencia_conducir': values['licencia_conducir'], 
                 'permiso_circulacion': values['permiso_circulacion'],
                 'rank_licencia': values.get('rank_licencia', None),
                 'rank_permiso': values.get('rank_permiso', None),
                 'rank_licencia_ly': uv_densities_ly[uv].get('rank_licencia_ly', None),
                 'rank_permiso_ly': uv_densities_ly[uv].get('rank_permiso_ly', None)} for uv, values in uv_densities.items()]

        return Response(data)
    

    #DOM OBRAS MUNICIPALES

class CountObrasMunicipalesByUV(APIView):
    def get(self, request, fecha_inicio, fecha_fin):

        # Convertir las fechas de string a datetime
        fecha_inicio_dt = datetime.strptime(fecha_inicio, '%Y-%m-%d')
        fecha_fin_dt = datetime.strptime(fecha_fin, '%Y-%m-%d')

        # Calcular las fechas del año pasado
        fecha_inicio_ly = fecha_inicio_dt - timedelta(days=365)
        fecha_fin_ly = fecha_fin_dt - timedelta(days=365)

        uv_values = range(1, 28)  # Define the range of UV values.

        # Initialize a dict with all UV values, each having density = 0.
        uv_densities = {uv: {'total': 0, 'anexion': 0, 'antiguas': 0, 'anulacion': 0, 'cambiodestino': 0, 'fusion': 0, 'ley20898': 0, 'obrasmenores': 0, 'permisosedificacion': 0, 'recepcionfinal': 0, 'regularizaciones': 0, 'regularizaciones18591': 0, 'resolucion': 0, 'subdivisiones': 0, 'ventasporpiso': 0} for uv in uv_values}
        uv_densities_ly = {uv: {'total': 0} for uv in uv_values}
        # Perform the actual query.
        queryset_total = DOM.objects.filter(created__gte=fecha_inicio, created__lte=fecha_fin).values('uv').annotate(total=Count('id')).order_by('uv')
        queryset_total_ly = DOM.objects.filter(created__gte=fecha_inicio_ly, created__lte=fecha_fin_ly).values('uv').annotate(total=Count('id')).order_by('uv')
        
        queryset_anexion = DOM.objects.filter(tramite='ANEXIÓN', created__gte=fecha_inicio, created__lte=fecha_fin).values('uv').annotate(anexion=Count('id')).order_by('uv')
        queryset_anexion_ly = DOM.objects.filter(tramite='ANEXIÓN', created__gte=fecha_inicio_ly, created__lte=fecha_fin_ly).values('uv').annotate(anexion=Count('id')).order_by('uv')

        queryset_antiguas = DOM.objects.filter(tramite='ANTIGUAS', created__gte=fecha_inicio, created__lte=fecha_fin).values('uv').annotate(antiguas=Count('id')).order_by('uv')
        queryset_antiguas_ly = DOM.objects.filter(tramite='ANTIGUAS', created__gte=fecha_inicio_ly, created__lte=fecha_fin_ly).values('uv').annotate(antiguas=Count('id')).order_by('uv')

        queryset_anulacion = DOM.objects.filter(tramite='ANULACION', created__gte=fecha_inicio, created__lte=fecha_fin).values('uv').annotate(anulacion=Count('id')).order_by('uv')
        queryset_anulacion_ly = DOM.objects.filter(tramite='ANULACION', created__gte=fecha_inicio_ly, created__lte=fecha_fin_ly).values('uv').annotate(anulacion=Count('id')).order_by('uv')

        queryset_cambiodestino = DOM.objects.filter(tramite='CAMBIO DE DESTINO', created__gte=fecha_inicio, created__lte=fecha_fin).values('uv').annotate(cambiodestino=Count('id')).order_by('uv')
        queryset_cambiodestino_ly = DOM.objects.filter(tramite='CAMBIO DE DESTINO', created__gte=fecha_inicio_ly, created__lte=fecha_fin_ly).values('uv').annotate(cambiodestino=Count('id')).order_by('uv')

        queryset_fusion = DOM.objects.filter(tramite='FUSION', created__gte=fecha_inicio, created__lte=fecha_fin).values('uv').annotate(fusion=Count('id')).order_by('uv')
        queryset_fusion_ly = DOM.objects.filter(tramite='FUSION', created__gte=fecha_inicio_ly, created__lte=fecha_fin_ly).values('uv').annotate(fusion=Count('id')).order_by('uv')

        queryset_ley20898 = DOM.objects.filter(tramite='LEY 20.898', created__gte=fecha_inicio, created__lte=fecha_fin).values('uv').annotate(ley20898=Count('id')).order_by('uv')
        queryset_ley20898_ly = DOM.objects.filter(tramite='LEY 20.898', created__gte=fecha_inicio_ly, created__lte=fecha_fin_ly).values('uv').annotate(ley20898=Count('id')).order_by('uv')

        queryset_obrasmenores = DOM.objects.filter(tramite='OBRAS MENORES', created__gte=fecha_inicio, created__lte=fecha_fin).values('uv').annotate(obrasmenores=Count('id')).order_by('uv')
        queryset_obrasmenores_ly = DOM.objects.filter(tramite='OBRAS MENORES', created__gte=fecha_inicio_ly, created__lte=fecha_fin_ly).values('uv').annotate(obrasmenores=Count('id')).order_by('uv')

        queryset_permisosedificacion = DOM.objects.filter(tramite='PERMISO DE EDIFICACIÓN', created__gte=fecha_inicio, created__lte=fecha_fin).values('uv').annotate(permisosedificacion=Count('id')).order_by('uv')
        queryset_permisosedificacion_ly = DOM.objects.filter(tramite='PERMISO DE EDIFICACIÓN', created__gte=fecha_inicio_ly, created__lte=fecha_fin_ly).values('uv').annotate(permisosedificacion=Count('id')).order_by('uv')

        queryset_recepcionfinal = DOM.objects.filter(tramite='RECEPCIÓN FINAL', created__gte=fecha_inicio, created__lte=fecha_fin).values('uv').annotate(recepcionfinal=Count('id')).order_by('uv')
        queryset_recepcionfinal_ly = DOM.objects.filter(tramite='RECEPCIÓN FINAL', created__gte=fecha_inicio_ly, created__lte=fecha_fin_ly).values('uv').annotate(recepcionfinal=Count('id')).order_by('uv')

        queryset_regularizaciones = DOM.objects.filter(tramite='REGULARIZACIONES', created__gte=fecha_inicio, created__lte=fecha_fin).values('uv').annotate(regularizaciones=Count('id')).order_by('uv')
        queryset_regularizaciones_ly = DOM.objects.filter(tramite='REGULARIZACIONES', created__gte=fecha_inicio_ly, created__lte=fecha_fin_ly).values('uv').annotate(regularizaciones=Count('id')).order_by('uv')

        queryset_regularizaciones18591 = DOM.objects.filter(tramite='REGULARIZACIONES LEY 18.591', created__gte=fecha_inicio, created__lte=fecha_fin).values('uv').annotate(regularizaciones18591=Count('id')).order_by('uv')
        queryset_regularizaciones18591_ly = DOM.objects.filter(tramite='REGULARIZACIONES LEY 18.591', created__gte=fecha_inicio_ly, created__lte=fecha_fin_ly).values('uv').annotate(regularizaciones18591=Count('id')).order_by('uv')

        queryset_resolucion = DOM.objects.filter(tramite='RESOLUCIÓN', created__gte=fecha_inicio, created__lte=fecha_fin).values('uv').annotate(resolucion=Count('id')).order_by('uv')
        queryset_resolucion_ly = DOM.objects.filter(tramite='RESOLUCIÓN', created__gte=fecha_inicio_ly, created__lte=fecha_fin_ly).values('uv').annotate(resolucion=Count('id')).order_by('uv')

        queryset_subdivisiones = DOM.objects.filter(tramite='SUBDIVISIONES', created__gte=fecha_inicio, created__lte=fecha_fin).values('uv').annotate(subdivisiones=Count('id')).order_by('uv')
        queryset_subdivisiones_ly = DOM.objects.filter(tramite='SUBDIVISIONES', created__gte=fecha_inicio_ly, created__lte=fecha_fin_ly).values('uv').annotate(subdivisiones=Count('id')).order_by('uv')

        queryset_ventaporpiso = DOM.objects.filter(tramite='VENTA POR PISO', created__gte=fecha_inicio, created__lte=fecha_fin).values('uv').annotate(ventasporpiso=Count('id')).order_by('uv')
        queryset_ventaporpiso_ly = DOM.objects.filter(tramite='VENTA POR PISO', created__gte=fecha_inicio_ly, created__lte=fecha_fin_ly).values('uv').annotate(ventasporpiso=Count('id')).order_by('uv')


        
        # Update the dict with actual densities.
        # Actualiza uv_densities con los resultados obtenidos
        for qs in [queryset_total, queryset_anexion, queryset_antiguas, queryset_anulacion, queryset_cambiodestino, queryset_fusion, queryset_ley20898, queryset_obrasmenores, queryset_permisosedificacion, queryset_recepcionfinal, queryset_regularizaciones, queryset_regularizaciones18591, queryset_resolucion, queryset_subdivisiones, queryset_ventaporpiso]:
            for obj in qs:
                uv = obj['uv']
                for key, value in obj.items():
                    if key != 'uv':
                        uv_densities[uv][key] = value

        list_names = ['total', 'anexion', 'antiguas', 'anulacion', 'cambiodestino', 'fusion', 'ley20898', 'obrasmenores', 'permisosedificacion', 'recepcionfinal', 'regularizaciones', 'regularizaciones18591', 'resolucion', 'subdivisiones', 'ventasporpiso']

        ranked_lists = {list_name: [(uv, values[list_name]) for uv, values in uv_densities.items() if uv != 1] for list_name in list_names}

        ranks = {key: 1 for key in ranked_lists.keys()}

        for list_name, uv_list in ranked_lists.items():
            uv_list.sort(key=lambda x: x[1], reverse=True)
            for uv, _ in uv_list:
                uv_densities[uv]['rank_'+list_name] = ranks[list_name]
                ranks[list_name] += 1


        # Convert dict items to a list of dicts.
        data = [{'uv': uv,
                 'total': values['total'],
                 'anexion': values['anexion'],
                 'antiguas': values['antiguas'],
                 'anulacion': values['anulacion'],
                 'cambio de destino': values['cambiodestino'],
                 'fusion': values['fusion'],
                 'ley 20.898': values['ley20898'],
                 'obras menores': values['obrasmenores'],
                 'permisos de edificacion': values['permisosedificacion'],
                 'recepcion final': values['recepcionfinal'],
                 'regularizaciones': values['regularizaciones'],
                 'regularizaciones ley 18.591': values['regularizaciones18591'],
                 'resolucion': values['resolucion'],
                 'subdivisiones': values['subdivisiones'],
                 'ventas por piso': values['ventasporpiso'],
                 'rank_total': values.get('rank_total', None), 
                 'rank_anexion': values.get('rank_anexion', None),
                 'rank_antiguas': values.get('rank_antiguas', None),
                 'rank_anulacion': values.get('rank_anulacion', None),
                 'rank_cambiodestino': values.get('rank_cambiodestino', None),
                 'rank_fusion': values.get('rank_fusion', None),
                 'rank_ley20898': values.get('rank_ley20898', None),
                 'rank_obrasmenores': values.get('rank_obrasmenores', None),
                 'rank_permisosedificacion': values.get('rank_permisosedificacion', None),
                 'rank_recepcionfinal': values.get('rank_recepcionfinal', None),
                 'rank_regularizaciones': values.get('rank_regularizaciones', None),
                 'rank_regularizaciones18591': values.get('rank_regularizaciones18591', None),
                 'rank_resolucion': values.get('rank_resolucion', None),
                 'rank_subdivisiones': values.get('rank_subdivisiones', None),
                 'rank_ventasporpiso': values.get('rank_ventasporpiso', None)
                 } for uv, values in uv_densities.items()]

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
            # print("Estás en la sección de la farmacia.")
            fecha_inicio = ComprobanteVenta.objects.filter(estado='FINALIZADA').earliest('created').created.date()
            fecha_fin = ComprobanteVenta.objects.filter(estado='FINALIZADA').latest('created').created.date()
        elif mapa == "dimap":
            # Código para el caso "dimap"
            print("Estás en la sección de dimap.")
        elif mapa == "seguridad":
            # Código para el caso "seguridad"
            print("Estás en la sección de seguridad.")
        elif mapa == "impuestosyderechos":
            # Código para el caso "impuestosyderechos"

            queryset = Empresas.objects

            if tipo != 'total':
                if tipo == 'estacionada': tipo='estacionado'
                queryset = queryset.filter(tipo=tipo)


            fecha_inicio = queryset.earliest('created').created.date()
            fecha_fin = queryset.latest('created').created.date()
                                       
        elif mapa == "ayudasocial":
            # Código para el caso "ayudasocial"
            print("Estás en la sección de ayuda social.")
        elif mapa == "excensionbasura":
            # Código para el caso "excensionbasura"
            print("Estás en la sección de excensión de basura.")
        elif mapa == "obrasmunicipales":
            # Código para el caso "obrasmunicipales"

            tipo_to_tramite = {
                'anexion': 'ANEXIÓN',
                'antiguas': 'ANTIGUAS',
                'anulacion': 'ANULACION',
                'cambio de destino': 'CAMBIO DE DESTINO',
                'fusion': 'FUSION',
                'ley 20.898': 'LEY 20.898',
                'obras menores': 'OBRAS MENORES',
                'permisos de edificacion': 'PERMISO DE EDIFICACIÓN',
                'recepcion final': 'RECEPCIÓN FINAL',
                'regularizaciones': 'REGULARIZACIONES',
                'regularizaciones ley 18.591': 'REGULARIZACIONES LEY 18.591',
                'resolucion': 'RESOLUCIÓN',
                'subdivisiones': 'SUBDIVISIONES',
                'ventas por piso': 'VENTA POR PISO',
            }

            queryset = DOM.objects

            # Si el tipo no es 'total', añadir un filtro al queryset
            if tipo != 'total':
                tramite = tipo_to_tramite[tipo]  # Obtiene el valor del trámite correspondiente al tipo
                queryset = queryset.filter(tramite=tramite)

            fecha_inicio = queryset.earliest('created').created.date()
            fecha_fin = queryset.latest('created').created.date()

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