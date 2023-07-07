from rest_framework.response import Response
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from api.filters.stock_filters import BodegaVirtualFilter
from rest_framework import permissions
from rest_framework.permissions import OR
from .permissions_views import *

from api.serializers.stock_serializers import *
from database.farmacia.models import (
    BodegaVirtual, 
    OrdenIngresoProducto,
    OrdenIngresoLista,
    ProductoIngresado,
    ProductoMermado,
)

    # PERMISOS

# class IsFarmaciaFarmaceuta(permissions.BasePermission):
#     def has_permission(self, request, view):
#         return request.user.groups.filter(name='Farmacia-Farmaceuta').exists()

    # PAGINACION

class CustomPageNumberPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000

    ## BodegaVirtual

class BodegaVirtualListCreateAPIViw(generics.ListCreateAPIView):
    queryset = BodegaVirtual.objects.all()
    serializer_class = BodegaVirtualSerializer
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perfrom_create(self, serializer):
        instance = serializer.save()

class BodegaVirtualList2CreateAPIViw(generics.ListCreateAPIView):
    queryset = BodegaVirtual.objects.all()
    serializer_class = BodegaVirtualSerializer2
    pagination_class = CustomPageNumberPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = BodegaVirtualFilter
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]


    def perfrom_create(self, serializer):
        instance = serializer.save()

class BodegaVirtualDetailAPIViw(generics.RetrieveAPIView):
    queryset = BodegaVirtual.objects.all()
    serializer_class = BodegaVirtualSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

class BodegaVirtualDetailByProductoAPIViw(generics.RetrieveAPIView):
    queryset = BodegaVirtual.objects.all()
    serializer_class = BodegaVirtualSerializer
    lookup_field = 'nombre'    
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

class BodegaVirtualUpdateAPIViw(generics.UpdateAPIView):
    queryset = BodegaVirtual.objects.all()
    serializer_class = BodegaVirtualSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class BodegaVirtualDeleteAPIViw(generics.DestroyAPIView):
    queryset = BodegaVirtual.objects.all()
    serializer_class = BodegaVirtualSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)


    ## OrdenIngresoProducto

class OrdenIngresoProductoListCreateAPIViw(generics.ListCreateAPIView):
    queryset = OrdenIngresoProducto.objects.all().order_by('-id')
    serializer_class = OrdenIngresoProductoSerializer
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perfrom_create(self, serializer):
        instance = serializer.save()

class OrdenIngresoProductoDetailAPIViw(generics.RetrieveAPIView):
    queryset = OrdenIngresoProducto.objects.all()
    serializer_class = OrdenIngresoProductoSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

class OrdenIngresoProductoUpdateAPIViw(generics.UpdateAPIView):
    queryset = OrdenIngresoProducto.objects.all()
    serializer_class = OrdenIngresoProductoSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class OrdenIngresoProductoDeleteAPIViw(generics.DestroyAPIView):
    queryset = OrdenIngresoProducto.objects.all()
    serializer_class = OrdenIngresoProductoSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)


    ## Orden Ingreso Lista

class OrdenIngresoListaListCreateAPIViw(generics.ListCreateAPIView):
    queryset = OrdenIngresoLista.objects.all()
    serializer_class = OrdenIngresoListaSerializer
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perfrom_create(self, serializer):
        instance = serializer.save()

class OrdenIngresoListaDetailAPIViw(generics.RetrieveAPIView):
    queryset = OrdenIngresoLista.objects.all()
    serializer_class = OrdenIngresoListaSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

class OrdenIngresoListaUpdateAPIViw(generics.UpdateAPIView):
    queryset = OrdenIngresoLista.objects.all()
    serializer_class = OrdenIngresoListaSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class OrdenIngresoListaDeleteAPIViw(generics.DestroyAPIView):
    queryset = OrdenIngresoLista.objects.all()
    serializer_class = OrdenIngresoListaSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)


    ## Producto Ingresado

class ProductoIngresadoListCreateAPIViw(generics.ListCreateAPIView):
    queryset = ProductoIngresado.objects.all()
    serializer_class = ProductoIngresadoSerializer
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perfrom_create(self, serializer):
        instance = serializer.save()

class ProductoIngresadoDetailAPIViw(generics.RetrieveAPIView):
    queryset = ProductoIngresado.objects.all()
    serializer_class = ProductoIngresadoSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

class ProductoIngresadoUpdateAPIViw(generics.UpdateAPIView):
    queryset = ProductoIngresado.objects.all()
    serializer_class = ProductoIngresadoSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class ProductoIngresadoDeleteAPIViw(generics.DestroyAPIView):
    queryset = ProductoIngresado.objects.all()
    serializer_class = ProductoIngresadoSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)


    ## Producto Mermado

class ProductoMermadoListCreateAPIViw(generics.ListCreateAPIView):
    queryset = ProductoMermado.objects.all()
    serializer_class = ProductoMermadoSerializer
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perfrom_create(self, serializer):
        instance = serializer.save()

class ProductoMermadoDetailAPIViw(generics.RetrieveAPIView):
    queryset = ProductoMermado.objects.all()
    serializer_class = ProductoMermadoSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

class ProductoMermadoUpdateAPIViw(generics.UpdateAPIView):
    queryset = ProductoMermado.objects.all()
    serializer_class = ProductoMermadoSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class ProductoMermadoDeleteAPIViw(generics.DestroyAPIView):
    queryset = ProductoMermado.objects.all()
    serializer_class = ProductoMermadoSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)