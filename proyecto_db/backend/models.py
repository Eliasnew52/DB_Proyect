from django.db import models
from datetime import timedelta
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from django.db.models import F
from django.core.exceptions import ValidationError
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.db import transaction


class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    creado_por = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    ultima_actualizacion = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    imagen = models.ImageField(upload_to='categorias/', blank=True, null=True)

    def __str__(self):
        return self.nombre

class Empresa(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    ultima_actualizacion = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    creado_por = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)


    def __str__(self):
        return self.nombre

class Proveedor(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    email = models.EmailField(max_length=255, blank=True, null=True, unique=True)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE)
    marcas = models.ManyToManyField('Marca')
    ultima_actualizacion = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    creado_por = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return f'{self.nombre} - {self.empresa}'

class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    precio_venta = models.DecimalField(max_digits=10, decimal_places=2)
    precio_compra = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.TextField(blank=True, null=True)
    stock_minimo = models.IntegerField()
    stock = models.IntegerField()
    ultima_actualizacion = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    proveedores = models.ForeignKey(Proveedor, on_delete=models.PROTECT, blank=True, null=True)
    imagen = models.ImageField(upload_to='productos/', blank=True, null=True)
    activo = models.BooleanField(default=True)
    marca = models.ForeignKey('Marca', on_delete=models.PROTECT, related_name='productos', blank=True, null=True)
    creado_por = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)

    class Meta:
        indexes = [
            models.Index(fields=['nombre']),
            models.Index(fields=['stock'])
        ]
        constraints = [
            models.CheckConstraint(
                check=models.Q(stock__gte=0),
                name='stock_no_negativo'
            )
        ]

    def clean(self):
        if self.stock < 0:
            raise ValidationError("El stock no puede ser negativo")
        if self.precio_venta < self.precio_compra:
            raise ValidationError("El precio de venta no puede ser menor al de compra")
        
    def check_stock(self, cantidad_requerida):
        return self.stock >= cantidad_requerida

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
    imagen_factura = models.ImageField(upload_to='compras/facturas/', blank=True, null=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE)
    observaciones = models.TextField(blank=True, null=True)
    creado_por = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True) 
    ultima_actualizacion = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    @transaction.atomic
    def crear_compra(self, detalles_data):
        if not self.numero_factura:
            self.numero_factura = f'C-{self.proveedor.empresa.nombre[:3]}-{timezone.now().year}-{self.id or "00000"}'
        
        if not self.fecha_vencimiento:
            self.fecha_vencimiento = timezone.now() + timedelta(days=30)
        
        self.full_clean()
        self.save() 
        
        detalles = []
        total = 0
        for detalle in detalles_data:
            d = DetalleCompra(
                compra=self,
                producto=detalle['producto'],
                cantidad=detalle['cantidad'],
                precio_unitario=detalle['precio_unitario']
            )
            d.full_clean()
            detalles.append(d)
            total += d.precio_total
        
        self.total = total
        self.save(update_fields=['total'])
        
        DetalleCompra.objects.bulk_create(detalles)
        
        for detalle in detalles:
            producto = detalle.producto
            producto.stock = models.F('stock') + detalle.cantidad
            producto.precio_compra = detalle.precio_unitario
            producto.save(update_fields=['stock', 'precio_compra'])
            
            MovimientoStock.objects.create(
                producto=producto,
                cantidad=detalle.cantidad,
                tipo_movimiento='Entrada',
                compra=self
            )
        
        return self

    def clean(self):
        if self.total < 0:
            ValidationError("El total no puede ser negativo")

    def __str__(self):
        return f"Compra {self.id} - {self.fecha}"

