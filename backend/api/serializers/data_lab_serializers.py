from rest_framework import serializers
from database.data_lab.models import *

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