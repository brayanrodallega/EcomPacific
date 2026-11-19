'use strict';

const PRODUCTOS_DEMO = [
  {
    id: 1,
    nombre: 'Teclado Mecánico RGB',
    descripcion:
      'Teclado switches red con iluminación RGB personalizable y cable extraíble',
    precio: 240000,
    imagenUrl:
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
    marca: 'EcomPacific',
    idCategoria: 1,
    activo: true,
    stock: 15,
  },
  {
    id: 2,
    nombre: 'Producto Inactivo Oculto',
    descripcion: 'Este producto no debe ser visible por clientes',
    precio: 50000,
    imagenUrl:
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46',
    marca: 'EcomPacific',
    idCategoria: 1,
    activo: false,
    stock: 10,
  },
  {
    id: 3,
    nombre: 'Producto Agotado',
    descripcion: 'Producto activo pero sin existencias',
    precio: 99000,
    imagenUrl:
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46',
    marca: 'EcomPacific',
    idCategoria: 1,
    activo: true,
    stock: 0,
  },
  {
    id: 4,
    nombre: 'Laptop Gaming',
    descripcion: 'Laptop para gaming de alto rendimiento',
    precio: 2500000,
    imagenUrl: 'https://ejemplo.com/imagen.jpg',
    marca: 'EcomPacific',
    idCategoria: 1,
    activo: true,
    stock: 10,
  },
];

module.exports = {
  async up(queryInterface) {
    const [productosExistentes] = await queryInterface.sequelize.query(
      'SELECT COUNT(*) AS total FROM producto WHERE idProducto IN (1, 2, 3, 4)',
    );

    if (Number(productosExistentes[0].total) > 0) {
      return;
    }

    const [categoriasExistentes] = await queryInterface.sequelize.query(
      'SELECT COUNT(*) AS total FROM categorias WHERE id = 1',
    );

    if (Number(categoriasExistentes[0].total) === 0) {
      await queryInterface.bulkInsert('categorias', [
        {
          id: 1,
          nombre: 'Tecnología',
          descripcion: 'Artículos de tecnología y periféricos',
          creado_en: new Date(),
          actualizado_en: new Date(),
        },
      ]);
    }

    await queryInterface.bulkInsert(
      'producto',
      PRODUCTOS_DEMO.map((producto) => ({
        idProducto: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        imagenUrl: producto.imagenUrl,
        marca: producto.marca,
        idCategoria: producto.idCategoria,
        activo: producto.activo,
      })),
    );

    await queryInterface.bulkInsert(
      'inventario',
      PRODUCTOS_DEMO.map((producto) => ({
        idProducto: producto.id,
        idAlmacen: 1,
        ubicacionAlmacen: 'Almacén principal',
        cantidadDisponible: producto.stock,
        stockMinimo: 5,
      })),
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('inventario', {
      idProducto: [1, 2, 3, 4],
    });
    await queryInterface.bulkDelete('producto', {
      idProducto: [1, 2, 3, 4],
    });
  },
};
