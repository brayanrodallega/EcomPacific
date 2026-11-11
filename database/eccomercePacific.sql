CREATE DATABASE e_commercePacific;
USE e_commercePacific;


CREATE TABLE EstadoPago (
    idEstadoPago INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);
INSERT INTO EstadoPago (nombre) VALUES ('pendiente'), ('rechazado'), ('aprobado');

CREATE TABLE EstadoPedido (
    idEstadoPedido INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);
INSERT INTO EstadoPedido (nombre) VALUES ('pendiente'), ('enviado'), ('entregado'), ('cancelado');

CREATE TABLE EstadoEnvio (
    idEstadoEnvio INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);
INSERT INTO EstadoEnvio (nombre) VALUES
    ('preparado'), ('listo_para_envio'), ('enviado'),
    ('transito'), ('reparto'), ('entregado');

CREATE TABLE EstadoAlmacen (
    idEstadoAlmacen INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);
INSERT INTO EstadoAlmacen (nombre) VALUES ('activo'), ('inactivo'), ('mantenimiento');

CREATE TABLE EstadoCarritoCompra (
    idEstadoCarritoCompra INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);
INSERT INTO EstadoCarritoCompra (nombre) VALUES ('activo'), ('abandonado');

CREATE TABLE EstadoDevolucion (
    idEstadoDevolucion INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);
INSERT INTO EstadoDevolucion (nombre) VALUES ('solicitada'), ('aprobada'), ('rechazada'), ('reembolsada');




CREATE TABLE Categorias (
    idCategoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);


CREATE TABLE Producto (
    idProducto INT AUTO_INCREMENT PRIMARY KEY,
    imagenUrl VARCHAR(500),
    precio DECIMAL(10,2) NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    marca VARCHAR(100),
    idCategoria INT,
    FOREIGN KEY (idCategoria)
        REFERENCES Categorias(idCategoria)
);




CREATE TABLE Cliente (
    idCliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100),
    contrasena VARCHAR(255) NOT NULL,
    correoElectronico VARCHAR(150) NOT NULL UNIQUE,
    codigoPostal VARCHAR(20)
);


CREATE TABLE ClienteDireccion (
    idClienteDireccion INT AUTO_INCREMENT PRIMARY KEY,
    idCliente INT NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    FOREIGN KEY (idCliente)
        REFERENCES Cliente(idCliente)
        ON DELETE CASCADE
);


CREATE TABLE ClienteCorreo (
    idClienteCorreo INT AUTO_INCREMENT PRIMARY KEY,
    idCliente INT NOT NULL,
    correo VARCHAR(150) NOT NULL,
    UNIQUE (idCliente, correo),
    FOREIGN KEY (idCliente)
        REFERENCES Cliente(idCliente)
        ON DELETE CASCADE
);



CREATE TABLE Almacenes (
    idAlmacen INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codigo VARCHAR(30) UNIQUE,
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    responsable VARCHAR(100),
    codigoPostal VARCHAR(20),
    pais VARCHAR(100),
    capacidad INT,
    idEstadoAlmacen INT NOT NULL DEFAULT 1,
    FOREIGN KEY (idEstadoAlmacen)
        REFERENCES EstadoAlmacen(idEstadoAlmacen)
);


CREATE TABLE AlmacenTelefono (
    idAlmacenTelefono INT AUTO_INCREMENT PRIMARY KEY,
    idAlmacen INT NOT NULL,
    telefono VARCHAR(30) NOT NULL,
    UNIQUE (idAlmacen, telefono),
    FOREIGN KEY (idAlmacen)
        REFERENCES Almacenes(idAlmacen)
        ON DELETE CASCADE
);


CREATE TABLE AlmacenCorreo (
    idAlmacenCorreo INT AUTO_INCREMENT PRIMARY KEY,
    idAlmacen INT NOT NULL,
    correo VARCHAR(150) NOT NULL,
    UNIQUE (idAlmacen, correo),
    FOREIGN KEY (idAlmacen)
        REFERENCES Almacenes(idAlmacen)
        ON DELETE CASCADE
);




CREATE TABLE Inventario (
    idInventario INT AUTO_INCREMENT PRIMARY KEY,
    idProducto INT NOT NULL,
    idAlmacen INT NOT NULL,
    ubicacionAlmacen VARCHAR(100),
    cantidadDisponible INT NOT NULL DEFAULT 0,
    stockMinimo INT NOT NULL DEFAULT 0,
    fechaUltimaActualizacion TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (idProducto, idAlmacen),
    FOREIGN KEY (idProducto)
        REFERENCES Producto(idProducto),
    FOREIGN KEY (idAlmacen)
        REFERENCES Almacenes(idAlmacen)
);


