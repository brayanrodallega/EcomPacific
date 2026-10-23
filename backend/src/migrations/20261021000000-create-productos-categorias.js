'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Primero crear categorias (referenciada)
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

    // 2. Luego productos (referencia a categorias)
    await queryInterface.createTable('productos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nombre: {
        type: Sequelize.STRING(255),
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
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      imagen_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      categoria_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'categorias', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
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
  },

  async down(queryInterface, Sequelize) {
    // Borrar en orden inverso (primero productos, luego categorias)
    await queryInterface.dropTable('productos');
    await queryInterface.dropTable('categorias');
  },
};