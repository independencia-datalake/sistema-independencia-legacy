from rest_framework.response import Response
from rest_framework import generics
from django_filters import rest_framework as filters
from rest_framework.views import APIView
from django.http import HttpRequest
from django.core import serializers

from django.http import JsonResponse
from django.views import View
import requests
import json
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.request import Request
from rest_framework.urlpatterns import format_suffix_patterns

from api.serializers.data_lab_serializers import *

from database.data_lab.models import (
    ApiCall,
    FarmaciaDataLab,
    ImpuestosYDerechosDataLab,
    DOMDataLab,
    TransitoDataLab,
)
from database.mapa_legacy.models import (
    Empresas,
    DOM,
    LicenciaConducir,
    PermisosCirculacion
)
from database.farmacia.models import (
    ComprobanteVenta
)
from api.views.mapa_legacy_views import *

# FARMACIA
class FarmaciaDataLabView(APIView):
    def get(self, request, *args, **kwargs):
        api_call = ApiCall.objects.filter(tipo_call='FARMACIA').order_by('-timestamp').first()

        if api_call is not None:
            farmacia_data_lab = FarmaciaDataLab.objects.filter(api_call=api_call)

            serializer = FarmaciaDataLabSerializer(farmacia_data_lab, many=True)
            return Response({'data': serializer.data})
        else:
            return Response({'error': 'No ApiCall found with tipo_call FARMACIA'}, status=404)  

class FarmaciaDataLabByUVView(APIView):
    def get(self, request, uv, *args, **kwargs):
        api_call = ApiCall.objects.filter(tipo_call='FARMACIA').order_by('-timestamp').first()

        if api_call is not None:
            try:
                farmacia_data_lab = FarmaciaDataLab.objects.get(api_call, uv=uv)
            except FarmaciaDataLab.DoesNotExist:
                return Response({'error': f'No FarmaciaDataLab found with uv {uv}'}, status=404)
            serializer = FarmaciaDataLabSerializer(farmacia_data_lab)

            return Response(serializer.data)
        else: 
            return Response({'error': 'No ApiCall found with tipo_call FARMACIA'}, status=404)

class UpdateFarmaciaDataLabView(View):
    def get(self, request, *args, **kwargs):   
        url = request.build_absolute_uri('/api/mapa_legacy/rango-fechas/farmacia/total/')
        headers = {'Content-Type': 'application/json'}

        response = requests.get(url, headers=headers)
        rango_fechas = response.json()

        fecha_inicio = rango_fechas['fecha_inicio']
        fecha_fin = rango_fechas['fecha_fin']
        url = request.build_absolute_uri(f'/api/mapa_legacy/farmacia-total/{fecha_inicio}/{fecha_fin}')
        response = requests.get(url, headers=headers)
        data = response.json()

        api_call = ApiCall.objects.create(tipo_call='FARMACIA')

        for item in data:
            FarmaciaDataLab.objects.create(
                uv=item['uv'],
                ventas=item['ventas'],
                rank_ventas=item['rank_ventas'],
                api_call=api_call
            )
        return JsonResponse({'status': 'success'})
    
# IMPUESTOS Y DERECHO
class EmpresasDataLabView(APIView):
    def get(self, request, *args, **kwargs):
        # Obtener el ApiCall más reciente con tipo 'TRANSITO'
        api_call = ApiCall.objects.filter(tipo_call='IMPUESTOS Y DERECHOS').order_by('-timestamp').first()

        if api_call is not None:
            # Obtener todos los objetos TransitoDataLab asociados a ese ApiCall
            empresas_data_labs = ImpuestosYDerechosDataLab.objects.filter(api_call=api_call)

            # Convertir los objetos TransitoDataLab a formato JSON
            serializer = EmpresasDataLabSerializer(empresas_data_labs, many=True)

            return Response({'data': serializer.data})

        else:
            return Response({'error': 'No ApiCall found with tipo_call Empresas'}, status=404)

