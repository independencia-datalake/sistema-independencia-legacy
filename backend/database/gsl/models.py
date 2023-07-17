from django.db import models
from database.core.models import UV

# Create your models here.

class CategoriaGSL(models.Model):
    nombre_categoria = models.CharField(max_length=40, verbose_name='Categoria de GSL')

    class Meta:
        verbose_name = 'Categoria de GSL'
        verbose_name_plural = 'Categorias de GSL'
        ordering = ['id']

    def __str__(self):
        return f'{self.nombre_categoria}'


class SubCategoriaGSL (models.Model):
    nombre_subcategoria = models.CharField(max_length=40, verbose_name='Subcategoria de GSL')
    categoria = models.ForeignKey(CategoriaGSL, on_delete=models.CASCADE, related_name='subcategorias')

    class Meta:
        verbose_name = 'Subcategoria de GSL'
        verbose_name_plural = 'Subcategorias de GSL'
        ordering = ['id']

    def __str__(self):
        return f'{self.nombre_subcategoria}'

class GSL(models.Model):
    importID = models.IntegerField(primary_key=True)
    RUN = models.IntegerField(blank=True, null=True)
    ID_CIUDADANO_SIN_RSH = models.IntegerField(blank=True, null=True)
    Categoria = models.ForeignKey(CategoriaGSL, on_delete=models.PROTECT, verbose_name='categoria GSL')
    Subcategoria = models.ForeignKey(SubCategoriaGSL, on_delete=models.PROTECT, verbose_name='subcategoria GSL')
    Beneficios_o_Servicio = models.CharField(max_length=255, blank=True, null=True)
    Fecha_de_Compromiso = models.DateField(blank=True, null=True)
    Fecha_decreto = models.DateField(blank=True, null=True)
    Monto = models.IntegerField(blank=True, null=True)
    Estado = models.IntegerField(blank=True, null=True)
    CALLE = models.CharField(max_length=255, blank=True, null=True)
    Numero_calle_RSH = models.CharField(max_length=255, blank=True, null=True)
    UV = models.ForeignKey(UV, on_delete=models.CASCADE, verbose_name='UV')
    Cod_region_GSL = models.IntegerField(blank=True, null=True)
    Cod_comuna_GSL = models.IntegerField(blank=True, null=True)




