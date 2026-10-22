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
      activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      intentos_login: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      ultimo_login_fallido: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      bloqueado_hasta: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      refresh_token: {
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('usuarios');
  },
};