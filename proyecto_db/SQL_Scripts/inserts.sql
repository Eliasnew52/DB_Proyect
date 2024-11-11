-- Categoria 
INSERT INTO Categoria (nombre) VALUES ('Cuadernos');
INSERT INTO Categoria (nombre) VALUES ('Lápices');
INSERT INTO Categoria (nombre) VALUES ('Bolígrafos');

-- Producto
INSERT INTO Producto (nombre, precio_venta, precio_compra, descripcion, stock_minimo, stock, ultima_actualizacion, categoria_id) 
VALUES ('Cuaderno de 100 hojas', 2.50, 1.50, 'Cuaderno tamaño carta con 100 hojas', 10, 100, DEFAULT, 1);

INSERT INTO Producto (nombre, precio_venta, precio_compra, descripcion, stock_minimo, stock, ultima_actualizacion, categoria_id) 
VALUES ('Lápiz HB', 0.50, 0.20, 'Lápiz HB de grafito', 50, 500, DEFAULT, 2);

INSERT INTO Producto (nombre, precio_venta, precio_compra, descripcion, stock_minimo, stock, ultima_actualizacion, categoria_id) 
VALUES ('Bolígrafo azul', 1.00, 0.60, 'Bolígrafo azul de tinta líquida', 30, 300, DEFAULT, 3);

--Empresa
INSERT INTO Empresa (nombre) VALUES ('Smarty.');
INSERT INTO Empresa (nombre) VALUES ('Pelikan');
INSERT INTO Empresa (nombre) VALUES ('Papermate');

--Proveedores 
INSERT INTO Proveedor (nombre, email, telefono, empresa_id) VALUES ('Jose Luis', 'escolar@example.com', '123456789', 1);
INSERT INTO Proveedor (nombre, email, telefono, empresa_id) VALUES ('Joseph Louis', 'central@example.com', '987654321', 2);
INSERT INTO Proveedor (nombre, email, telefono, empresa_id) VALUES ('Chepe Perro', 'moderna@example.com', '555666777', 3);

--Compra
INSERT INTO Compra (total, proveedor_id) VALUES (150.00, 1);
INSERT INTO Compra (total, proveedor_id) VALUES (100.00, 2);
INSERT INTO Compra (total, proveedor_id) VALUES (180.00, 3);

--Detalle Compra
INSERT INTO DetalleCompra (compra_id, producto_id, cantidad, precio_unitario) VALUES (1, 4, 50, 1.50);
INSERT INTO DetalleCompra (compra_id, producto_id, cantidad, precio_unitario) VALUES (2, 5, 200, 0.20);
INSERT INTO DetalleCompra (compra_id, producto_id, cantidad, precio_unitario) VALUES (3, 6, 300, 0.60);