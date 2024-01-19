from django.db.models.signals import pre_save, pre_delete
from django.dispatch import receiver
from django.db.models import F

from .models import (
    ProductoFarmacia,
    ProductoVendido,
    ComprobanteVenta,
)
from .models import (
    BodegaVirtual,
    ProductoMermado,
    ProductoIngresado,
)

## STOCK SIGNALS
# Descuenta el stock al ingresar la merma de un producto

@receiver(pre_save, sender=ProductoMermado)
def update_bodega_by_mermado(sender, instance, **kwargs):
    key = instance.nombre.id
    cantidad_mermada = instance.cantidad
    nombre = instance.nombre
    bodvirt = BodegaVirtual.objects.get(nombre_id=key)
    if bodvirt:
        stock_actual = bodvirt.stock 
        nuevo_stock = stock_actual - cantidad_mermada
        bodvirt.stock = nuevo_stock
        bodvirt.save()

@receiver(pre_save, sender=ProductoVendido)
def update_bodega_by_venta(sender, instance, **kwargs):

    print('se esta editando un producto vendido')

    # num = ProductoVendido.objects.filter(pk=instance.pk).count()
    # if num == 0:        
    #     key = instance.nombre.id
    #     cantidad_vendida = instance.cantidad
    #     bodvirt = BodegaVirtual.objects.get(nombre_id=key)
    #     if bodvirt:
    #         stock_actual = bodvirt.stock
    #         nuevo_stock = stock_actual - cantidad_vendida
    #         bodvirt.stock = nuevo_stock
    #         bodvirt.save()
            
    # else:
    #     key = instance.nombre.id
    #     cantidad_antigua = ProductoVendido.objects.get(pk=instance.pk).cantidad
    #     cantidad_vendida = instance.cantidad
    #     cantidad_update = cantidad_vendida - cantidad_antigua
    #     bodvirt = BodegaVirtual.objects.get(nombre_id=key)
    #     if bodvirt:
    #         stock_actual = bodvirt.stock
    #         nuevo_stock = stock_actual - cantidad_update
    #         bodvirt.stock = nuevo_stock
    #         bodvirt.save()        

@receiver(pre_delete, sender=ProductoVendido)
def update_bodega_by_venta_ondelete(sender, instance, **kwargs):
        #SIGNAL OBSOLETA
        key = instance.nombre.id
        # cantidad_vendida_cancelada = instance.cantidad
        # bodvirt = BodegaVirtual.objects.get(nombre_id=key)
        # if bodvirt:
        #     stock_actual = bodvirt.stock
        #     nuevo_stock = stock_actual + cantidad_vendida_cancelada
        #     bodvirt.stock = nuevo_stock
        #     bodvirt.save()
    
@receiver(pre_save, sender = ProductoIngresado)
def update_bodega_by_ingreso(sender, instance, **kwargs):
    key = instance.nombre.id
    cantidad_ingresada = instance.cantidad
    bodvirt = BodegaVirtual.objects.get(nombre_id=key)
    if bodvirt:
        stock_actual = bodvirt.stock
        nuevo_stock = stock_actual + cantidad_ingresada
        bodvirt.stock = nuevo_stock
        bodvirt.save()    

    precio_venta_ingreso = instance.precio_venta
    prod_farm = ProductoFarmacia.objects.get(id=key)
    precio_venta_producto = prod_farm.precio
    if precio_venta_ingreso != precio_venta_producto:
        prod_farm.precio = precio_venta_ingreso
        prod_farm.save()

@receiver(pre_save, sender=ComprobanteVenta)
def update_stock(sender, instance, **kwargs):
    # Se comprueba si la instancia ya existía antes (es decir, si se está editando una instancia existente)
    if instance.pk is not None and instance.pk != 1:
        # Se obtiene la instancia original antes de la edición
        original_instance = sender.objects.get(pk=instance.pk)
        # Si el estado ha cambiado a 'CANCELADA'
        if original_instance.estado == 'FINALIZADA' and instance.estado == 'CANCELADA':
            # Se obtienen los productos vendidos en el comprobante de venta que se está cancelando
            productos_vendidos = ProductoVendido.objects.filter(n_venta=instance)
            for producto_vendido in productos_vendidos:
                # Se obtiene la instancia correspondiente en BodegaVirtual
                bodega_virtual = BodegaVirtual.objects.get(nombre=producto_vendido.nombre)
                # Se incrementa el stock en BodegaVirtual en la cantidad vendida
                bodega_virtual.stock = F('stock') + producto_vendido.cantidad
                bodega_virtual.save()
        elif original_instance.estado == 'CANCELADA' and instance.estado == 'FINALIZADA':
            #Restauranto venta cancelada
            productos_vendidos = ProductoVendido.objects.filter(n_venta=instance)
            for producto_vendido in productos_vendidos:
                bodega_virtual = BodegaVirtual.objects.get(nombre=producto_vendido.nombre)
                bodega_virtual.stock = F('stock') - producto_vendido.cantidad
                bodega_virtual.save()

        elif original_instance.estado != instance.estado and instance.estado == 'FINALIZADA':
            print('signal venta finalizada')
            productos_vendidos = ProductoVendido.objects.filter(n_venta=instance)
            for producto_vendido in productos_vendidos:
                bodega_virtual = BodegaVirtual.objects.get(nombre=producto_vendido.nombre)
                bodega_virtual.stock = F('stock') - producto_vendido.cantidad
                bodega_virtual.save()
        

