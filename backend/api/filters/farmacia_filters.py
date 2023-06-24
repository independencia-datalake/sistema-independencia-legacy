import django_filters
from database.farmacia.models import ProductoFarmacia, ComprobanteVenta
from django.db.models import Q
from datetime import datetime

class ProductoFarmaciaFilter(django_filters.FilterSet):

    search = django_filters.CharFilter(method='filter_search', label='Search')

    class Meta:
        model = ProductoFarmacia
        fields = []

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(marca_producto__icontains=value) |
            Q(laboratorio__icontains=value) |
            Q(proveedor__icontains=value) |
            Q(p_a__icontains=value) |
            Q(presentacion__icontains=value) |
            Q(cenabast__icontains=value) |
            Q(bioequivalencia__icontains=value)
        )
    
class ComprobanteVentaFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='filter_search', label='Search')

    class Meta:
        model = ComprobanteVenta
        fields = []

    def filter_search(self, queryset, name, value):
        # Filtra por estado, nombre, identificación y usuario
        queryset1 = queryset.filter(
            Q(estado__icontains=value) |
            Q(comprador__nombre_completo__icontains=value) |
            Q(comprador__numero_identificacion__icontains=value) |
            Q(farmaceuta__username__icontains=value)
        )

        # Filtra por fecha y hora
        matching_ids = []
        for obj in queryset:
            formatted_date = obj.created.strftime('%H:%M - %d/%m/%Y')
            if value in formatted_date:
                matching_ids.append(obj.id)

        queryset2 = queryset.filter(id__in=matching_ids)
        
        # Combinar ambos querysets
        return queryset1 | queryset2