from rest_framework import serializers
from core.models.core import *
from core.models.farmacia import *
from core.models.seguridad import *
from core.models.stock import *


    ## CORE SERIALIZER


class UVSerializer(serializers.ModelSerializer):
    class Meta:
        model = UV
        fields = '__all__'

class CallesIndependenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CallesIndependencia
        fields = '__all__'

class PersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Persona
        fields = '__all__'

class TelefonoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Telefono
        fields = '__all__'

class CorreoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Correo
        fields = '__all__'

class DireccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direccion
        fields = '__all__'

class PersonaInfoSaludSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonaInfoSalud
        fields = '__all__'

class PersonaArchivosSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonaArchivos
        fields = '__all__'


    ## FARMACIA SERIALIZER


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


    ## SEGURIDAD SERIALIZER


class ClasificacionDelitoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClasificacionDelito
        fields = '__all__'

class DelitoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Delito
        fields = '__all__'

class LlamadoSeguridadSerializer(serializers.ModelSerializer):
    class Meta:
        model = LlamadoSeguridad
        fields = '__all__'

class DenuncianteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Denunciante
        fields = '__all__'

class RequerimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Requerimiento
        fields = '__all__'


    ## STOCK SERIALIZER


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
