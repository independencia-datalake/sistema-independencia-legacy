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
from rest_framework import status
import os

import openai

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

    # funcs

def rank_data(data, rank_field, value_field):
    # Ordenar los datos por el campo de ranking de forma ascendente
    # Tratar los valores None como infinitamente grandes
    sorted_data = sorted(data, key=lambda x: (x[rank_field] is None, x[rank_field]))
    
    # Formatear los datos ordenados
    formatted_data = [
        {
            rank_field: item[rank_field],
            'uv': item['uv'],
            value_field: item[value_field]
        }
        for item in sorted_data if item[rank_field] is not None
    ]
    
    return formatted_data

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
        
class RankEmpresasDataLabView(APIView):
    def get(self, request, *args, **kwargs):
        # Obtener el ApiCall más reciente con tipo 'IMPUESTOS Y DERECHOS'
        api_call = ApiCall.objects.filter(tipo_call='IMPUESTOS Y DERECHOS').order_by('-timestamp').first()

        if api_call is not None:
            # Obtener todos los objetos ImpuestosYDerechosDataLab asociados a ese ApiCall
            empresas_data_labs = ImpuestosYDerechosDataLab.objects.filter(api_call=api_call)
            
            # Convertir los objetos a formato JSON
            serializer = EmpresasDataLabSerializer(empresas_data_labs, many=True)
            data = serializer.data
            
            # Crear el ranking para cada tipo
            response_data = {
                'total': rank_data(data, 'rank_total', 'total'),
                'alcohol': rank_data(data, 'rank_alcohol', 'alcohol'),
                'comercial': rank_data(data, 'rank_comercial', 'comercial'),
                'profesional': rank_data(data, 'rank_profesional', 'profesional'),
                'industrial': rank_data(data, 'rank_industrial', 'industrial'),
                'microempresa': rank_data(data, 'rank_microempresa', 'microempresa'),
                'estacionada': rank_data(data, 'rank_estacionada', 'estacionada')
            }

            return Response(response_data)

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
        
class RankDomDataLabView(APIView):
    def get(self, request, *args, **kwargs):
        api_call = ApiCall.objects.filter(tipo_call='DOM').order_by('-timestamp').first()

        if api_call is not None:
            dom_data_labs = DOMDataLab.objects.filter(api_call=api_call)

            serializer = DOMDataLabSerializer(dom_data_labs, many=True)
            data= serializer.data
            response_data = {
                'total': rank_data(data, 'rank_total', 'total'),
                'anexion': rank_data(data, 'rank_anexion', 'anexion'),
                'antiguas': rank_data(data, 'rank_antiguas', 'antiguas'),
                'anulacion': rank_data(data, 'rank_anulacion', 'anulacion'),
                'cambio de destino': rank_data(data, 'rank_cambiodestino', 'cambio_de_destino'),
                'fusion': rank_data(data, 'rank_fusion', 'fusion'),
                'ley 20.898': rank_data(data, 'rank_ley20898', 'ley_20898'),
                'obras menores': rank_data(data, 'rank_obrasmenores', 'obras_menores'), 
                'permisos de edificacion': rank_data(data, 'rank_permisosedificacion', 'permisos_de_edificacion'),
                'recepcion final': rank_data(data, 'rank_recepcionfinal', 'recepcion_final'),
                'regularizaciones': rank_data(data, 'rank_regularizaciones', 'regularizaciones'),
                'regularizaciones ley 18.591': rank_data(data, 'rank_regularizaciones18591', 'regularizaciones_ley_18591'),
                'resolucion': rank_data(data, 'rank_resolucion', 'resolucion'),
                'subdivisiones': rank_data(data, 'rank_subdivisiones', 'subdivisiones'),
                'ventas por piso': rank_data(data, 'rank_ventasporpiso', 'ventas_por_piso')
            }

            def rename_key_in_results(results, old_key, new_key):
                        for item in results:
                            if old_key in item:
                                item[new_key] = item.pop(old_key)

                    # Renombrar la clave en los datos de 'obras menores'
            rename_key_in_results(response_data['cambio de destino'], 'cambio_de_destino', 'cambio de destino')
            rename_key_in_results(response_data['ley 20.898'], 'ley_20898', 'ley 20.898')
            rename_key_in_results(response_data['obras menores'], 'obras_menores', 'obras menores')
            rename_key_in_results(response_data['permisos de edificacion'], 'permisos_de_edificacion', 'permisos de edificacion')
            rename_key_in_results(response_data['recepcion final'], 'recepcion_final', 'recepcion final')
            rename_key_in_results(response_data['regularizaciones ley 18.591'], 'regularizaciones_ley_18591', 'regularizaciones ley 18.591')
            rename_key_in_results(response_data['ventas por piso'], 'ventas_por_piso', 'ventas por piso')
 
            return Response(response_data)
        
        else: 
            return Response({'error': 'No ApiCall found with tipo_call Empresas'}, status=404)

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
    

