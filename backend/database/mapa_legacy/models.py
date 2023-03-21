from django.db import models

class ModeloPrueba(models.Model):
    test = models.CharField(max_length=50, verbose_name="test",null=True, blank=True)
    image = models.ImageField(upload_to='test/image')
    class Meta:
        verbose_name = "Prueba"

