from django.db import models
from datetime import timedelta
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

class Categoria(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    imagen = models.ImageField(upload_to='categorias/', blank=True, null=True)

    def __str__(self):
        return self.nombre

class Empresa(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

class Proveedor(models.Model):
    nombre = models.CharField(max_length=100)
    email = models.EmailField(max_length=255, blank=True, null=True)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.nombre} - {self.empresa}'

class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    precio_venta = models.DecimalField(max_digits=10, decimal_places=2)
    precio_compra = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.TextField(blank=True, null=True)
    stock_minimo = models.IntegerField()
    stock = models.IntegerField()
    ultima_actualizacion = models.DateTimeField(auto_now_add=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    proveedores = models.ManyToManyField(Proveedor, through='ProductoProveedor')
    imagen = models.ImageField(upload_to='productos/', blank=True, null=True)

    def __str__(self):
        return self.nombre

class ProductoProveedor(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE)
    fecha_suministro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.producto.nombre} - {self.proveedor.nombre}"

class Compra(models.Model):
    fecha = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE)

    def __str__(self):
        return f"Compra {self.id} - {self.fecha}"

class DetalleCompra(models.Model):
    compra = models.ForeignKey(Compra, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.producto.nombre} - {self.cantidad} unidades"

class Cliente(models.Model):
    nombre = models.CharField(max_length=100)
    direccion = models.TextField(blank=True, null=True)
    email = models.EmailField(max_length=255, blank=True, null=True)
    telefono = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return self.nombre

class Venta(models.Model):
    forma_de_pago_choices = [
        ('Efectivo', 'Efectivo'),
        ('Tarjeta', 'Tarjeta'),
    ]

    estado_choices = [
        ('Pendiente', 'Pendiente'),
        ('Pagado', 'Pagado'),
        ('Anulado', 'Anulado')
    ]

    fecha = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    forma_de_pago = models.CharField(choices=forma_de_pago_choices,max_length=100, default=forma_de_pago_choices[0][0])
    estado = models.CharField(choices=estado_choices,max_length=100, default=estado_choices[0][0])
    cliente = models.ForeignKey('Cliente', on_delete=models.CASCADE)
    productos = models.ManyToManyField(Producto, through='DetalleVenta')

    def __str__(self):
        return f"Venta {self.id} - {self.fecha}"

    def calcular_total(self):
        detalles = DetalleVenta.objects.filter(venta=self)
        total = sum((detalle.precio_unitario - detalle.descuento) * detalle.cantidad for detalle in detalles)
        self.total = total
        self.save()


class DetalleVenta(models.Model):
    venta = models.ForeignKey('Venta', on_delete=models.CASCADE)
    producto = models.ForeignKey('Producto', on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    descuento = models.DecimalField(max_digits=10, decimal_places=2, default=0.0) 

    def __str__(self):
        return f"{self.producto.nombre} - {self.cantidad} unidades from {self.venta}"


class FacturaVenta(models.Model):
    numero_factura = models.CharField(max_length=50, unique=True)
    fecha_emision = models.DateTimeField(auto_now_add=True)
    fecha_vencimiento = models.DateTimeField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    descuento_total = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    monto_total = models.DecimalField(max_digits=10, decimal_places=2)
    observaciones = models.TextField(blank=True, null=True)
    venta = models.ForeignKey('Venta', on_delete=models.CASCADE)

    def __str__(self):
        return f"Factura {self.numero_factura} - {self.fecha_emision}"

    def save(self, *args, **kwargs):
        if not self.numero_factura:
            self.numero_factura = f"F-{self.venta.id}"
        if not self.fecha_emision:
            self.fecha_emision = timezone.now()
        if not self.fecha_vencimiento:
            self.fecha_vencimiento = self.fecha_emision + timedelta(days=30)
        self.descuento_total = sum(detalle.descuento * detalle.cantidad for detalle in DetalleVenta.objects.filter(venta=self.venta))
        self.monto_total = self.total - self.descuento_total
        super(FacturaVenta, self).save(*args, **kwargs)


class MovimientoStock(models.Model):
    TIPO_MOVIMIENTO_CHOICES = [
        ('Entrada', 'Entrada'),
        ('Salida', 'Salida'),
    ]

    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    tipo_movimiento = models.CharField(max_length=10, choices=TIPO_MOVIMIENTO_CHOICES)
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tipo_movimiento} de {self.cantidad} unidades de {self.producto.nombre}"
