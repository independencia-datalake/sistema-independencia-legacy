from rest_framework.response import Response
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from django.db.models import F
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from api.filters.farmacia_filters import ProductoFarmaciaFilter, ComprobanteVentaFilter
from .permissions_views import *
from rest_framework.exceptions import NotFound
import pandas as pd
from django.http import HttpResponse
from rest_framework.views import APIView

from api.serializers.farmacia_serializers import *
from database.farmacia.models import (
    Laboratorios, 
    ProductoFarmacia,
    ComprobanteVenta,
    Recetas,
    ProductoVendido,
    CargaProducto,
)

    # PAGINACION

class CustomPageNumberPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000

    ## Laboratorios

class LaboratoriosListCreateAPIViw(generics.ListCreateAPIView):
    queryset = Laboratorios.objects.all()
    serializer_class = LaboratoriosSerializer

    def perfrom_create(self, serializer):
        instance = serializer.save()

class LaboratoriosListByNombreAPIViw(generics.ListAPIView):
    serializer_class = LaboratoriosSerializer

    def get_queryset(self):
        nombre = self.kwargs['nombre']
        return Laboratorios.objects.filter(nombre_laboratorio__iexact=nombre)

class LaboratoriosDetailAPIViw(generics.RetrieveAPIView):
    queryset = Laboratorios.objects.all()
    serializer_class = LaboratoriosSerializer
    lookup_field = 'pk'

class LaboratoriosUpdateAPIViw(generics.UpdateAPIView):
    queryset = Laboratorios.objects.all()
    serializer_class = LaboratoriosSerializer
    lookup_field = 'pk'

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class LaboratoriosDeleteAPIViw(generics.DestroyAPIView):
    queryset = Laboratorios.objects.all()
    serializer_class = LaboratoriosSerializer
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)


    ## Producto Farmacia

class ProductoFarmaciaListCreateAPIViw(generics.ListCreateAPIView):
    
    queryset = ProductoFarmacia.objects.all()
    serializer_class = ProductoFarmaciaSerializer
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedorNOPOST]

    def perfrom_create(self, serializer):
        instance = serializer.save()

class ProductoFarmaciaList2CreateAPIViw(generics.ListCreateAPIView):
    queryset = ProductoFarmacia.objects.all()
    serializer_class = ProductoFarmaciaSerializer
    pagination_class = CustomPageNumberPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = ProductoFarmaciaFilter
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedorNOPOST]

    def perfrom_create(self, serializer):
        instance = serializer.save()

class ProductoFarmaciaDetailAPIViw(generics.RetrieveAPIView):
    queryset = ProductoFarmacia.objects.all()
    serializer_class = ProductoFarmaciaSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedorNOPOST]


class ProductoFarmaciaUpdateAPIViw(generics.UpdateAPIView):
    queryset = ProductoFarmacia.objects.all()
    serializer_class = ProductoFarmaciaSerializer
    lookup_field = 'pk'

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class ProductoFarmaciaDeleteAPIViw(generics.DestroyAPIView):
    queryset = ProductoFarmacia.objects.all()
    serializer_class = ProductoFarmaciaSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta]

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)

class ProductoFarmaciaIngresoAceptado(APIView):
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedorNOPOST]
    def post(self, request, pk, format=None):
        producto = get_object_or_404(ProductoFarmacia, pk=pk)
        producto.estado = 'ACEPTADO'
        producto.save()
        return Response({'status': 'Producto aceptado'}, status=status.HTTP_200_OK)

    ## Comprobante Venta

class ComprobanteVentaListCreateAPIViw(generics.ListCreateAPIView):
    queryset = ComprobanteVenta.objects.all().order_by('-created')
    serializer_class = ComprobanteVentaSerializer
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perform_create(self, serializer):
        instance = serializer.save()

class ComprobanteVentaList2CreateAPIViw(generics.ListCreateAPIView):
    queryset = ComprobanteVenta.objects.all().order_by('-created')
    serializer_class = ComprobanteVentaSerializer2
    pagination_class = CustomPageNumberPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = ComprobanteVentaFilter
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perform_create(self, serializer):
        instance = serializer.save()

class UltimoComprobanteVentaAPIViw(generics.RetrieveAPIView):
    serializer_class = ComprobanteVentaSerializer
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def get_object(self):
        latest_comprobante = ComprobanteVenta.objects.latest('created')
        return latest_comprobante

