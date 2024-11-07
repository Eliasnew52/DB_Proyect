INSERT INTO Categoria (nombre) VALUES ('Cuadernos');
INSERT INTO Categoria (nombre) VALUES ('Lápices');
INSERT INTO Categoria (nombre) VALUES ('Bolígrafos');

INSERT INTO Empresa (nombre) VALUES ('Distribuidora Escolar S.A.');
INSERT INTO Empresa (nombre) VALUES ('Papelería Central');
INSERT INTO Empresa (nombre) VALUES ('Librería Moderna');

INSERT INTO Proveedor (nombre, email, telefono, empresa_id) VALUES ('Proveedor Escolar', 'escolar@example.com', '123456789', 1);
INSERT INTO Proveedor (nombre, email, telefono, empresa_id) VALUES ('Central Supply', 'central@example.com', '987654321', 2);
INSERT INTO Proveedor (nombre, email, telefono, empresa_id) VALUES ('Librería Proveedora', 'moderna@example.com', '555666777', 3);

INSERT INTO Producto (nombre, precio_venta, precio_compra, descripcion, stock_minimo, stock, ultima_actualizacion, categoria_id) 
VALUES ('Cuaderno de 100 hojas', 2.50, 1.50, 'Cuaderno tamaño carta con 100 hojas', 10, 100, NOW(), 1);
INSERT INTO Producto (nombre, precio_venta, precio_compra, descripcion, stock_minimo, stock, ultima_actualizacion, categoria_id) 
VALUES ('Lápiz HB', 0.50, 0.20, 'Lápiz HB de grafito', 50, 500, NOW(), 2);
INSERT INTO Producto (nombre, precio_venta, precio_compra, descripcion, stock_minimo, stock, ultima_actualizacion, categoria_id) 
VALUES ('Bolígrafo azul', 1.00, 0.60, 'Bolígrafo azul de tinta líquida', 30, 300, NOW(), 3);

INSERT INTO Cliente (nombre, direccion, email) VALUES ('Ana García', 'Calle Real 123', 'ana.garcia@example.com');
INSERT INTO Cliente (nombre, direccion, email) VALUES ('Pedro Sánchez', 'Avenida Principal 456', 'pedro.sanchez@example.com');
INSERT INTO Cliente (nombre, direccion, email) VALUES ('Lucía Martínez', 'Plaza Mayor 789', 'lucia.martinez@example.com');

INSERT INTO Compra (fecha, total, proveedor_id) VALUES (NOW(), 150.00, 1);
INSERT INTO Compra (fecha, total, proveedor_id) VALUES (NOW(), 100.00, 2);
INSERT INTO Compra (fecha, total, proveedor_id) VALUES (NOW(), 180.00, 3);

INSERT INTO DetalleCompra (compra_id, producto_id, cantidad, precio_unitario) VALUES (1, 1, 50, 1.50);
INSERT INTO DetalleCompra (compra_id, producto_id, cantidad, precio_unitario) VALUES (2, 2, 200, 0.20);
INSERT INTO DetalleCompra (compra_id, producto_id, cantidad, precio_unitario) VALUES (3, 3, 300, 0.60);

INSERT INTO Venta (fecha, total, forma_de_pago, estado, cliente_id) VALUES (NOW(), 250.00, 'Tarjeta de Crédito', 'Completada', 1);
INSERT INTO Venta (fecha, total, forma_de_pago, estado, cliente_id) VALUES (NOW(), 100.00, 'Efectivo', 'Completada', 2);
INSERT INTO Venta (fecha, total, forma_de_pago, estado, cliente_id) VALUES (NOW(), 180.00, 'Transferencia', 'Completada', 3);

INSERT INTO DetalleVenta (venta_id, producto_id, cantidad, precio_unitario) VALUES (1, 1, 100, 2.50);
INSERT INTO DetalleVenta (venta_id, producto_id, cantidad, precio_unitario) VALUES (2, 2, 200, 0.50);
INSERT INTO DetalleVenta (venta_id, producto_id, cantidad, precio_unitario) VALUES (3, 3, 300, 1.00);

INSERT INTO FacturaVenta (fecha, impuestos, monto_total, venta_id) VALUES (NOW(), 25.00, 275.00, 1);
INSERT INTO FacturaVenta (fecha, impuestos, monto_total, venta_id) VALUES (NOW(), 10.00, 110.00, 2);
INSERT INTO FacturaVenta (fecha, impuestos, monto_total, venta_id) VALUES (NOW(), 18.00, 198.00, 3);
