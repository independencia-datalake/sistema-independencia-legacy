from django.db import models

class CallesIndependencia(models.Model):
    calle = models.CharField(max_length=200)

    class Meta:
        verbose_name = "Calle "
        verbose_name_plural = "Calles de Independencia"
        ordering = ['calle']
        
    def __str__(self):
        return f'{self.calle}'

class UV(models.Model):
    numero_uv = models.PositiveIntegerField(verbose_name="Número de U.V.")

    class Meta:
        verbose_name = "Unidad Vecinal"
        verbose_name_plural = "Unidades Vecinales"
        ordering = ['numero_uv']
        
    def __str__(self):
        return f'{self.numero_uv}'

class Persona(models.Model):
    uv = models.ForeignKey(UV, on_delete=models.PROTECT, verbose_name="Unidad Vecinal")
    tipo_identificacion = models.CharField(blank=False, default='RUT', max_length=200,
                                            choices=(
                                                ('RUT','Rut'),
                                                ('PASAPORTE','Pasaporte'),
                                                ('OTRO','Otro'),
                                            ),verbose_name='Tipo de Documento'
                                          ) 
    numero_identificacion = models.CharField(max_length=200, blank=True, verbose_name="Número de Identidad", unique=True)

    nombre_persona = models.CharField(max_length=200, verbose_name="Nombre Persona")
    apellido_paterno = models.CharField(max_length=200, verbose_name="Apellido Paterno")
    apellido_materno = models.CharField(max_length=200, verbose_name="Apellido Materno")
    nombre_completo = models.CharField(max_length=200, verbose_name="Nombre Completo")
    fecha_nacimiento = models.DateField(verbose_name='Fecha de Nacimiento', blank=True, null=True)
    estado_civil = models.CharField(
        null=True,
        blank=True,
        default='MOVIL',
        max_length=200,
        choices=(
            ('SOLTEO/A','Soltero/a'),
            ('CASADO/A','Casado/a'),
            ('VIUDO/A','Viudo/a'),
            ('UNION CIVIL','Union Civil'),
            ('DIVORSIADO/A','Divorsiado/a')
            ),
        verbose_name='Estado Civil'
        )
    hijos = models.PositiveIntegerField(default=0, verbose_name="Hijos",null=True, blank=True)
    nacionalidad = models.CharField(max_length=200, verbose_name="Nacionalidad",null=True, blank=True)
    enfermedad = models.CharField(max_length=200, verbose_name="Enfermedad",null=True, blank=True)
    medicamento = models.CharField(max_length=200, verbose_name="Medicamento",null=True, blank=True)
    lugar_de_atencion = models.CharField(max_length=200, verbose_name="Lugar De Atencion",null=True, blank=True)
    discapacidad = models.BooleanField(default = False, verbose_name = "Discapacidad",null=True, blank=True)
    certificado_compin = models.BooleanField(default = False, verbose_name = "Certificado Compin",null=True, blank=True)
    embarazo = models.BooleanField(default = False, verbose_name = "Embarazo",null=True, blank=True)
    certificado_embarazo = models.BooleanField(default = False, verbose_name = "Certificado Embarazo",null=True, blank=True)

    created = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación", editable=False)
    updated = models.DateTimeField(auto_now=True, verbose_name="Fecha de edición", editable=False)

    class Meta:
        verbose_name = "Persona"
        verbose_name_plural = "Personas"
        ordering = ['created']

    def save(self, *args, **kwargs):
      self.nombre_completo = self.nombre_persona + " " + self.apellido_paterno + ' ' + self.apellido_materno

      if self.id == None:
        self.uv = UV.objects.get(numero_uv=0)
        if self.tipo_identificacion == "RUT":
          self.numero_identificacion = calculadora_rut(self.numero_identificacion)
      
        return super(Persona, self).save(*args, **kwargs)

      else:
        direcciones = Direccion.objects.filter(persona__exact=self)
        direccion = direcciones.get(active=True)
        uv = direccion.uv
        self.uv = uv

        if self.tipo_identificacion == "RUT":
          self.numero_identificacion = calculadora_rut(self.numero_identificacion)

        return super(Persona, self).save(*args, **kwargs)
      
    def __str__(self):
        return f'{self.numero_identificacion}'