class UltimoComprobanteVentaByPersonaAPIView(generics.RetrieveAPIView):
    serializer_class = ComprobanteVentaSerializer
    permission_classes = [IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def get_object(self):
        persona_id = self.kwargs.get('persona_id')
        case = self.request.query_params.get('case', '1')  # case es '1' por defecto

        query = ComprobanteVenta.objects.filter(comprador=persona_id)
        if case == '2':
            query = query.filter(estado='FINALIZADA')
        try:
            latest_comprobante = query.latest('created')
            return latest_comprobante
        except ComprobanteVenta.DoesNotExist:
            raise NotFound('NoHayComprobante')
        
class ComprobantesVentaHistoricoByPersonaAPIView(generics.ListAPIView):
    serializer_class = ComprobanteVentaSerializer
    permission_classes = [IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def get_queryset(self):
        persona_id = self.kwargs.get('persona_id')
        query = ComprobanteVenta.objects.filter(comprador=persona_id, estado='FINALIZADA').order_by('-created')[:10]

        if not query.exists():
            raise NotFound('NoHayComprobantes')

        return query
    
class ComprobantesVentaEsperaCajaAPIView(generics.ListAPIView):
    serializer_class = ComprobanteVentaSerializer
    permission_classes = [IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def get_queryset(self):
        # Filtrar por estado 'CAJA'
        query = ComprobanteVenta.objects.filter(estado='CAJA').order_by('-created')[:10]

        if not query.exists():
            raise NotFound('NoHayComprobantes')

        return query

class ComprobanteVentasDetailAPIViw(generics.RetrieveAPIView):
    queryset = ComprobanteVenta.objects.all()
    serializer_class = ComprobanteVentaSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

class ComprobanteVentaUpdateAPIViw(generics.UpdateAPIView):
    queryset = ComprobanteVenta.objects.all()
    serializer_class = ComprobanteVentaSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class ComprobanteVentaDeleteAPIViw(generics.DestroyAPIView):
    queryset = ComprobanteVenta.objects.all()
    serializer_class = ComprobanteVentaSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)


    ## Recetas

class RecetasListCreateAPIViw(generics.ListCreateAPIView):
    queryset = Recetas.objects.all()
    serializer_class = RecetasSerializer
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perfrom_create(self, serializer):
        instance = serializer.save()

class RecetasPorVentaAPIView(generics.ListAPIView):
    serializer_class = RecetasSerializer
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def get_queryset(self):
        venta_id = self.kwargs['venta_id']
        venta = get_object_or_404(ComprobanteVenta, id=venta_id)
        return Recetas.objects.filter(comprobante_venta=venta)


class RecetasDetailAPIViw(generics.RetrieveAPIView):
    queryset = Recetas.objects.all()
    serializer_class = RecetasSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

class RecetasUpdateAPIViw(generics.UpdateAPIView):
    queryset = Recetas.objects.all()
    serializer_class = RecetasSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class RecetasDeleteAPIViw(generics.DestroyAPIView):
    queryset = Recetas.objects.all()
    serializer_class = RecetasSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)

    ## Producto Vendido

class ProductoVendidoListCreateAPIViw(generics.ListCreateAPIView):
    queryset = ProductoVendido.objects.all()
    serializer_class = ProductoVendidoSerializer
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perfrom_create(self, serializer):
        instance = serializer.save()

class ProductoVendidoDetailAPIViw(generics.RetrieveAPIView):
    queryset = ProductoVendido.objects.all()
    serializer_class = ProductoVendidoSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

class ProductoVendidoUpdateAPIViw(generics.UpdateAPIView):
    queryset = ProductoVendido.objects.all()
    serializer_class = ProductoVendidoSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class ProductoVendidoDeleteAPIViw(generics.DestroyAPIView):
    queryset = ProductoVendido.objects.all()
    serializer_class = ProductoVendidoSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)


    ## Carga Producto

class CargaProductoListCreateAPIViw(generics.ListCreateAPIView):
    queryset = CargaProducto.objects.all()
    serializer_class = CargaProductoSerializer

    def perfrom_create(self, serializer):
        instance = serializer.save()

class CargaProductoDetailAPIViw(generics.RetrieveAPIView):
    queryset = CargaProducto.objects.all()
    serializer_class = CargaProductoSerializer
    lookup_field = 'pk'

class CargaProductoUpdateAPIViw(generics.UpdateAPIView):
    queryset = CargaProducto.objects.all()
    serializer_class = CargaProductoSerializer
    lookup_field = 'pk'

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class CargaProductoDeleteAPIViw(generics.DestroyAPIView):
    queryset = CargaProducto.objects.all()
    serializer_class = CargaProductoSerializer
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)
    
## ACATA DE RECEPCION
    
class GenerateActaRecepccionAPIView(APIView):
    def get(self, request, *args, **kwargs):
        # Simulamos algunos datos como ejemplo
        datos = {
            'Nombre': ['Ana', 'Luis', 'Carlos'],
            'Edad': [25, 30, 22],
            'Ciudad': ['Madrid', 'Barcelona', 'Valencia']
        }

        # Convertimos los datos a un DataFrame de Pandas
        df = pd.DataFrame(datos)

        # Creamos una respuesta HTTP con el contenido adecuado para un archivo Excel
        response = HttpResponse(
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        # Especificamos el nombre del archivo que se descargará
        response['Content-Disposition'] = 'attachment; filename="datos.xlsx"'

        # Creamos el archivo Excel en la respuesta
        with pd.ExcelWriter(response, engine='openpyxl') as writer:
            df.to_excel(writer, index=False)

        return response