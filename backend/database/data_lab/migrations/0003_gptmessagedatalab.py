# Generated by Django 4.1.5 on 2023-09-25 16:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('data_lab', '0002_apicall_tipo_call'),
    ]

    operations = [
        migrations.CreateModel(
            name='GPTMessageDataLab',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uv', models.IntegerField()),
                ('mensaje', models.TextField(blank=True, max_length=1000, null=True, verbose_name='Mensaje API GPT')),
            ],
        ),
    ]
