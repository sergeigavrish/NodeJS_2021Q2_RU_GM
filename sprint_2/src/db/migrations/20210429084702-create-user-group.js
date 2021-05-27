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
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      group_id: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'Groups',
          key: 'id'
        }
      }
    })
    await queryInterface.addConstraint('UserGroup', {
      fields: ['user_id', 'group_id'],
      type: 'unique'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserGroup');
  }
};