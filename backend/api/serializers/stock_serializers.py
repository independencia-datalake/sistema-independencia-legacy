from rest_framework import serializers
from database.farmacia.models import *
from api.serializers.farmacia_serializers import ProductoFarmaciaSerializer

class BodegaVirtualSerializer(serializers.ModelSerializer):
    class Meta:
        model = BodegaVirtual
        fields = '__all__'

class BodegaVirtualSerializer2(serializers.ModelSerializer):
    producto = serializers.SerializerMethodField()

    class Meta:
        model = BodegaVirtual
        fields = ['id', 'stock', 'stock_min', 'stock_max', 'holgura', 'producto']

    def get_producto(self, obj):
        producto = ProductoFarmacia.objects.get(id=obj.nombre.id)
        return f"{producto.marca_producto} | {producto.dosis} x {producto.presentacion} | {producto.p_a} | Proveedor: {producto.proveedor if producto.proveedor else ''} | Lab: {producto.laboratorio}"

class OrdenIngresoProductoSerializer(serializers.ModelSerializer):

    class Meta:
        model = OrdenIngresoProducto
        fields = '__all__'

class OrdenIngresoListaSerializer(serializers.ModelSerializer):
    nombre_producto = serializers.SerializerMethodField()

    class Meta:
        model = OrdenIngresoLista
        fields = ['id','producto', 'cantidad_ingresada', 'precio_compra', 'precio_venta', 'n_lote', 'n_factura', 'nombre_producto']

    def get_nombre_producto(self, obj):
        nombre_producto = ProductoFarmacia.objects.get(id=obj.producto.id)
        return f"{nombre_producto.marca_producto} | {nombre_producto.dosis} x {nombre_producto.presentacion} | {nombre_producto.p_a} | Proveedor: {nombre_producto.proveedor if nombre_producto.proveedor else ''} | Lab: {nombre_producto.laboratorio}"

class ProductoIngresadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoIngresado
        fields = '__all__'

class ProductoMermadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoMermado
        fields = '__all__'
