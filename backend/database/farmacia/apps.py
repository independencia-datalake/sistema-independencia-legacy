from django.apps import AppConfig


class FarmaciaConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'database.farmacia'

    # def ready(self):
    #         from . import signals