class DetalleCompra(models.Model):
    compra = models.ForeignKey(Compra, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        self.producto.stock = F('stock') + self.cantidad
        self.producto.precio_compra = self.precio_unitario
        self.producto.save()
        super().save(*args, **kwargs)
        
        MovimientoStock.objects.create(
            producto=self.producto,
            cantidad=self.cantidad,
            tipo_movimiento='Entrada',
            compra=self.compra
        )

    def __str__(self):
        return f"{self.producto.nombre} - {self.cantidad} unidades"

class Cliente(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    direccion = models.TextField(blank=True, null=True)
    email = models.EmailField(max_length=255, blank=True, null=True, unique=True)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    creado_por = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    ultima_actualizacion = models.DateTimeField(auto_now_add=True, blank=True, null=True)


    def __str__(self):
        return self.nombre
    
class Descuento(models.Model):
    class ScopeType(models.TextChoices):
        TODOS_PRODUCTOS = 'ALL', 'Todos los productos'
        PRODUCTOS_SELECCIONADOS = 'PROD', 'Productos específicos'
        TODAS_CATEGORIAS = 'CAT_ALL', 'Todas las categorías'
        CATEGORIAS_SELECCIONADAS = 'CAT', 'Categorías específicas'

    class TipoDescuento(models.TextChoices):
        PORCENTAJE = 'POR', 'Porcentaje'
        MONTO_FIJO = 'FIX', 'Monto Fijo'

    nombre = models.CharField(max_length=100)
    tipo = models.CharField(max_length=3, choices=TipoDescuento.choices)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    alcance = models.CharField(
        max_length=10,
        choices=ScopeType.choices,
        default=ScopeType.PRODUCTOS_SELECCIONADOS
    )
    productos = models.ManyToManyField(Producto, blank=True)
    categorias = models.ManyToManyField(Categoria, blank=True)
    activo = models.BooleanField(
        default=True,
        help_text="Descuento disponible para aplicar"
    )
    creado_por = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    ultima_actualizacion = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    def __str__(self):
        return f"{self.nombre}"

    def clean(self):
        if self.alcance == self.ScopeType.PRODUCTOS_SELECCIONADOS and not self.productos.exists():
            raise ValidationError("Debe seleccionar al menos un producto para este alcance")
            
        if self.alcance == self.ScopeType.CATEGORIAS_SELECCIONADAS and not self.categorias.exists():
            raise ValidationError("Debe seleccionar al menos una categoría para este alcance")

    def productos_aplicables(self):
        """Retorna queryset con productos elegibles para el descuento"""
        if self.alcance == self.ScopeType.TODOS_PRODUCTOS:
            return Producto.objects.all()
        
        if self.alcance == self.ScopeType.TODAS_CATEGORIAS:
            return Producto.objects.filter(categoria__isnull=False)
        
        if self.alcance == self.ScopeType.CATEGORIAS_SELECCIONADAS:
            return Producto.objects.filter(categoria__in=self.categorias.all())
        
        return self.productos.all()

    def aplicar_a_producto(self, producto):
        """Verifica si el descuento aplica a un producto específico"""
        if not self.esta_activo:
            return False
            
        if self.alcance == self.ScopeType.TODOS_PRODUCTOS:
            return True
            
        if self.alcance == self.ScopeType.TODAS_CATEGORIAS and producto.categoria:
            return True
            
        if self.alcance == self.ScopeType.CATEGORIAS_SELECCIONADAS:
            return producto.categoria in self.categorias.all()
            
        return producto in self.productos.all()

    def calcular_descuento(self, precio_original):
        if not self.esta_activo:
            return 0
            
        if self.tipo == self.TipoDescuento.PORCENTAJE:
            return precio_original * (self.valor / 100)
            
        return min(self.valor, precio_original)    

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
    # forma_de_pago = models.CharField(choices=forma_de_pago_choices,max_length=100, default=forma_de_pago_choices[0][0])

    forma_de_pago = models.ForeignKey('MetodoPago', on_delete=models.PROTECT)
    estado = models.CharField(choices=estado_choices,max_length=100, default=estado_choices[0][0])
    cliente = models.ForeignKey('Cliente', on_delete=models.CASCADE)
    productos = models.ManyToManyField(Producto, through='DetalleVenta')
    creado_por = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)

    class Meta:
        ordering = ['-fecha']
        indexes = [
            models.Index(fields=['-fecha', 'cliente']),
            models.Index(fields=['estado']),
        ]

    @transaction.atomic
    def crear_venta(self, detalles_data):
        
        self.full_clean()
        self.save()  
        
        detalles = []
        total = 0
        for detalle in detalles_data:
            producto = detalle['producto']
            cantidad = detalle['cantidad']
            descuento = detalle.get('descuento')
            
            if producto.stock < cantidad:
                raise ValidationError(f"Stock insuficiente para {producto.nombre}")
            
            precio_unitario = producto.precio_venta
            if descuento and descuento.aplicar_a_producto(producto):
                precio_unitario -= descuento.calcular_descuento(producto.precio_venta)
            
            d = DetalleVenta(
                venta=self,
                producto=producto,
                cantidad=cantidad,
                precio_unitario=precio_unitario,
                descuento=descuento
            )
            d.full_clean()
            detalles.append(d)
            total += d.precio_total
        
        self.total = total
        self.save(update_fields=['total'])
        
        DetalleVenta.objects.bulk_create(detalles)
        
        for detalle in detalles:
            producto = detalle.producto
            producto.stock = models.F('stock') - detalle.cantidad
            producto.save(update_fields=['stock'])
            
            MovimientoStock.objects.create(
                producto=producto,
                cantidad=detalle.cantidad,
                tipo_movimiento='Salida',
                venta=self
            )
        
        return self

    def clean(self):
        if self.total < 0:
            raise ValidationError("El total no puede ser negativo")
    
    def generar_factura(self):
        from .signals import generar_factura_venta
        generar_factura_venta(sender=self.__class__, instance=self, created=False)

    def __str__(self):
        return f"Venta {self.id} - {self.fecha}"

class DetalleVenta(models.Model):
    venta = models.ForeignKey('Venta', on_delete=models.CASCADE)
    producto = models.ForeignKey('Producto', on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    descuento = models.ForeignKey('Descuento', null=True, blank=True, on_delete=models.SET_NULL)
    creado_por = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.producto.stock < self.cantidad:
            raise ValidationError("Stock insuficiente para realizar la venta")
            
        self.producto.stock = F('stock') - self.cantidad
        self.producto.save()
        super().save(*args, **kwargs)
        
        MovimientoStock.objects.create(
            producto=self.producto,
            cantidad=self.cantidad,
            tipo_movimiento='Salida',
            venta=self.venta
        )

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
    creado_por = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    ultima_actualizacion = models.DateTimeField(auto_now_add=True, blank=True, null=True)

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

class DevolucionCompra(models.Model):
    compra = models.ForeignKey(Compra, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()
    motivo = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20, choices=[
        ('Pendiente', 'Pendiente'),
        ('Aprobada', 'Aprobada'),
        ('Rechazada', 'Rechazada')
    ], default='Pendiente')
    creado_por = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    ultima_actualizacion = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.cantidad > self.compra.detallecompra_set.get(producto=self.producto).cantidad:
            raise ValidationError("Cantidad a devolver excede la compra original")
            
        super().save(*args, **kwargs)
        
        if self.estado == 'Aprobada':
            self.producto.stock = F('stock') - self.cantidad
            self.producto.save()
            
            MovimientoStock.objects.create(
                producto=self.producto,
                cantidad=self.cantidad,
                tipo_movimiento='Salida',
                devolucion_compra=self
            )

class DevolucionVenta(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()
    motivo = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20, choices=[
        ('Pendiente', 'Pendiente'),
        ('Aprobada', 'Aprobada'),
        ('Rechazada', 'Rechazada')
    ], default='Pendiente')
    creado_por = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)

    def save(self, *args, **kwargs):
        detalle_original = self.venta.detalleventa_set.get(producto=self.producto)
        if self.cantidad > detalle_original.cantidad:
            raise ValidationError("Cantidad a devolver excede la venta original")
        
        super().save(*args, **kwargs)
        
        if self.estado == 'Aprobada':
            self.producto.stock = F('stock') + self.cantidad
            self.producto.save()
            
            MovimientoStock.objects.create(
                producto=self.producto,
                cantidad=self.cantidad,
                tipo_movimiento='Entrada',
                devolucion_venta=self
            )

class MetodoPago(models.Model):
    class Tipos(models.TextChoices):
        EFECTIVO = 'EF', 'Efectivo'
        TARJETA_CREDITO = 'TC', 'Tarjeta de Crédito'
        TARJETA_DEBITO = 'TD', 'Tarjeta de Débito'
    
    nombre = models.CharField(max_length=2, choices=Tipos.choices, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    activo = models.BooleanField(default=True)
    creado_por = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    ultima_actualizacion = models.DateTimeField(auto_now_add=True, blank=True, null=True)

class Marca(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    fecha_creacion = models.DateField(auto_now_add=True)
    imagen = models.ImageField(upload_to='marcas/', blank=True, null=True)
    creado_por = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    ultima_actualizacion = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    
    class Meta:
        verbose_name = 'Marca'
        verbose_name_plural = 'Marcas'
        ordering = ['nombre']
        indexes = [
            models.Index(fields=['nombre'], name='idx_nombre_marca')
        ]

    def __str__(self):
        return f"Marca {self.nombre}"