class EmpresasDataLabByUVView(APIView):
    def get(self, request, uv, *args, **kwargs):
        # Obtener el ApiCall más reciente con tipo 'TRANSITO'
        api_call = ApiCall.objects.filter(tipo_call='IMPUESTOS Y DERECHOS').order_by('-timestamp').first()

        if api_call is not None:
            try:
                empresas_data_lab = ImpuestosYDerechosDataLab.objects.get(api_call=api_call, uv=uv)
            except ImpuestosYDerechosDataLab.DoesNotExist:
                return Response({'error': f'No TransitoDataLab found with uv {uv}'}, status=404)
            serializer = EmpresasDataLabSerializer(empresas_data_lab)

            return Response(serializer.data)

        else:
            return Response({'error': 'No ApiCall found with tipo_call Empresas'}, status=404)    

@method_decorator(csrf_exempt, name='dispatch')
class UpdateEmpresasDataLabView(APIView):
    def get(self, request, *args, **kwargs):

        url = request.build_absolute_uri('/api/mapa_legacy/rango-fechas/impuestosyderechos/total/')
        headers = {'Content-Type': 'application/json'}
        
        response = requests.get(url, headers=headers)
        rango_fechas = response.json()

        fecha_inicio = rango_fechas['fecha_inicio']
        fecha_fin = rango_fechas['fecha_fin']
        url = request.build_absolute_uri(f'/api/mapa_legacy/empresas-total/{fecha_inicio}/{fecha_fin}')
        response = requests.get(url, headers=headers)
        data = response.json()

        api_call = ApiCall.objects.create(tipo_call='IMPUESTOS Y DERECHOS')

        for item in data:
            ImpuestosYDerechosDataLab.objects.create(
                uv=item['uv'],
                total=item['total'],
                alcohol=item['alcohol'],
                comercial=item['comercial'],
                profesional=item['profesional'],
                industrial=item['industrial'],
                microempresa=item['microempresa'],
                estacionada=item['estacionada'],
                rank_total=item['rank_total'],
                rank_alcohol=item['rank_alcohol'],
                rank_comercial=item['rank_comercial'],
                rank_profesional=item['rank_profesional'],
                rank_industrial=item['rank_industrial'],
                rank_microempresa=item['rank_microempresa'],
                rank_estacionada=item['rank_estacionada'],
                api_call=api_call,     
            )
        return JsonResponse({'status': 'success'})

# OBRAS MUNICIPALES

class DOMDataLabView(APIView):
    def get(self, request, *args, **kwargs):
        # Obtener el ApiCall más reciente con tipo 'TRANSITO'
        api_call = ApiCall.objects.filter(tipo_call='DOM').order_by('-timestamp').first()

        if api_call is not None:
            dom_data_labs = DOMDataLab.objects.filter(api_call=api_call)

            # Convertir los objetos TransitoDataLab a formato JSON
            serializer = DOMDataLabSerializer(dom_data_labs, many=True)

            return Response({'data': serializer.data})

        else:
            return Response({'error': 'No ApiCall found with tipo_call TRANSITO'}, status=404)  

class DOMDataLabByUVView(APIView):
    def get(self, request, uv, *args, **kwargs):
        # Obtener el ApiCall más reciente con tipo 'TRANSITO'
        api_call = ApiCall.objects.filter(tipo_call='DOM').order_by('-timestamp').first()

        if api_call is not None:
            try:
                dom_data_lab = DOMDataLab.objects.get(api_call=api_call, uv=uv)
            except DOMDataLab.DoesNotExist:
                return Response({'error': f'No TransitoDataLab found with uv {uv}'}, status=404)
            serializer = DOMDataLabSerializer(dom_data_lab)

            return Response(serializer.data)

        else:
            return Response({'error': 'No ApiCall found with tipo_call TRANSITO'}, status=404)

