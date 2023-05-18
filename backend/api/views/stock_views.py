from rest_framework.response import Response
from rest_framework import generics

from api.serializers.stock_serializers import *
from database.farmacia.models import (
    BodegaVirtual, 
    OrdenIngresoProducto,
    OrdenIngresoLista,
    ProductoIngresado,
    ProductoMermado,
)


    ## BodegaVirtual

class BodegaVirtualListCreateAPIViw(generics.ListCreateAPIView):
    queryset = BodegaVirtual.objects.all()
    serializer_class = BodegaVirtualSerializer

    def perfrom_create(self, serializer):
        instance = serializer.save()

class BodegaVirtualDetailAPIViw(generics.RetrieveAPIView):
    queryset = BodegaVirtual.objects.all()
    serializer_class = BodegaVirtualSerializer
    lookup_field = 'pk'

class BodegaVirtualDetailByProductoAPIViw(generics.RetrieveAPIView):
    queryset = BodegaVirtual.objects.all()
    serializer_class = BodegaVirtualSerializer
    lookup_field = 'nombre'    

class BodegaVirtualUpdateAPIViw(generics.UpdateAPIView):
    queryset = BodegaVirtual.objects.all()
    serializer_class = BodegaVirtualSerializer
    lookup_field = 'pk'

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class BodegaVirtualDeleteAPIViw(generics.DestroyAPIView):
    queryset = BodegaVirtual.objects.all()
    serializer_class = BodegaVirtualSerializer
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)


    ## OrdenIngresoProducto

class OrdenIngresoProductoListCreateAPIViw(generics.ListCreateAPIView):
    queryset = OrdenIngresoProducto.objects.all()
    serializer_class = OrdenIngresoProductoSerializer

    def perfrom_create(self, serializer):
        instance = serializer.save()

class OrdenIngresoProductoDetailAPIViw(generics.RetrieveAPIView):
    queryset = OrdenIngresoProducto.objects.all()
    serializer_class = OrdenIngresoProductoSerializer
    lookup_field = 'pk'

class OrdenIngresoProductoUpdateAPIViw(generics.UpdateAPIView):
    queryset = OrdenIngresoProducto.objects.all()
    serializer_class = OrdenIngresoProductoSerializer
    lookup_field = 'pk'

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class OrdenIngresoProductoDeleteAPIViw(generics.DestroyAPIView):
    queryset = OrdenIngresoProducto.objects.all()
    serializer_class = OrdenIngresoProductoSerializer
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)


    ## Orden Ingreso Lista

class OrdenIngresoListaListCreateAPIViw(generics.ListCreateAPIView):
    queryset = OrdenIngresoLista.objects.all()
    serializer_class = OrdenIngresoListaSerializer

    def perfrom_create(self, serializer):
        instance = serializer.save()

class OrdenIngresoListaDetailAPIViw(generics.RetrieveAPIView):
    queryset = OrdenIngresoLista.objects.all()
    serializer_class = OrdenIngresoListaSerializer
    lookup_field = 'pk'

class OrdenIngresoListaUpdateAPIViw(generics.UpdateAPIView):
    queryset = OrdenIngresoLista.objects.all()
    serializer_class = OrdenIngresoListaSerializer
    lookup_field = 'pk'

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class OrdenIngresoListaDeleteAPIViw(generics.DestroyAPIView):
    queryset = OrdenIngresoLista.objects.all()
    serializer_class = OrdenIngresoListaSerializer
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)


    ## Producto Ingresado

class ProductoIngresadoListCreateAPIViw(generics.ListCreateAPIView):
    queryset = ProductoIngresado.objects.all()
    serializer_class = ProductoIngresadoSerializer

    def perfrom_create(self, serializer):
        instance = serializer.save()

class ProductoIngresadoDetailAPIViw(generics.RetrieveAPIView):
    queryset = ProductoIngresado.objects.all()
    serializer_class = ProductoIngresadoSerializer
    lookup_field = 'pk'

class ProductoIngresadoUpdateAPIViw(generics.UpdateAPIView):
    queryset = ProductoIngresado.objects.all()
    serializer_class = ProductoIngresadoSerializer
    lookup_field = 'pk'

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class ProductoIngresadoDeleteAPIViw(generics.DestroyAPIView):
    queryset = ProductoIngresado.objects.all()
    serializer_class = ProductoIngresadoSerializer
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)


    ## Producto Mermado

class ProductoMermadoListCreateAPIViw(generics.ListCreateAPIView):
    queryset = ProductoMermado.objects.all()
    serializer_class = ProductoMermadoSerializer

    def perfrom_create(self, serializer):
        instance = serializer.save()

class ProductoMermadoDetailAPIViw(generics.RetrieveAPIView):
    queryset = ProductoMermado.objects.all()
    serializer_class = ProductoMermadoSerializer
    lookup_field = 'pk'

class ProductoMermadoUpdateAPIViw(generics.UpdateAPIView):
    queryset = ProductoMermado.objects.all()
    serializer_class = ProductoMermadoSerializer
    lookup_field = 'pk'

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class ProductoMermadoDeleteAPIViw(generics.DestroyAPIView):
    queryset = ProductoMermado.objects.all()
    serializer_class = ProductoMermadoSerializer
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)