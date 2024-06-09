from rest_framework import serializers
from database.farmacia.models import *

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

class ComprobanteVentaVacioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComprobanteVenta

class ComprobanteVentaSerializer2(serializers.ModelSerializer):
    comprador_aux = serializers.SerializerMethodField()
    farmaceuta_aux = serializers.SerializerMethodField()
    created_formated = serializers.SerializerMethodField()

    class Meta:
        model = ComprobanteVenta
        fields = [ 'id', 'estado', 'created', 'created_formated', 'comprador_aux', 'farmaceuta_aux']

    def get_comprador_aux(self, obj):
        comprador_aux = Persona.objects.filter(id=obj.comprador.id)
        return PersonaSerializer(comprador_aux, many = True).data
    def get_farmaceuta_aux(self, obj):
        farmaceuta_aux = User.objects.filter(id=obj.farmaceuta.id)
        return FarmaceutaSerializer(farmaceuta_aux, many = True).data
    def get_created_formated(self, obj):
        return obj.created.strftime('%H:%M - %d/%m/%Y')

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

# PERSONA

class PersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Persona
        fields = ['nombre_completo', 'numero_identificacion']

# FARMACEUTA

class FarmaceutaSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']