class GPTDataLabByUVView(APIView):
    def get(self, request, uv, *args, **kwargs):
        # Obtener el ApiCall más reciente con tipo 'TRANSITO'
        mensaje = GPTMessageDataLab.objects.filter(uv=uv)

        if mensaje is not None:
            try:
                gpt_data_lab = GPTMessageDataLab.objects.get(uv=uv)
            except TransitoDataLab.DoesNotExist:
                return Response({'error': f'No TransitoDataLab found with uv {uv}'}, status=404)
            serializer = GPTDataLabSerializer(gpt_data_lab)

            return Response(serializer.data)

        else:
            return Response({'error': 'No ApiCall found with tipo_call TRANSITO'}, status=404)
        
class UpdateGPTDataLabByUVView(APIView):
    def get(self, request, uv, *args, **kwargs):
        # Intentar obtener el registro de GPTMessageDataLab con la uv dada
        gpt_data_lab, created = GPTMessageDataLab.objects.get_or_create(uv=uv)
        
        # Generar el nuevo mensaje
        nuevo_mensaje = self.generar_mensaje(uv)

        # Actualizar el valor del mensaje
        gpt_data_lab.mensaje = nuevo_mensaje
        gpt_data_lab.save()

        serializer = GPTDataLabSerializer(gpt_data_lab)
        return Response(serializer.data)

    def generar_mensaje(self, uv):


        #Data impuestos y derechos
        api_call = ApiCall.objects.filter(tipo_call='IMPUESTOS Y DERECHOS').order_by('-timestamp').first()
        if api_call is not None:
            try:
                empresas_data_lab = ImpuestosYDerechosDataLab.objects.get(api_call=api_call, uv=uv)
            except ImpuestosYDerechosDataLab.DoesNotExist:
                return Response({'error': f'No TransitoDataLab found with uv {uv}'}, status=404)
            serializer = EmpresasDataLabSerializer(empresas_data_lab)
            data_empresas = serializer.data
        #Data Transito
        api_call = ApiCall.objects.filter(tipo_call='TRANSITO').order_by('-timestamp').first()
        if api_call is not None:
            try:
                transito_data_lab = TransitoDataLab.objects.get(api_call=api_call, uv=uv)
            except TransitoDataLab.DoesNotExist:
                return Response({'error': f'No TransitoDataLab found with uv {uv}'}, status=404)
            serializer = TransitoDataLabSerializer(transito_data_lab)
            data_transito = serializer.data
        #Data DOM
        api_call = ApiCall.objects.filter(tipo_call='DOM').order_by('-timestamp').first()
        if api_call is not None:
            try:
                dom_data_lab = DOMDataLab.objects.get(api_call=api_call, uv=uv)
            except DOMDataLab.DoesNotExist:
                return Response({'error': f'No TransitoDataLab found with uv {uv}'}, status=404)
            serializer = DOMDataLabSerializer(dom_data_lab)
            data_dom = serializer.data
        openai.api_key = os.getenv('GPT_TOKEN')

        text = f"""
        Generar un informe resumido basado en los datos de la Unidad Vecinal Nº{uv-1} de la comuna de Independencia en Santiago de Chile para el año 2022. Tenemos información de 7 Fuentes de Datos, que son: RENTAS MUNICIPALES (patentes comerciales, patentes industriales, Patentes de alcohol, patentes profesionales, patentes estacionadas, derechos de basura), TRÁNSITO (licencias de conducir, permisos de circulación), DOM (recepción final, regularizaciones, regularizaciones ley 18.591, obra menor, permisos de edificación, subdivisiones, certificado de informaciones previas), FARMACIA (ventas de farmacia), GESTIÓN SOCIAL (ayuda social), SEGURIDAD_DENUNCIAS (accidente peatón, accidente vehicular, amenaza, auto sospechoso, individuo sospechoso, ingesta alcohol vía pública, riña, robo o asalto, venta ilícitas de alcohol, violencia intrafamiliar, violencia de género), SEGURIDAD_RECLAMOS (comercio ambulante, información general, ruidos molestos, situación calle, vehículo abandonado, vehículo mal estacionado, vivienda).

        Estos son los datos específicos de la Unidad Vecinal Nº{uv-1} para cada Categoría de Datos, incluyendo los valores numéricos y el ranking en comparación con las otras Unidades Vecinales.

        patente comercial {data_empresas['comercial']}, {data_empresas['rank_comercial']}
        patente industrial {data_empresas['industrial']}, {data_empresas['rank_industrial']}
        patente alcohol {data_empresas['alcohol']}, {data_empresas['rank_alcohol']}
        patente profesional {data_empresas['profesional']}, {data_empresas['rank_profesional']}
        patente estacionada {data_empresas['estacionada']}, {data_empresas['rank_estacionada']}
        derecho de basura 198, 7
        licencias de conducir {data_transito['licencia_conducir']}, {data_transito['rank_licencia_conducir']}
        permisos de circulación {data_transito['permiso_circulacion']}, {data_transito['rank_permiso_circulacion']}
        recepción final {data_dom['recepcion_final']}, {data_dom['rank_recepcionfinal']}
        regularizaciones {data_dom['regularizaciones']}, {data_dom['rank_regularizaciones']}
        regularizaciones ley 18.591 {data_dom['regularizaciones_ley_18591']}, {data_dom['rank_regularizaciones18591']}
        obra menor {data_dom['obras_menores']}, {data_dom['rank_obrasmenores']}
        permisos de edificación {data_dom['permisos_de_edificacion']}, {data_dom['rank_permisosedificacion']}
        subdivisiones {data_dom['subdivisiones']}, {data_dom['rank_subdivisiones']}
        certificado de informaciones previas 58, 4
        ventas de farmacia 165, 1
        ayuda social 25, 16
        accidente peatón 1, 26
        accidente vehicular 2, 23
        amenaza 0, 26
        auto sospechoso 5, 15
        individuo sospechoso 7, 15
        ingesta alcohol vía publica 12, 5
        riña 2, 20
        robos u/o asaltos 5, 16
        ventas ilícitas de alcohol 0, 26
        violencia intrafamiliar 2, 20
        violencia de género 0, 26
        comercio ambulante 2, 23
        información general 15, 15
        ruidos molestos 55, 14
        situación calle 6, 24
        vehículo abandonado 2, 23
        vehículo mal estacionado 11, 20
        vivienda 3, 24

        Genera un informe en menos de 700 palabras estructurado en formato JSON donde cada llave sea el nombre de la fuente de datos y el valor asociado sea un breve resumen interpretativo que destaque los valores más altos. Cada resumen debe ser redactado en un sólo párrafo por cada fuente de datos, haciendo que el ranking, el dato duro y la interpretación queden fluidos dentro de la redacción. No incluir frases como "Fuente de Datos" o "Destacado 2022".
        Considerar que hay un total de 26 unidades vecinales.
        """

        # GPT 3.5
        response = openai.Completion.create(
        model="gpt-3.5-turbo-instruct",
        prompt=text,
        temperature=0,
        max_tokens=1000,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
        stop=None,
        )
        mensaje = response.choices[0]["text"].strip()

    

        # # GPT 4
        # response = openai.ChatCompletion.create(
        # model="gpt-4",
        # messages=[
        #         {"role": "system", "content": "Eres un ayudante útil."},
        #         {"role": "user", "content": text}
        #     ],
        # temperature=0,
        # max_tokens=1000,
        # top_p=1,
        # frequency_penalty=0,
        # presence_penalty=0,
        # stop=None,
        # )

        # mensaje = response.choices[0].message['content']
        return mensaje
    
     