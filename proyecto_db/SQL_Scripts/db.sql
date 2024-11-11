CREATE DATABASE DBTEST1;
GO

USE DBTEST1;
GO

-- Crear tabla Categoria
CREATE TABLE Categoria (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Crear tabla Producto
CREATE TABLE Producto (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio_venta DECIMAL(10, 2) NOT NULL,
    precio_compra DECIMAL(10, 2) NOT NULL,
    descripcion TEXT,
    stock_minimo INT NOT NULL,
    stock INT NOT NULL,
    ultima_actualizacion DATETIME NOT NULL DEFAULT GETDATE(),
    categoria_id INT,
    FOREIGN KEY (categoria_id) REFERENCES Categoria(id)
);


-- Crear tabla Empresa
CREATE TABLE Empresa (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Crear tabla Proveedor
CREATE TABLE Proveedor (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    telefono VARCHAR(15),
    empresa_id INT,
    FOREIGN KEY (empresa_id) REFERENCES Empresa(id)
);

-- Crear tabla Compra
CREATE TABLE Compra (
    id INT IDENTITY(1,1) PRIMARY KEY,
    fecha DATETIME NOT NULL DEFAULT GETDATE(),
    total DECIMAL(10, 2) NOT NULL,
    proveedor_id INT,
    FOREIGN KEY (proveedor_id) REFERENCES Proveedor(id)
);

-- Crear tabla DetalleCompra
CREATE TABLE DetalleCompra (
    id INT IDENTITY(1,1) PRIMARY KEY,
    compra_id INT,
    producto_id INT,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (compra_id) REFERENCES Compra(id),
    FOREIGN KEY (producto_id) REFERENCES Producto(id)
);

-- Crear tabla Cliente
CREATE TABLE Cliente (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion TEXT,
    email VARCHAR(255),

);

-- Crear tabla Venta
CREATE TABLE Venta (
    id INT IDENTITY(1,1) PRIMARY KEY,
    fecha DATETIME NOT NULL DEFAULT GETDATE(),
    total DECIMAL(10, 2) NOT NULL,
    forma_de_pago VARCHAR(100) NOT NULL,
    estado VARCHAR(100) NOT NULL,
    cliente_id INT,
    FOREIGN KEY (cliente_id) REFERENCES Cliente(id)
);

-- Crear tabla DetalleVenta
CREATE TABLE DetalleVenta (
    id INT IDENTITY(1,1) PRIMARY KEY,
    venta_id INT,
    producto_id INT,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (venta_id) REFERENCES Venta(id),
    FOREIGN KEY (producto_id) REFERENCES Producto(id)
);

-- Crear tabla FacturaVenta
CREATE TABLE FacturaVenta (
    id INT IDENTITY(1,1) PRIMARY KEY,
    fecha TIMESTAMP NOT NULL,
    impuestos DECIMAL(10, 2) NOT NULL,
    monto_total DECIMAL(10, 2) NOT NULL,
    venta_id INT,
    FOREIGN KEY (venta_id) REFERENCES Venta(id)
);

-- Crear tabla MovimientoStock
CREATE TABLE MovimientoStock (
    id INT IDENTITY(1,1) PRIMARY KEY,
    producto_id INT,
    cantidad INT NOT NULL,
    tipo_movimiento VARCHAR(10) NOT NULL CHECK (tipo_movimiento IN ('Entrada', 'Salida')),
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES Producto(id)
);

-- Crear índices
CREATE NONCLUSTERED INDEX idx_producto_nombre ON Producto(nombre);
CREATE NONCLUSTERED INDEX idx_producto_precio ON Producto(precio_venta, precio_compra);
CREATE NONCLUSTERED INDEX idx_cliente_email ON Cliente(email);
CREATE NONCLUSTERED INDEX idx_detalleventa_cantidad_precio ON DetalleVenta(cantidad, precio_unitario);
CREATE NONCLUSTERED INDEX idx_movimiento_stock_fecha ON MovimientoStock(fecha);
