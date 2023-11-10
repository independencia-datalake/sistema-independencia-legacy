from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from django.http import JsonResponse, Http404
from api.filters.persona_filters import PersonaFilter
from .permissions_views import *

from api.serializers.core_serializers import *
from database.core.models import (
    UV, 
    CallesIndependencia,
    Persona,
    Telefono,
    Correo,
    Direccion,
    PersonaInfoSalud,
    PersonaArchivos,
)

    # PAGINACION

class CustomPageNumberPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000

    ## UV

class UVListCreateAPIViw(generics.ListCreateAPIView):
    queryset = UV.objects.all()
    serializer_class = UVSerializer

    def perfrom_create(self, serializer):
        instance = serializer.save()

class UVDetailAPIViw(generics.RetrieveAPIView):
    queryset = UV.objects.all()
    serializer_class = UVSerializer
    lookup_field = 'pk'

class UVUpdateAPIViw(generics.UpdateAPIView):
    queryset = UV.objects.all()
    serializer_class = UVSerializer
    lookup_field = 'pk'

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class UVDeleteAPIViw(generics.DestroyAPIView):
    queryset = UV.objects.all()
    serializer_class = UVSerializer
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)


    ## Calles Independencia

class CallesIndependenciaListCreateAPIViw(generics.ListCreateAPIView):
    queryset = CallesIndependencia.objects.all()
    serializer_class = CallesIndependenciaSerializer

    def perfrom_create(self, serializer):
        instance = serializer.save()

class CallesIndependenciaDetailAPIViw(generics.RetrieveAPIView):
    queryset = CallesIndependencia.objects.all()
    serializer_class = CallesIndependenciaSerializer
    lookup_field = 'pk'

class CallesIndependenciaUpdateAPIViw(generics.UpdateAPIView):
    queryset = CallesIndependencia.objects.all()
    serializer_class = CallesIndependenciaSerializer
    lookup_field = 'pk'

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class CallesIndependenciaDeleteAPIViw(generics.DestroyAPIView):
    queryset = CallesIndependencia.objects.all()
    serializer_class = CallesIndependenciaSerializer
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)



    ## Persona


class PersonaListCreateAPIViw(generics.ListCreateAPIView):
    queryset = Persona.objects.all()
    serializer_class = PersonaSerializer
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perfrom_create(self, serializer):
        instance = serializer.save()

class PersonaList2CreateAPIViw(generics.ListCreateAPIView):
    queryset = Persona.objects.all()
    serializer_class = PersonaSerializer2
    pagination_class = CustomPageNumberPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = PersonaFilter
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perform_create(self, serializer):
        instance = serializer.save()

class PersonaDetailAPIViw(generics.RetrieveAPIView):
    queryset = Persona.objects.all()
    serializer_class = PersonaSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

class PersonaUpdateAPIViw(generics.UpdateAPIView):
    queryset = Persona.objects.all()
    serializer_class = PersonaSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class PersonaDeleteAPIViw(generics.DestroyAPIView):
    queryset = Persona.objects.all()
    serializer_class = PersonaSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)


    ## Telefono

class TelefonoListCreateAPIViw(generics.ListCreateAPIView):
    queryset = Telefono.objects.all()
    serializer_class = TelefonoSerializer
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perfrom_create(self, serializer):
        instance = serializer.save()

class TelefonoDetailAPIViw(generics.RetrieveAPIView):
    queryset = Telefono.objects.all()
    serializer_class = TelefonoSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

class TelefonoDetailByPersonaAPIViw(generics.RetrieveAPIView):
    queryset = Telefono.objects.all()
    serializer_class = TelefonoSerializer
    lookup_field = 'persona'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

class TelefonoUpdateAPIViw(generics.UpdateAPIView):
    queryset = Telefono.objects.all()
    serializer_class = TelefonoSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class TelefonoDeleteAPIViw(generics.DestroyAPIView):
    queryset = Telefono.objects.all()
    serializer_class = TelefonoSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)



    ## Correo

class CorreoListCreateAPIViw(generics.ListCreateAPIView):
    queryset = Correo.objects.all()
    serializer_class = CorreoSerializer
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perfrom_create(self, serializer):
        instance = serializer.save()

class CorreoDetailAPIViw(generics.RetrieveAPIView):
    queryset = Correo.objects.all()
    serializer_class = CorreoSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

