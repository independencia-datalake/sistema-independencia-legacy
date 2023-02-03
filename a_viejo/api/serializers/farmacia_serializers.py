from rest_framework import serializers
from database.models import *

class LaboratoriosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Laboratorios
        fields = '__all__'

class ProductoFarmaciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoFarmacia
        fields = '__all__'

class ComprobanteVentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComprobanteVenta
        fields = '__all__'

class RecetasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recetas
        fields = '__all__'

class ProductoVendidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoVendido
        fields = '__all__'

class CargaProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CargaProducto
        fields = '__all__'
