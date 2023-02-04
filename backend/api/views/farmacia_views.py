from rest_framework.response import Response
from rest_framework import generics

from api.serializers.farmacia_serializers import *
from database.farmacia.models import (
    Laboratorios, 
    ProductoFarmacia,
    ComprobanteVenta,
    Recetas,
    ProductoVendido,
    CargaProducto,
)


    ## Laboratorios

class LaboratoriosListCreateAPIViw(generics.ListCreateAPIView):
    queryset = Laboratorios.objects.all()
    serializer_class = LaboratoriosSerializer

    def perfrom_create(self, serializer):
        instance = serializer.save()

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

    def perfrom_create(self, serializer):
        instance = serializer.save()

class ProductoFarmaciaDetailAPIViw(generics.RetrieveAPIView):
    queryset = ProductoFarmacia.objects.all()
    serializer_class = ProductoFarmaciaSerializer
    lookup_field = 'pk'

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

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)


    ## Comprobante Venta

class ComprobanteVentaListCreateAPIViw(generics.ListCreateAPIView):
    queryset = ComprobanteVenta.objects.all()
    serializer_class = ComprobanteVentaSerializer

    def perfrom_create(self, serializer):
        instance = serializer.save()

class ComprobanteVentasDetailAPIViw(generics.RetrieveAPIView):
    queryset = ComprobanteVenta.objects.all()
    serializer_class = ComprobanteVentaSerializer
    lookup_field = 'pk'

class ComprobanteVentaUpdateAPIViw(generics.UpdateAPIView):
    queryset = ComprobanteVenta.objects.all()
    serializer_class = ComprobanteVentaSerializer
    lookup_field = 'pk'

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class ComprobanteVentaDeleteAPIViw(generics.DestroyAPIView):
    queryset = ComprobanteVenta.objects.all()
    serializer_class = ComprobanteVentaSerializer
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)


    ## Recetas

class RecetasListCreateAPIViw(generics.ListCreateAPIView):
    queryset = Recetas.objects.all()
    serializer_class = RecetasSerializer

    def perfrom_create(self, serializer):
        instance = serializer.save()

class RecetasDetailAPIViw(generics.RetrieveAPIView):
    queryset = Recetas.objects.all()
    serializer_class = RecetasSerializer
    lookup_field = 'pk'

class RecetasUpdateAPIViw(generics.UpdateAPIView):
    queryset = Recetas.objects.all()
    serializer_class = RecetasSerializer
    lookup_field = 'pk'

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class RecetasDeleteAPIViw(generics.DestroyAPIView):
    queryset = Recetas.objects.all()
    serializer_class = RecetasSerializer
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)

    ## Producto Vendido

class ProductoVendidoListCreateAPIViw(generics.ListCreateAPIView):
    queryset = ProductoVendido.objects.all()
    serializer_class = ProductoVendidoSerializer

    def perfrom_create(self, serializer):
        instance = serializer.save()

class ProductoVendidoDetailAPIViw(generics.RetrieveAPIView):
    queryset = ProductoVendido.objects.all()
    serializer_class = ProductoVendidoSerializer
    lookup_field = 'pk'

class ProductoVendidoUpdateAPIViw(generics.UpdateAPIView):
    queryset = ProductoVendido.objects.all()
    serializer_class = ProductoVendidoSerializer
    lookup_field = 'pk'

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class ProductoVendidoDeleteAPIViw(generics.DestroyAPIView):
    queryset = ProductoVendido.objects.all()
    serializer_class = ProductoVendidoSerializer
    lookup_field = 'pk'

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