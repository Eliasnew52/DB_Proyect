from django.db import models

class Categoria(models.Model):
    id_categoria = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

class Producto(models.Model):
    id_producto = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    precio_venta = models.DecimalField(max_digits=10, decimal_places=2)
    precio_compra = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.TextField()
    stock_minimo = models.IntegerField()
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre

class Inventario(models.Model):
    id_inventario = models.AutoField(primary_key=True)
    stock = models.IntegerField()
    ultima_actualizacion = models.DateTimeField(auto_now=True)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)

class Empresa(models.Model):
    id_empresa = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

class Proveedor(models.Model):
    id_proveedor = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    email = models.EmailField()
    telefono = models.CharField(max_length=15)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre

class Compra(models.Model):
    id_compra = models.AutoField(primary_key=True)
    fecha = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE)

class DetalleCompra(models.Model):
    id_detalle_compra = models.AutoField(primary_key=True)
    compra = models.ForeignKey(Compra, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

class Cliente(models.Model):
    id_cliente = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    direccion = models.TextField()
    email = models.EmailField()

    def __str__(self):
        return self.nombre

class Venta(models.Model):
    id_venta = models.AutoField(primary_key=True)
    fecha = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    forma_de_pago = models.CharField(max_length=100)
    estado = models.CharField(max_length=100)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)

class DetalleVenta(models.Model):
    id_detalle_venta = models.AutoField(primary_key=True)
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

class FacturaVenta(models.Model):
    id_factura = models.AutoField(primary_key=True)
    fecha = models.DateTimeField(auto_now_add=True)
    impuestos = models.DecimalField(max_digits=10, decimal_places=2)
    monto_total = models.DecimalField(max_digits=10, decimal_places=2)
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE)
