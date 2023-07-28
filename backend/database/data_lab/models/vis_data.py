from django.db import models
from django.urls import reverse

class ApiCall(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    tipo_call = models.CharField(null=True,
                                 blank=True,
                                 max_length=200,
                                choices=(
                                    ('FARMACIA','Farmacia'),
                                    ('SEGURIDAD','Seguridad'),
                                    ('DIMAP','Dimap'),
                                    ('IMPUESTOS Y DERECHOS','Impuestos y derechos'),
                                    ('AYUDA SOCIAL','Ayuda social'),
                                    ('EXCENCION BASURA','Excencion basura'),
                                    ('DOM','Dom'),
                                    ('TRANSITO','Transito'),
                                    ),
                                verbose_name='Origen del llamado'
                                 )
    
    def __str__(self):
        return f'Llamado: {self.id} | Tipo: {self.tipo_call}'

class FarmaciaDataLab(models.Model):
    uv = models.IntegerField
    ventas = models.IntegerField()
    rank_ventas = models.IntegerField(null=True, blank=True)
    api_call = models.ForeignKey(ApiCall, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación", editable=False)

    def __str__(self):
        return f'Llamado: {self.api_call.id} | Unidad Vecinal: {self.uv}'


class ImpuestosYDerechosDataLab(models.Model):
    uv = models.IntegerField()
    total = models.IntegerField()
    alcohol = models.IntegerField()
    comercial = models.IntegerField()
    profesional = models.IntegerField()
    industrial = models.IntegerField()
    microempresa = models.IntegerField()
    estacionada = models.IntegerField()
    rank_total = models.IntegerField(null=True, blank=True)
    rank_alcohol = models.IntegerField(null=True, blank=True)
    rank_comercial = models.IntegerField(null=True, blank=True)
    rank_profesional = models.IntegerField(null=True, blank=True)
    rank_industrial = models.IntegerField(null=True, blank=True)
    rank_microempresa = models.IntegerField(null=True, blank=True)
    rank_estacionada = models.IntegerField(null=True, blank=True)
    api_call = models.ForeignKey(ApiCall, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación", editable=False)

    def __str__(self):
        return f'Llamado: {self.api_call.id} | Unidad Vecinal: {self.uv}'

class DOMDataLab(models.Model):
    uv = models.IntegerField()
    total = models.IntegerField()
    anexion = models.IntegerField()
    antiguas = models.IntegerField()
    anulacion = models.IntegerField()
    cambio_de_destino = models.IntegerField()
    fusion = models.IntegerField()
    ley_20898 = models.IntegerField()
    obras_menores = models.IntegerField()
    permisos_de_edificacion = models.IntegerField()
    recepcion_final = models.IntegerField()
    regularizaciones = models.IntegerField()
    regularizaciones_ley_18591 = models.IntegerField()
    resolucion = models.IntegerField()
    subdivisiones = models.IntegerField()
    ventas_por_piso = models.IntegerField()
    rank_total = models.IntegerField(null=True, blank=True)
    rank_anexion = models.IntegerField(null=True, blank=True)
    rank_antiguas = models.IntegerField(null=True, blank=True)
    rank_anulacion = models.IntegerField(null=True, blank=True)
    rank_cambiodestino = models.IntegerField(null=True, blank=True)
    rank_fusion = models.IntegerField(null=True, blank=True)
    rank_ley20898 = models.IntegerField(null=True, blank=True)
    rank_obrasmenores = models.IntegerField(null=True, blank=True)
    rank_permisosedificacion = models.IntegerField(null=True, blank=True)
    rank_recepcionfinal = models.IntegerField(null=True, blank=True)
    rank_regularizaciones = models.IntegerField(null=True, blank=True)
    rank_regularizaciones18591 = models.IntegerField(null=True, blank=True)
    rank_resolucion = models.IntegerField(null=True, blank=True)
    rank_subdivisiones = models.IntegerField(null=True, blank=True)
    rank_ventasporpiso = models.IntegerField(null=True, blank=True)
    api_call = models.ForeignKey(ApiCall, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación", editable=False)

    def __str__(self):
        return f'Llamado: {self.api_call.id} | Unidad Vecinal: {self.uv}'

class TransitoDataLab(models.Model):
    uv = models.IntegerField()
    licencia_conducir = models.IntegerField()
    permiso_circulacion = models.IntegerField()
    rank_licencia_conducir = models.IntegerField(null=True, blank=True)
    rank_permiso_circulacion = models.IntegerField(null=True, blank=True)
    api_call = models.ForeignKey(ApiCall, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación", editable=False)

    def __str__(self):
        return f'Llamado: {self.api_call.id} | Unidad Vecinal: {self.uv}'
