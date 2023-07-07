import django_filters
from database.farmacia.models import BodegaVirtual 
from django.db.models import Q
from datetime import datetime

class BodegaVirtualFilter(django_filters.FilterSet):

    search = django_filters.CharFilter(method='filter_search', label='Search')

    class Meta:
        model = BodegaVirtual
        fields = []

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(stock__icontains=value) |
            Q(stock_min__icontains=value) |
            Q(holgura__icontains=value) |
            Q(nombre__marca_producto__icontains=value) |
            Q(nombre__p_a__icontains=value) |
            Q(nombre__dosis__icontains=value) |
            Q(nombre__presentacion__icontains=value) |
            Q(nombre__proveedor__icontains=value) |
            Q(nombre__laboratorio__icontains=value)
        )