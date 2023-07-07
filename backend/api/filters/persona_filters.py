import django_filters
from database.core.models import Persona
from django.db.models import Q

class PersonaFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='filter_search', label='Search')

    class Meta:
        model = Persona
        fields = []

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(numero_identificacion__icontains=value) |
            Q(nombre_completo__icontains=value) |
            # Q(created)
            Q(personainfosalud__prevision__icontains=value) |
            Q(personainfosalud__isapre__icontains=value) |
            Q(personainfosalud__comentarios__icontains=value)
            
        )
    