CREATE TABLE Pedido (
    idPedido INT AUTO_INCREMENT PRIMARY KEY,
    idCliente INT NOT NULL,
    direccionEntrega VARCHAR(255) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    impuesto DECIMAL(10,2) NOT NULL DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    fechaPedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    idEstadoPedido INT NOT NULL DEFAULT 1,
    FOREIGN KEY (idCliente)
        REFERENCES Cliente(idCliente),
    FOREIGN KEY (idEstadoPedido)
        REFERENCES EstadoPedido(idEstadoPedido)
);



CREATE TABLE DetallePedido (
    idPedido INT NOT NULL,
    idProducto INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    precioUnitario DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (idPedido, idProducto),
    FOREIGN KEY (idPedido)
        REFERENCES Pedido(idPedido)
        ON DELETE CASCADE,
    FOREIGN KEY (idProducto)
        REFERENCES Producto(idProducto)
);




CREATE TABLE MetodoPago (
    idMetodoPago INT AUTO_INCREMENT PRIMARY KEY,
    idCliente INT NOT NULL,
    titular VARCHAR(150),
    tipoPago ENUM(
        'paypal',
        'tarjeta',
        'transferencia'
    ) NOT NULL,
    fechaVencimiento DATE,
    FOREIGN KEY (idCliente)
        REFERENCES Cliente(idCliente)
);


CREATE TABLE Pago (
    idPago INT AUTO_INCREMENT PRIMARY KEY,
    idPedido INT NOT NULL,
    idCliente INT NOT NULL,
    idMetodoPago INT,
    fechaPago DATETIME DEFAULT CURRENT_TIMESTAMP,
    monto DECIMAL(10,2) NOT NULL,
    referenciaTransaccion VARCHAR(150),
    idEstadoPago INT NOT NULL DEFAULT 1,
    FOREIGN KEY (idPedido)
        REFERENCES Pedido(idPedido),
    FOREIGN KEY (idCliente)
        REFERENCES Cliente(idCliente),
    FOREIGN KEY (idMetodoPago)
        REFERENCES MetodoPago(idMetodoPago),
    FOREIGN KEY (idEstadoPago)
        REFERENCES EstadoPago(idEstadoPago)
);




CREATE TABLE Devoluciones (
    idDevolucion INT AUTO_INCREMENT PRIMARY KEY,
    idPedido INT NOT NULL,
    motivo TEXT,
    fechaSolicitud DATETIME DEFAULT CURRENT_TIMESTAMP,
    montoReembolso DECIMAL(10,2),
    idEstadoDevolucion INT NOT NULL DEFAULT 1,
    FOREIGN KEY (idPedido)
        REFERENCES Pedido(idPedido),
    FOREIGN KEY (idEstadoDevolucion)
        REFERENCES EstadoDevolucion(idEstadoDevolucion)
);



CREATE TABLE CarritoCompra (
    idCarritoCompra INT AUTO_INCREMENT PRIMARY KEY,
    idCliente INT NOT NULL,
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    idEstadoCarritoCompra INT NOT NULL DEFAULT 1,
    FOREIGN KEY (idCliente)
        REFERENCES Cliente(idCliente),
    FOREIGN KEY (idEstadoCarritoCompra)
        REFERENCES EstadoCarritoCompra(idEstadoCarritoCompra)
);


-- Relacion "Agregar": CarritoCompra <-> Producto (N:M)
CREATE TABLE DetalleCarrito (
    idCarritoCompra INT NOT NULL,
    idProducto INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    PRIMARY KEY (idCarritoCompra, idProducto),
    FOREIGN KEY (idCarritoCompra)
        REFERENCES CarritoCompra(idCarritoCompra)
        ON DELETE CASCADE,
    FOREIGN KEY (idProducto)
        REFERENCES Producto(idProducto)
);


-- =====================================================
-- ENVIO (relacion 1:1 con Pedido)
-- =====================================================

CREATE TABLE Envio (
    idEnvio INT AUTO_INCREMENT PRIMARY KEY,
    idPedido INT NOT NULL UNIQUE,
    empresaTransportista VARCHAR(100),
    numeroGuia VARCHAR(100),
    fechaEnvio DATETIME,
    fechaEntregaEstimada DATETIME,
    costoEnvio DECIMAL(10,2) NOT NULL DEFAULT 0,
    idEstadoEnvio INT NOT NULL DEFAULT 1,
    FOREIGN KEY (idPedido)
        REFERENCES Pedido(idPedido),
    FOREIGN KEY (idEstadoEnvio)
        REFERENCES EstadoEnvio(idEstadoEnvio)
);
