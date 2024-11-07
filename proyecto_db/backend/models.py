from django.db import models
from django.db.models import Sum, F
from django.db.models.signals import post_save
from django.dispatch import receiver

class Cliente(models.Model):
    nombre = models.CharField(max_length=100)
    direccion = models.TextField()
    email = models.EmailField()

    def __str__(self):
        return self.nombre

class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    precio_venta = models.DecimalField(max_digits=10, decimal_places=2)
    precio_compra = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.TextField()
    stock_minimo = models.IntegerField()
    stock = models.IntegerField()
    ultima_actualizacion = models.DateTimeField(auto_now=True)
    categoria = models.ForeignKey('Categoria', on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre

class Venta(models.Model):
    fecha = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    forma_de_pago = models.CharField(max_length=100)
    estado = models.CharField(max_length=100)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Recalcular el total después de guardar la venta
        total = self.detalleventa_set.aggregate(
            total=Sum(F('cantidad') * F('precio_unitario'))
        )['total']
        self.total = total if total else 0
        super().save(update_fields=['total'])
    
    def __str__(self):
        return f'Venta a: {self.cliente} Fecha: {self.fecha} - C${self.total}'

class DetalleVenta(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Recalcular el total de la venta después de guardar el detalle
        self.venta.save()

@receiver(post_save, sender=DetalleVenta)
def update_venta_total(sender, instance, **kwargs):
    venta = instance.venta
    total = venta.detalleventa_set.aggregate(
        total=Sum(F('cantidad') * F('precio_unitario'))
    )['total']
    venta.total = total if total else 0
    venta.save(update_fields=['total'])

class Categoria(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

class Empresa(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

class Proveedor(models.Model):
    nombre = models.CharField(max_length=100)
    email = models.EmailField()
    telefono = models.CharField(max_length=15)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre

class Compra(models.Model):
    fecha = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE)

class DetalleCompra(models.Model):
    compra = models.ForeignKey(Compra, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

class FacturaVenta(models.Model):
    fecha = models.DateTimeField(auto_now_add=True)
    impuestos = models.DecimalField(max_digits=10, decimal_places=2)
    monto_total = models.DecimalField(max_digits=10, decimal_places=2)
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE)
