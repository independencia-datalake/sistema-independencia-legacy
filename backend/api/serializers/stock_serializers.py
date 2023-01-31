from rest_framework import serializers
from database.models import *

class BodegaVirtualSerializer(serializers.ModelSerializer):
    class Meta:
        model = BodegaVirtual
        fields = '__all__'

class OrdenIngresoProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrdenIngresoProducto
        fields = '__all__'

class OrdenIngresoListaSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrdenIngresoLista
        fields = '__all__'

class ProductoIngresadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoIngresado
        fields = '__all__'

class ProductoMermadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoMermado
        fields = '__all__'
