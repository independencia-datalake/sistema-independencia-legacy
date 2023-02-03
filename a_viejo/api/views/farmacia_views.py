from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers.farmacia_serializers import *
from database.models import (
    Laboratorios, 
    ProductoFarmacia,
    ComprobanteVenta,
    Recetas,
    ProductoVendido,
    CargaProducto,
)


    ## GET


@api_view(['GET'])
def get_laboratorios(request):
    items = Laboratorios.objects.all()
    serializer = LaboratoriosSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_producto_farmacia(request):
    items = ProductoFarmacia.objects.all()
    serializer = ProductoFarmaciaSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_comprobante_venta(request):
    items = ComprobanteVenta.objects.all()
    serializer = ComprobanteVentaSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_recetas(request):
    items = Recetas.objects.all()
    serializer = RecetasSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_producto_vendido(request):
    items = ProductoVendido.objects.all()
    serializer = ProductoVendidoSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_carga_producto(request):
    items = CargaProducto.objects.all()
    serializer = CargaProductoSerializer(items, many=True)
    return Response(serializer.data)