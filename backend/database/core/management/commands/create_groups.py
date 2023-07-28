from django.contrib.auth.management.commands import createsuperuser
from django.contrib.auth.models import Group

class Command(createsuperuser.Command):
    help = 'Create a superuser, create groups, and add superuser to a group'

    def handle(self, *args, **options):
        # Crear grupos
        group_names = ['Developer', 'Farmacia-Farmaceuta', 'Farmacia-Vendedor']  # Lista de nombres de grupos a crear
        for name in group_names:
            Group.objects.get_or_create(name=name)
        
        # Luego llamamos al comando original de createsuperuser
        super().handle(*args, **options)
        
        # Después, recuperamos al último superusuario creado
        from django.contrib.auth import get_user_model
        User = get_user_model()
        superuser = User.objects.filter(is_superuser=True).order_by('date_joined').last()
        
        # Finalmente, añadimos el superusuario al grupo deseado
        group = Group.objects.get(name='Developer')  # Cambia 'group1' por el nombre del grupo al que te quieras unir
        group.user_set.add(superuser)