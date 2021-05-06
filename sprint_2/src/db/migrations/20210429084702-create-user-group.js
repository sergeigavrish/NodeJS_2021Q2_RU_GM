'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserGroup', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      },
      group_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Groups',
          key: 'id',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserGroup');
  }
};