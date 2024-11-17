from .models import *
from datetime import datetime
# Compras y Ventas

def Stock_Update(compra, tipo):
    #Obtenemos los Detalles de una Compra
    if tipo == 'Entrada':
        Detalles = DetalleCompra.objects.filter(compra=compra)

        #Iteramos en los Productos Comprados para Crear el Registro
        for Detalle in Detalles:
            Item = Detalle.producto
            Item.stock += Detalle.cantidad
            Item.save()

            #Creamos El Registro de Entrada

            MovimientoStock.objects.create(
                producto = Item,
                cantidad = Detalle.cantidad,
                tipo_movimiento='Entrada'
            )
    elif tipo == 'Salida':
        Detalles = DetalleVenta.objects.filter(venta=compra)

        #Iteramos en los Productos Comprados para Crear el Registro
        for Detalle in Detalles:
            Item = Detalle.producto
            Item.stock -= Detalle.cantidad
            Item.save()

            #Creamos El Registro de Entrada

            MovimientoStock.objects.create(
                producto = Item,
                cantidad = Detalle.cantidad,
                tipo_movimiento='Salida'
            )
