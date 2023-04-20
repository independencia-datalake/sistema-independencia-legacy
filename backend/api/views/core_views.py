from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import generics


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

    def perfrom_create(self, serializer):
        instance = serializer.save()

class PersonaDetailAPIViw(generics.RetrieveAPIView):
    queryset = Persona.objects.all()
    serializer_class = PersonaSerializer
    lookup_field = 'pk'

class PersonaUpdateAPIViw(generics.UpdateAPIView):
    queryset = Persona.objects.all()
    serializer_class = PersonaSerializer
    lookup_field = 'pk'

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class PersonaDeleteAPIViw(generics.DestroyAPIView):
    queryset = Persona.objects.all()
    serializer_class = PersonaSerializer
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)


    ## Telefono

class TelefonoListCreateAPIViw(generics.ListCreateAPIView):
    queryset = Telefono.objects.all()
    serializer_class = TelefonoSerializer

    def perfrom_create(self, serializer):
        instance = serializer.save()

class TelefonoDetailAPIViw(generics.RetrieveAPIView):
    queryset = Telefono.objects.all()
    serializer_class = TelefonoSerializer
    lookup_field = 'pk'

class TelefonoDetailByPersonaAPIViw(generics.RetrieveAPIView):
    queryset = Telefono.objects.all()
    serializer_class = TelefonoSerializer
    lookup_field = 'persona'

class TelefonoUpdateAPIViw(generics.UpdateAPIView):
    queryset = Telefono.objects.all()
    serializer_class = TelefonoSerializer
    lookup_field = 'pk'

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class TelefonoDeleteAPIViw(generics.DestroyAPIView):
    queryset = Telefono.objects.all()
    serializer_class = TelefonoSerializer
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)



    ## Correo

class CorreoListCreateAPIViw(generics.ListCreateAPIView):
    queryset = Correo.objects.all()
    serializer_class = CorreoSerializer

    def perfrom_create(self, serializer):
        instance = serializer.save()

class CorreoDetailAPIViw(generics.RetrieveAPIView):
    queryset = Correo.objects.all()
    serializer_class = CorreoSerializer
    lookup_field = 'pk'

class CorreoDetailByPersonaAPIViw(generics.RetrieveAPIView):
    queryset = Correo.objects.all()
    serializer_class = CorreoSerializer
    lookup_field = 'persona'

class CorreoUpdateAPIViw(generics.UpdateAPIView):
    queryset = Correo.objects.all()
    serializer_class = CorreoSerializer
    lookup_field = 'pk'

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class CorreoDeleteAPIViw(generics.DestroyAPIView):
    queryset = Correo.objects.all()
    serializer_class = CorreoSerializer
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)



    ## Direccion

class DireccionListCreateAPIViw(generics.ListCreateAPIView):
    queryset = Direccion.objects.all()
    serializer_class = DireccionSerializer

    def perfrom_create(self, serializer):
        instance = serializer.save()

class DireccionDetailAPIViw(generics.RetrieveAPIView):
    queryset = Direccion.objects.all()
    serializer_class = DireccionSerializer
    lookup_field = 'pk'

class DireccionDetailByPersonaAPIViw(generics.RetrieveAPIView):
    queryset = Direccion.objects.all()
    serializer_class = DireccionSerializer
    lookup_field = 'persona'   

class DireccionUpdateAPIViw(generics.UpdateAPIView):
    queryset = Direccion.objects.all()
    serializer_class = DireccionSerializer
    lookup_field = 'pk'

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class DireccionDeleteAPIViw(generics.DestroyAPIView):
    queryset = Direccion.objects.all()
    serializer_class = DireccionSerializer
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)



    ## Persona Info Salud

class PersonaInfoSaludListCreateAPIViw(generics.ListCreateAPIView):
    queryset = PersonaInfoSalud.objects.all()
    serializer_class = PersonaInfoSaludSerializer

    def perfrom_create(self, serializer):
        instance = serializer.save()

class PersonaInfoSaludDetailAPIViw(generics.RetrieveAPIView):
    queryset = PersonaInfoSalud.objects.all()
    serializer_class = PersonaInfoSaludSerializer
    lookup_field = 'pk'

class PersonaInfoSaludDetailByPersonaAPIViw(generics.RetrieveAPIView):
    queryset = PersonaInfoSalud.objects.all()
    serializer_class = PersonaInfoSaludSerializer
    lookup_field = 'persona'

class PersonaInfoSaludUpdateAPIViw(generics.UpdateAPIView):
    queryset = PersonaInfoSalud.objects.all()
    serializer_class = PersonaInfoSaludSerializer
    lookup_field = 'pk'

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class PersonaInfoSaludDeleteAPIViw(generics.DestroyAPIView):
    queryset = PersonaInfoSalud.objects.all()
    serializer_class = PersonaInfoSaludSerializer
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)



    ## Persona Archivos

class PersonaArchivosListCreateAPIViw(generics.ListCreateAPIView):
    queryset = PersonaArchivos.objects.all()
    serializer_class = PersonaArchivosSerializer

    def perfrom_create(self, serializer):
        instance = serializer.save()

class PersonaArchivosDetailAPIViw(generics.RetrieveAPIView):
    queryset = PersonaArchivos.objects.all()
    serializer_class = PersonaArchivosSerializer
    lookup_field = 'pk'

class PersonaArchivosUpdateAPIViw(generics.UpdateAPIView):
    queryset = PersonaArchivos.objects.all()
    serializer_class = PersonaArchivosSerializer
    lookup_field = 'pk'

    def perform_update(self, serializer):
        return super().perform_update(serializer)

class PersonaArchivosDeleteAPIViw(generics.DestroyAPIView):
    queryset = PersonaArchivos.objects.all()
    serializer_class = PersonaArchivosSerializer
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)
