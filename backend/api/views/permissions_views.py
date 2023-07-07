from rest_framework import permissions
from rest_framework.permissions import OR

    # PERMISOS

class IsDeveloper(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Developer').exists()

class IsFarmaciaFarmaceuta(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Farmacia-Farmaceuta').exists()

class IsFarmaciaVendedor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Farmacia-Vendedor').exists()

  # PREVENT POST

class IsFarmaciaVendedorNOPOST(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'POST':
            return False
        return request.user.groups.filter(name='Farmacia-Vendedor').exists()
    
class JustFarmaciaPOST(permissions.BasePermission):
    def has_permission(self, request, view):
        group_names = ['Farmacia-Vendedor', 'Farmacia-Farmaceuta', 'Developer']
        if request.method =='POST':
            return any(request.user.groups.filter(name=group_name).exists() for group_name in group_names)
        