from rest_framework import serializers
from database.data_lab.models import *

class FarmaciaDataLabSerializer(serializers.ModelSerializer):
    class Meta:
        model = FarmaciaDataLab
        fields = '__all__'

class EmpresasDataLabSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImpuestosYDerechosDataLab
        fields = '__all__'

class DOMDataLabSerializer(serializers.ModelSerializer):
    class Meta:
        model = DOMDataLab
        fields = '__all__'

class TransitoDataLabSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransitoDataLab
        fields = '__all__'

class RangoFechasByTipo(serializers.Serializer):
    fecha_inicio = serializers.DateField()
    fecha_fin = serializers.DateField()

class GPTDataLabSerializer(serializers.ModelSerializer):
    class Meta:
        model = GPTMessageDataLab
        fields = '__all__'