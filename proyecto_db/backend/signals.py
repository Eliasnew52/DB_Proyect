from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Venta, FacturaVenta
from django.db import models
from django.core.exceptions import ValidationError

@receiver(post_save, sender=Venta)
def generar_factura_venta(sender, instance, created, **kwargs):
    """
    Genera automáticamente la factura cuando el estado de la venta es 'Pagado'
    """
    if instance.estado == 'Pagado' and not hasattr(instance, 'facturaventa'):
        descuento_total = instance.detalleventa_set.annotate(
            monto_descuento=models.Case(
                models.When(
                    descuento__tipo='POR', 
                    then=models.F('precio_unitario') * models.F('descuento__valor') / 100 * models.F('cantidad')
                ),
                models.When(
                    descuento__tipo='FIX', 
                    then=models.F('descuento__valor') * models.F('cantidad')
                ),
                default=0,
                output_field=models.DecimalField()
            )
        ).aggregate(total=models.Sum('monto_descuento'))['total'] or 0
        
        FacturaVenta.objects.create(
            venta=instance,
            total=instance.total,
            descuento_total=descuento_total,
            monto_total=instance.total - descuento_total
        )

@receiver(pre_save, sender=Venta)
def validar_estado_venta(sender, instance, **kwargs):
    """
    Valida que no se modifiquen ventas ya pagadas
    """
    if instance.pk:
        original = Venta.objects.get(pk=instance.pk)
        if original.estado == 'Pagado' and instance.estado != 'Pagado':
            raise ValidationError("No se puede modificar una venta ya pagada")