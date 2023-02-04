from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers.stock_serializers import *
from database.farmacia.models import (
    BodegaVirtual, 
    OrdenIngresoProducto,
    OrdenIngresoLista,
    ProductoIngresado,
    ProductoMermado,
)

@api_view(['GET'])
def get_bodega_virtual(request):
    items = BodegaVirtual.objects.all()
    serializer = BodegaVirtualSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_orden_ingreso_producto(request):
    items = OrdenIngresoProducto.objects.all()
    serializer = OrdenIngresoProductoSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_orden_ingreso_lista(request):
    items = OrdenIngresoLista.objects.all()
    serializer = OrdenIngresoListaSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_producto_ingresado(request):
    items = ProductoIngresado.objects.all()
    serializer = ProductoIngresadoSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_producto_mermado(request):
    items = ProductoMermado.objects.all()
    serializer = ProductoMermadoSerializer(items, many=True)
    return Response(serializer.data)