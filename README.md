# DB_Proyect
Repositorio del Proyecto Final de Bases de Datos

# Flujo de Datos de la Base de Datos 📊

Este documento describe el flujo de datos de nuestra base de datos para gestionar el inventario de una librería, incluyendo las compras, ventas y movimientos de stock de productos.

## 1. Categorías y Productos 🛒

**Tabla `Categoria`**:
- Define las categorías de los productos, como Cuadernos, Lápices y Bolígrafos.

**Tabla `Producto`**:
- Almacena información sobre cada producto, incluyendo precios y stock actual.
- Cada producto está vinculado a una categoría mediante `categoria_id`.

### Flujo de Datos:
- **Inserción de Producto**: Cuando se crea un nuevo producto, se especifica su categoría y se introducen sus precios y stock inicial.
- **Actualización de Producto**: Los detalles de un producto (por ejemplo, precio, stock) pueden actualizarse en cualquier momento.

## 2. Proveedores y Compras 🏢

**Tabla `Empresa`**:
- Almacena información sobre las empresas proveedoras.

**Tabla `Proveedor`**:
- Almacena información sobre los proveedores y su relación con las empresas.

**Tabla `Compra`**:
- Registra cada compra realizada a un proveedor, incluyendo fecha y total.

**Tabla `DetalleCompra`**:
- Registra los detalles de cada compra, como productos comprados y cantidades.

### Flujo de Datos:
- **Inserción de Compra**: Al realizar una compra, se crea un registro en `Compra`.
- **Detalles de Compra**: Cada producto comprado se registra en `DetalleCompra` con su cantidad y precio.
- **Actualización de Stock**: Un registro en `MovimientoStock` se crea para cada producto comprado, incrementando su stock.

## 3. Clientes y Ventas 🧾

**Tabla `Cliente`**:
- Almacena información sobre los clientes.

**Tabla `Venta`**:
- Registra cada venta realizada a un cliente, incluyendo fecha, total y forma de pago.

**Tabla `DetalleVenta`**:
- Registra los detalles de cada venta, como productos vendidos y cantidades.

**Tabla `FacturaVenta`**:
- Almacena información sobre las facturas de las ventas, incluyendo impuestos y montos totales.

### Flujo de Datos:
- **Inserción de Venta**: Al realizar una venta, se crea un registro en `Venta`.
- **Detalles de Venta**: Cada producto vendido se registra en `DetalleVenta` con su cantidad y precio.
- **Actualización de Stock**: Un registro en `MovimientoStock` se crea para cada producto vendido, decrementando su stock.

## 4. Movimiento de Stock 🔄

**Tabla `MovimientoStock`**:
- Registra todos los movimientos de stock (entradas y salidas) de los productos.
- Cada registro incluye el `producto_id`, la cantidad, el tipo de movimiento (Entrada/Salida), y la fecha.

### Flujo de Datos:
- **Entrada de Stock**: Al registrar una compra en `DetalleCompra`, se inserta un registro en `MovimientoStock` como 'Entrada'.
- **Salida de Stock**: Al registrar una venta en `DetalleVenta`, se inserta un registro en `MovimientoStock` como 'Salida'.
- **Consulta de Stock**: El stock actual de un producto se calcula sumando todas las entradas y restando todas las salidas registradas en `MovimientoStock`.

### Consulta del Stock Actual:

```sql
SELECT p.id, p.nombre, 
    SUM(CASE WHEN m.tipo_movimiento = 'Entrada' THEN m.cantidad ELSE 0 END) -
    SUM(CASE WHEN m.tipo_movimiento = 'Salida' THEN m.cantidad ELSE 0 END) AS stock_actual
FROM Producto p
LEFT JOIN MovimientoStock m ON p.id = m.producto_id
GROUP BY p.id, p.nombre;
