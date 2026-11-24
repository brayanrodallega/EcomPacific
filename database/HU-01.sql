-- HU-01: Datos de prueba para consultar el catálogo de productos
--
-- Requisito: haber ejecutado antes eccomercePacific.sql
-- Cómo cargarlo:
--   1. mysql -u root -p < eccomercePacific.sql
--   2. mysql -u root -p < HU-01_datos_prueba_catalogo.sql
-- Ejecutar una sola vez. Para repetir la prueba usar la sección de limpieza
-- del final o recrear la base de datos.
--
-- Resultado esperado en el catálogo:
--   Producto activo con stock -> aparece
--   Producto activo sin stock -> no aparece (o "agotado", según la HU)
--   Producto inactivo         -> no aparece

USE e_commercePacific;

-- 1. Estados y categoría de prueba
SET @estadoActivo   = (SELECT idEstadoProducto FROM EstadoProducto WHERE nombre = 'activo');
SET @estadoInactivo = (SELECT idEstadoProducto FROM EstadoProducto WHERE nombre = 'inactivo');

INSERT INTO Categorias (nombre, descripcion)
VALUES ('Categoría de prueba', 'Categoría usada para verificar el catálogo');
SET @idCategoria = LAST_INSERT_ID();

-- 2. Tres productos con nombre, precio e imagen
INSERT INTO Producto (imagenUrl, precio, nombre, descripcion, marca, idCategoria, idEstadoProducto)
VALUES ('https://placehold.co/600x600?text=Activo+con+stock', 19.99,
        'Producto activo con stock', 'Debe aparecer en el catálogo', 'Pacific', @idCategoria, @estadoActivo);
SET @idProdActivoStock = LAST_INSERT_ID();

INSERT INTO Producto (imagenUrl, precio, nombre, descripcion, marca, idCategoria, idEstadoProducto)
VALUES ('https://placehold.co/600x600?text=Activo+sin+stock', 29.99,
        'Producto activo sin stock', 'Activo pero agotado', 'Pacific', @idCategoria, @estadoActivo);
SET @idProdActivoSinStock = LAST_INSERT_ID();

INSERT INTO Producto (imagenUrl, precio, nombre, descripcion, marca, idCategoria, idEstadoProducto)
VALUES ('https://placehold.co/600x600?text=Inactivo', 39.99,
        'Producto inactivo', 'No debe aparecer en el catálogo', 'Pacific', @idCategoria, @estadoInactivo);
SET @idProdInactivo = LAST_INSERT_ID();

-- 3. Almacén de prueba (estado de almacén 1 = activo) e inventario
INSERT INTO Almacenes (nombre, codigo, ciudad, pais, capacidad, idEstadoAlmacen)
VALUES ('Almacén de prueba', 'ALM-TEST', 'Ciudad de prueba', 'País de prueba', 1000, 1);
SET @idAlmacen = LAST_INSERT_ID();

INSERT INTO Inventario (idProducto, idAlmacen, ubicacionAlmacen, cantidadDisponible, stockMinimo)
VALUES (@idProdActivoStock,    @idAlmacen, 'A-01', 25, 5),
       (@idProdActivoSinStock, @idAlmacen, 'A-02',  0, 5),
       (@idProdInactivo,       @idAlmacen, 'A-03', 10, 5);

-- 4. Verificación: debe devolver solo "Producto activo con stock"
SELECT p.idProducto, p.nombre, p.precio, p.imagenUrl,
       c.nombre AS categoria,
       ep.nombre AS estado,
       COALESCE(SUM(i.cantidadDisponible), 0) AS stock
FROM Producto p
JOIN Categorias c ON c.idCategoria = p.idCategoria
JOIN EstadoProducto ep ON ep.idEstadoProducto = p.idEstadoProducto
LEFT JOIN Inventario i ON i.idProducto = p.idProducto
WHERE ep.nombre = 'activo'
GROUP BY p.idProducto, p.nombre, p.precio, p.imagenUrl, c.nombre, ep.nombre
HAVING stock > 0;

-- 5. Limpieza (opcional, descomentar para repetir la prueba)
-- DELETE FROM Inventario WHERE idAlmacen IN (SELECT idAlmacen FROM Almacenes WHERE codigo = 'ALM-TEST');
-- DELETE FROM Producto   WHERE idCategoria IN (SELECT idCategoria FROM Categorias WHERE nombre = 'Categoría de prueba');
-- DELETE FROM Almacenes  WHERE codigo = 'ALM-TEST';
-- DELETE FROM Categorias WHERE nombre = 'Categoría de prueba';
