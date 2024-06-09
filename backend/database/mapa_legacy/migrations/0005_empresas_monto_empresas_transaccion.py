# Generated by Django 4.1.5 on 2024-01-18 12:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mapa_legacy', '0004_alter_exencionaseo_tramo_rsh'),
    ]

    operations = [
        migrations.AddField(
            model_name='empresas',
            name='monto',
            field=models.PositiveIntegerField(blank=True, null=True, verbose_name='Monto'),
        ),
        migrations.AddField(
            model_name='empresas',
            name='transaccion',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Fecha de transaccion'),
        ),
    ]