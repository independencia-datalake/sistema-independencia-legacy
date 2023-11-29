from django.db.models.signals import pre_save, pre_delete, post_save
from django.dispatch import receiver
from django.db.models import F
from utils.rut import calculadora_rut
import logging

import pandas as pd

from .models import (
    ArchivoCarga,
    Persona,
    Direccion,
    Telefono,
    Correo,
    PersonaInfoSalud,
)

logger = logging.getLogger(__name__)

@receiver(post_save, sender=ArchivoCarga)
def carga_masiva_persona(sender, instance, **kwargs):
    if kwargs.get('created', False) and instance.archivo:
        try:
            # Leer el archivo Excel
            archivo_path = instance.archivo.path
            df = pd.read_excel(archivo_path)

            # Procesar los datos del DataFrame
            # Aquí puedes añadir la lógica para almacenar los datos en tus modelos
            for index, row in df.iterrows():

                numero_identificacion = calculadora_rut(row['Rut'])
                
                if pd.isna(numero_identificacion) or Persona.objects.filter(numero_identificacion=numero_identificacion).exists():
                    continue

                tipo_identificacion = 'RUT'
                nombre = row['Nombre']
                apellidos = row['Apellidos']
                if pd.isna(row['Apellidos']):
                    primer_apellido = ""
                    segundo_apellido = ""
                else:
                    lista_apellidos = apellidos.split()
                    if len(lista_apellidos) == 1:
                        primer_apellido = lista_apellidos[0]
                        segundo_apellido = ""
                    else:
                        primer_apellido, segundo_apellido = lista_apellidos[0], lista_apellidos[1]
                estado_civil = row['Estado Civil']
                hijos = row['N° de Hijos']
                nacionalidad = row['Nacionalidad']
                enfermedad = row['Enfermedad']
                medicamento = row['Medicamentos de Uso Permanente']
                lugar_de_atencion = row['Lugar de Atención']
                discapacidad = row['Discapacidad']
                certificado_compin = row['Certificado de Compin']
                embarazo = row['Embarazo']
                certificado_embarazo = row['Certificado Medico Embarazo']

                #Direccion
                # calle = row['Calle']
                # numero = row['Numeracion']

                if pd.notna(row['Calle']) and pd.notna(row['Numeracion']):  # Verificar si hay calle y numeración
                    calle = row['Calle']
                    numero = row['Numeracion']
                else:
                    # Si falta la numeración, ambos se guardan como nulos
                    calle = None
                    numero = None

                #Correo
                correo = row['Correo Electronico']

                #Telefono
                telefono = row['Teléfono']

                #Info Salud
                prevision = row['Prevision']
                isapre = row['Isapre']

                persona, created = Persona.objects.update_or_create(
                    numero_identificacion=numero_identificacion,
                    defaults={
                        'tipo_identificacion': tipo_identificacion,
                        'nombre_persona': nombre,
                        'apellido_paterno': primer_apellido,
                        'apellido_materno': segundo_apellido,
                        'estado_civil': estado_civil,
                        'hijos': hijos if pd.notna(hijos) else 0,
                        'nacionalidad': nacionalidad,
                        'enfermedad': enfermedad,
                        'medicamento': medicamento,
                        'lugar_de_atencion': lugar_de_atencion,
                        'discapacidad': discapacidad,
                        'certificado_compin': certificado_compin,
                        'embarazo': embarazo,
                        'certificado_embarazo': certificado_embarazo,
                        # Aquí puedes añadir más campos según sea necesario
                    }
                )

                # Crear o actualizar Direccion asociada a Persona
                Direccion.objects.update_or_create(
                    persona=persona,
                    defaults={
                        'calle': calle,
                        'numero': numero
                        # Agrega aquí otros campos de dirección si los necesitas
                    }
                )

                Correo.objects.update_or_create(
                    persona=persona,
                    defaults = {
                        'correo': correo
                    }
                )

                Telefono.objects.update_or_create(
                    persona=persona,
                    defaults={
                        'telefono': telefono
                    }
                )

                PersonaInfoSalud.objects.update_or_create(
                    persona=persona,
                    defaults={
                        'prevision': prevision,
                        'isapre': isapre
                    }
                )
            logger.info("Archivo procesado correctamente.")
        except Exception as e:
            logger.error(f"Error al procesar el archivo: {e}")
