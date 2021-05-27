'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Groups', [
      {
        id: '5a3f029c-c88b-419a-b440-4dc64379c9c9',
        name: 'First',
        permissions: 'READ,WRITE'
      },
      {
        id: 'acb8ee5a-4308-4a62-b232-ebe224784c84',
        name: 'Second',
        permissions: 'DELETE'
      },
      {
        id: '661651eb-646a-410f-9e99-29127e1cb710',
        name: 'Third',
        permissions: 'SHARE,UPLOAD_FILES'
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Groups', null, {});
  }
};
