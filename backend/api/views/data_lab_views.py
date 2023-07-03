from rest_framework.response import Response
from rest_framework import generics
from django_filters import rest_framework as filters
from rest_framework.views import APIView
from django.core import serializers

from django.http import JsonResponse
from django.views import View
import requests
import json

from api.serializers.data_lab_serializers import *

from database.data_lab.models import (
    ApiCall,
    FarmaciaDataLab,
    ImpuestosYDerechosDataLab,
    DOMDataLab,
    TransitoDataLab,
)

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

class UpdateEmpresasDataLabView(APIView):
    def get(self, request, *args, **kwargs):
        url = 'http://127.0.0.1:8000/api/mapa_legacy/empresas-total/1890-05-17/2023-05-08/'  # remplaza esto con la URL de tu API
        response = requests.get(url)
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
        url = 'http://127.0.0.1:8000/api/mapa_legacy/DOM-total/1890-05-17/2023-05-08/'  # remplaza esto con la URL de tu API
        response = requests.get(url)
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
        url = 'http://127.0.0.1:8000/api/mapa_legacy/transito-total/1890-05-17/2023-05-08/'  # remplaza esto con la URL de tu API
        response = requests.get(url)
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