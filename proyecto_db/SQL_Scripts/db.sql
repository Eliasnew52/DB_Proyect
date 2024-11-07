CREATE DATABSE DBTEST1



CREATE TABLE Categoria (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);


CREATE TABLE Producto (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio_venta DECIMAL(10, 2) NOT NULL,
    precio_compra DECIMAL(10, 2) NOT NULL,
    descripcion TEXT,
    stock_minimo INT NOT NULL,
    stock INT NOT NULL,
    ultima_actualizacion DATETIME NOT NULL,
    categoria_id INT,
    FOREIGN KEY (categoria_id) REFERENCES Categoria(id)
);

CREATE TABLE Empresa (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE Proveedor (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    telefono VARCHAR(15),
    empresa_id INT,
    FOREIGN KEY (empresa_id) REFERENCES Empresa(id)
);

CREATE TABLE Compra (
    id INT IDENTITY(1,1) PRIMARY KEY,
    fecha DATETIME NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    proveedor_id INT,
    FOREIGN KEY (proveedor_id) REFERENCES Proveedor(id)
);

CREATE TABLE DetalleCompra (
    id INT IDENTITY(1,1) PRIMARY KEY,
    compra_id INT,
    producto_id INT,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (compra_id) REFERENCES Compra(id),
    FOREIGN KEY (producto_id) REFERENCES Producto(id)
);


CREATE TABLE Cliente (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion TEXT,
    email VARCHAR(255)
);


CREATE TABLE Venta (
    id INT IDENTITY(1,1) PRIMARY KEY,
    fecha DATETIME NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    forma_de_pago VARCHAR(100) NOT NULL,
    estado VARCHAR(100) NOT NULL,
    cliente_id INT,
    FOREIGN KEY (cliente_id) REFERENCES Cliente(id)
);

CREATE TABLE DetalleVenta (
    id INT IDENTITY(1,1) PRIMARY KEY,
    venta_id INT,
    producto_id INT,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (venta_id) REFERENCES Venta(id),
    FOREIGN KEY (producto_id) REFERENCES Producto(id)
);

CREATE TABLE FacturaVenta (
    id INT IDENTITY(1,1) PRIMARY KEY,
    fecha DATETIME NOT NULL,
    impuestos DECIMAL(10, 2) NOT NULL,
    monto_total DECIMAL(10, 2) NOT NULL,
    venta_id INT,
    FOREIGN KEY (venta_id) REFERENCES Venta(id)
);
