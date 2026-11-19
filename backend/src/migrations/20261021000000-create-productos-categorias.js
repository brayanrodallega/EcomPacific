'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('categorias', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      creado_en: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      actualizado_en: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable('producto', {
      idProducto: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nombre: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      precio: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      imagenUrl: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      marca: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      idCategoria: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'categorias', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    });

    await queryInterface.createTable('inventario', {
      idInventario: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      idProducto: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'producto', key: 'idProducto' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      idAlmacen: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ubicacionAlmacen: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      cantidadDisponible: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      stockMinimo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('inventario');
    await queryInterface.dropTable('producto');
    await queryInterface.dropTable('categorias');
  },
};