class UpdateDomDatalabView(View):
    def get(self, request, *args, **kargs):

        url = request.build_absolute_uri('/api/mapa_legacy/rango-fechas/obrasmunicipales/total/')
        headers = {'Content-Type': 'application/json'}

        response = requests.get(url, headers=headers)
        rango_fechas = response.json()

        fecha_inicio = rango_fechas['fecha_inicio']
        fecha_fin = rango_fechas['fecha_fin']
        url = request.build_absolute_uri(f'/api/mapa_legacy/DOM-total/{fecha_inicio}/{fecha_fin}')
        response = requests.get(url, headers=headers)
        data = response.json()

        api_call = ApiCall.objects.create(tipo_call='DOM')   

        for item in data:
            DOMDataLab.objects.create(
                uv=item['uv'],
                total=item['total'],
                anexion=item['anexion'],
                antiguas=item['antiguas'],
                anulacion=item['anulacion'],
                cambio_de_destino=item['cambio de destino'],
                fusion=item['fusion'],
                ley_20898=item['ley 20.898'],
                obras_menores=item['obras menores'],
                permisos_de_edificacion=item['permisos de edificacion'],
                recepcion_final=item['recepcion final'],
                regularizaciones=item['regularizaciones'],
                regularizaciones_ley_18591=item['regularizaciones ley 18.591'],
                resolucion=item['resolucion'],
                subdivisiones=item['subdivisiones'],
                ventas_por_piso=item['ventas por piso'],
                rank_total=item['rank_total'],
                rank_anexion=item['rank_anexion'],
                rank_antiguas=item['rank_antiguas'],
                rank_anulacion=item['rank_anulacion'],
                rank_cambiodestino=item['rank_cambiodestino'],
                rank_fusion=item['rank_fusion'],
                rank_ley20898=item['rank_ley20898'],
                rank_obrasmenores=item['rank_obrasmenores'],
                rank_permisosedificacion=item['rank_permisosedificacion'],
                rank_recepcionfinal=item['rank_recepcionfinal'],
                rank_regularizaciones=item['rank_regularizaciones'],
                rank_regularizaciones18591=item['rank_regularizaciones18591'],
                rank_resolucion=item['rank_resolucion'],
                rank_subdivisiones=item['rank_subdivisiones'],
                rank_ventasporpiso=item['rank_ventasporpiso'],
                api_call=api_call,
            )
        return JsonResponse({'status': 'success'})

# TRANSITO

class TransitoDataLabView(APIView):
    def get(self, request, *args, **kwargs):
        # Obtener el ApiCall más reciente con tipo 'TRANSITO'
        api_call = ApiCall.objects.filter(tipo_call='TRANSITO').order_by('-timestamp').first()

        if api_call is not None:
            # Obtener todos los objetos TransitoDataLab asociados a ese ApiCall
            transito_data_labs = TransitoDataLab.objects.filter(api_call=api_call)

            # Convertir los objetos TransitoDataLab a formato JSON
            serializer = TransitoDataLabSerializer(transito_data_labs, many=True)

            return Response({'data': serializer.data})

        else:
            return Response({'error': 'No ApiCall found with tipo_call TRANSITO'}, status=404)
        
class TransitoDataLabByUVView(APIView):
    def get(self, request, uv, *args, **kwargs):
        # Obtener el ApiCall más reciente con tipo 'TRANSITO'
        api_call = ApiCall.objects.filter(tipo_call='TRANSITO').order_by('-timestamp').first()

        if api_call is not None:
            try:
                transito_data_lab = TransitoDataLab.objects.get(api_call=api_call, uv=uv)
            except TransitoDataLab.DoesNotExist:
                return Response({'error': f'No TransitoDataLab found with uv {uv}'}, status=404)
            serializer = TransitoDataLabSerializer(transito_data_lab)

            return Response(serializer.data)

        else:
            return Response({'error': 'No ApiCall found with tipo_call TRANSITO'}, status=404)

class UpdateTransitoDataLabView(View):
    def get(self, request, *args, **kwargs):
        url = request.build_absolute_uri('/api/mapa_legacy/rango-fechas/transito/licencia%20conducir/')
        headers = {'Content-Type': 'application/json'}

        response = requests.get(url, headers=headers)
        rango_fechas = response.json()

        fecha_inicio = rango_fechas['fecha_inicio']
        fecha_fin = rango_fechas['fecha_fin']
        url = request.build_absolute_uri(f'/api/mapa_legacy/transito-total/{fecha_inicio}/{fecha_fin}')
        response = requests.get(url, headers=headers)
        data = response.json()



        api_call = ApiCall.objects.create(tipo_call='TRANSITO')

        for item in data:
            TransitoDataLab.objects.create(
                uv=item['uv'],
                licencia_conducir=item['licencia_conducir'],
                permiso_circulacion=item['permiso_circulacion'],
                rank_licencia_conducir=item['rank_licencia'],
                rank_permiso_circulacion=item['rank_permiso'],
                api_call=api_call,
            )
        return JsonResponse({'status': 'success'})
    
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