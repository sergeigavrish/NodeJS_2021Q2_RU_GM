'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addIndex('Users', ['login'], {
      name: 'IX_login',
      unique: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeIndex('Users', 'IX_login');
  }
};
