'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      rol: {
        type: Sequelize.ENUM('ADMIN', 'VENDEDOR', 'CLIENTE'),
        allowNull: false,
        defaultValue: 'CLIENTE',
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

    await queryInterface.createTable('carritos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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

    await queryInterface.createTable('carrito_items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      carrito_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'carritos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      producto_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'productos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
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

    await queryInterface.addConstraint('carrito_items', {
      fields: ['carrito_id', 'producto_id'],
      type: 'unique',
      name: 'unico_carrito_producto',
    });

    await queryInterface.createTable('ordenes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      estado: {
        type: Sequelize.ENUM('PENDIENTE', 'CONFIRMADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'),
        allowNull: false,
        defaultValue: 'PENDIENTE',
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

    await queryInterface.createTable('orden_items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      orden_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'ordenes', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      producto_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'productos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      precio: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
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

    await queryInterface.addConstraint('orden_items', {
      fields: ['orden_id', 'producto_id'],
      type: 'unique',
      name: 'unico_orden_producto',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orden_items');
    await queryInterface.dropTable('ordenes');
    await queryInterface.dropTable('carrito_items');
    await queryInterface.dropTable('carritos');
    await queryInterface.dropTable('productos');
    await queryInterface.dropTable('categorias');
    await queryInterface.dropTable('usuarios');
  },
};