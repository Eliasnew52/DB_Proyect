# README - Sistema de Gestión de Inventario y Ventas

Este sistema se encarga de gestionar productos, compras, ventas, proveedores, clientes, y el stock de una empresa. A continuación se explica cómo funcionan los modelos y su flujo de datos.

---

## Modelos 🛠️

### 1. **Categoría** 🏷️
- Representa las categorías a las que pertenece un producto.
- Cada producto debe pertenecer a una categoría.
  
  **Relación**: Uno a muchos (una categoría puede tener muchos productos).

### 2. **Empresa** 🏢
- Representa a las empresas a las que pertenecen los proveedores.
  
  **Relación**: Uno a muchos (una empresa puede tener muchos proveedores).

### 3. **Proveedor** 🚚
- Representa a los proveedores que suministran productos.
- Un proveedor está relacionado con una empresa y puede suministrar muchos productos.
  
  **Relación**: 
  - Uno a muchos (un proveedor puede hacer muchas compras).
  - Muchos a muchos con **Producto** a través de **ProductoProveedor**.

### 4. **Producto** 📦
- Representa los productos vendidos en la tienda.
- Cada producto tiene un precio de venta y un precio de compra, así como un stock actual y mínimo.
- Los productos pueden pertenecer a una categoría y tienen proveedores asociados.

  **Relación**:
  - Muchos a uno con **Categoría**.
  - Muchos a muchos con **Proveedor** a través de **ProductoProveedor**.
  - Muchos a muchos con **Venta** a través de **DetalleVenta**.

### 5. **ProductoProveedor** 🔄
- Relaciona los productos con los proveedores que los suministran.
- Incluye información como la fecha de suministro.

  **Relación**: Muchos a uno con **Producto** y **Proveedor**.

### 6. **Compra** 🛒
- Registra una compra realizada a un proveedor.
- Incluye el total de la compra y la fecha en la que se realizó.

  **Relación**: Muchos a uno con **Proveedor**.
  - Uno a muchos con **DetalleCompra**.

### 7. **DetalleCompra** 📋
- Desglosa una compra, especificando qué productos fueron adquiridos, la cantidad y el precio unitario.

  **Relación**: Muchos a uno con **Compra** y **Producto**.

### 8. **Cliente** 👤
- Representa a los clientes que realizan compras en la tienda.
- Contiene información básica como nombre, dirección y email.

  **Relación**: Uno a muchos con **Venta**.

### 9. **Venta** 💰
- Representa una venta realizada a un cliente.
- Incluye detalles como la forma de pago y el estado de la venta.
- Calcula el total de la venta mediante los productos vendidos y sus cantidades.

  **Relación**:
  - Muchos a uno con **Cliente**.
  - Muchos a muchos con **Producto** a través de **DetalleVenta**.

### 10. **DetalleVenta** 🧾
- Desglosa una venta, especificando qué productos fueron vendidos, la cantidad y el precio unitario.
- Puede incluir un descuento por producto.

  **Relación**: Muchos a uno con **Venta** y **Producto**.

### 11. **FacturaVenta** 📜
- Genera una factura para una venta, calculando el total, los descuentos y el monto total a pagar.
- Incluye la fecha de emisión y de vencimiento.

  **Relación**: Muchos a uno con **Venta**.

### 12. **MovimientoStock** 📉📈
- Registra los movimientos de stock de los productos, ya sea por entrada (cuando se reciben productos) o salida (cuando se venden productos).
- Cada movimiento afecta al stock de un producto específico.

  **Relación**: Muchos a uno con **Producto**.

---

## Flujo de Datos 📊

1. **Producto y Proveedor**: 
   - Un proveedor suministra productos. Cada vez que un proveedor abastece productos, se registra en el modelo **ProductoProveedor**. Los productos pueden tener muchos proveedores, lo que facilita llevar un control de los suministros.

2. **Compra**: 
   - Cuando un proveedor hace una venta de productos, se registra en el modelo **Compra**. Esta incluye detalles como el total de la compra y el proveedor que la realizó.

3. **DetalleCompra**: 
   - Cada compra se desglosa en **DetalleCompra**, que especifica los productos adquiridos, las cantidades y precios unitarios.

4. **Venta**:
   - Los productos disponibles en el inventario se venden a los clientes. Cada venta se registra en el modelo **Venta**, con detalles como la forma de pago y el estado.
   - **DetalleVenta** desglosa los productos vendidos en cada venta, incluyendo descuentos.

5. **FacturaVenta**: 
   - Para cada venta, se genera una **FacturaVenta** que incluye información sobre el total, los descuentos aplicados y el monto total a pagar. Esta factura se asocia directamente con una venta.

6. **MovimientoStock**: 
   - Cada vez que un producto se compra o se vende, se registra un **MovimientoStock** para ajustar el inventario. Se especifica si el movimiento es una "Entrada" o "Salida".

---

## Ejemplo de Flujo 🏃‍♂️

1. **Proveedor** 💼 suministra un **Producto** 📦.
2. Se realiza una **Compra** 🛒 del **Producto** a través del **Proveedor**.
3. Se registra un **DetalleCompra** 📋 con los productos comprados.
4. Cuando se vende el **Producto** 🏷️, se registra una **Venta** 💰 con los **Productos** vendidos.
5. La **Venta** genera una **FacturaVenta** 📜.
6. Se registra un **MovimientoStock** 📉 cuando el **Producto** se vende o una **Entrada** cuando se recibe del proveedor.

---

## Relación Visual 📈