class CorreoDetailByPersonaAPIViw(generics.RetrieveAPIView):
    queryset = Correo.objects.all()
    serializer_class = CorreoSerializer
    lookup_field = 'persona'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

class CorreoUpdateAPIViw(generics.UpdateAPIView):
    queryset = Correo.objects.all()
    serializer_class = CorreoSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class CorreoDeleteAPIViw(generics.DestroyAPIView):
    queryset = Correo.objects.all()
    serializer_class = CorreoSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)



    ## Direccion

class DireccionListCreateAPIViw(generics.ListCreateAPIView):
    queryset = Direccion.objects.all()
    serializer_class = DireccionSerializer
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perfrom_create(self, serializer):
        instance = serializer.save()

class DireccionDetailAPIViw(generics.RetrieveAPIView):
    queryset = Direccion.objects.all()
    serializer_class = DireccionSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

class DireccionDetailByPersonaAPIViw(generics.RetrieveAPIView):
    queryset = Direccion.objects.all()
    serializer_class = DireccionSerializer
    lookup_field = 'persona'   
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

class DireccionUpdateAPIViw(generics.UpdateAPIView):
    queryset = Direccion.objects.all()
    serializer_class = DireccionSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class DireccionDeleteAPIViw(generics.DestroyAPIView):
    queryset = Direccion.objects.all()
    serializer_class = DireccionSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)



    ## Persona Info Salud

class PersonaInfoSaludListCreateAPIViw(generics.ListCreateAPIView):
    queryset = PersonaInfoSalud.objects.all()
    serializer_class = PersonaInfoSaludSerializer
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perfrom_create(self, serializer):
        instance = serializer.save()

class PersonaInfoSaludDetailAPIViw(generics.RetrieveAPIView):
    queryset = PersonaInfoSalud.objects.all()
    serializer_class = PersonaInfoSaludSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

class PersonaInfoSaludDetailByPersonaAPIViw(generics.RetrieveAPIView):
    queryset = PersonaInfoSalud.objects.all()
    serializer_class = PersonaInfoSaludSerializer
    lookup_field = 'persona'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

class PersonaInfoSaludUpdateAPIViw(generics.UpdateAPIView):
    queryset = PersonaInfoSalud.objects.all()
    serializer_class = PersonaInfoSaludSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class PersonaInfoSaludDeleteAPIViw(generics.DestroyAPIView):
    queryset = PersonaInfoSalud.objects.all()
    serializer_class = PersonaInfoSaludSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)



    ## Persona Archivos

class PersonaArchivosListCreateAPIViw(generics.ListCreateAPIView):
    queryset = PersonaArchivos.objects.all()
    serializer_class = PersonaArchivosSerializer
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perfrom_create(self, serializer):
        instance = serializer.save()

class PersonaArchivosDetailAPIViw(generics.RetrieveAPIView):
    queryset = PersonaArchivos.objects.all()
    serializer_class = PersonaArchivosSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

class PersonaArchivosUpdateAPIViw(generics.UpdateAPIView):
    queryset = PersonaArchivos.objects.all()
    serializer_class = PersonaArchivosSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class PersonaArchivosDeleteAPIViw(generics.DestroyAPIView):
    queryset = PersonaArchivos.objects.all()
    serializer_class = PersonaArchivosSerializer
    lookup_field = 'pk'
    permission_classes = [ IsDeveloper | IsFarmaciaFarmaceuta | IsFarmaciaVendedor]

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)

class PoblacionUVAPIView(APIView):
    def get(self, request, *args, **kwargs):
        # Primero obtenemos los últimos 26 objetos.
        last_26_objects = PoblacionUV.objects.all().order_by('-id')[:26]

        # Usamos el serializer para convertir los datos del modelo a JSON
        serializer = PoblacionUVSerializer(last_26_objects, many=True)

        # Ordenamos los datos en el orden de las id de forma ascendente
        ordered_data = sorted(serializer.data, key=lambda x: x['id'])

        return Response(ordered_data)

class ObtenerUVView(APIView):
    def get(self, request, calle, numeracion):

        if not calle or not numeracion:
            return Response({"error": "Falta la calle o la numeración"}, status=status.HTTP_400_BAD_REQUEST)

        uv = obtener_uv(calle, numeracion)

        return Response({'unidad_vecinal': uv}, status=status.HTTP_200_OK)
    
