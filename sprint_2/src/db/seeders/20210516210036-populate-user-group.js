'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('UserGroup', [
      {
        user_id: '67385b45-6c5d-4af5-94e5-26c0ecfa4c5b',
        group_id: '5a3f029c-c88b-419a-b440-4dc64379c9c9'
      },
      {
        user_id: '67385b45-6c5d-4af5-94e5-26c0ecfa4c5b',
        group_id: 'acb8ee5a-4308-4a62-b232-ebe224784c84'
      },
      {
        user_id: '67385b45-6c5d-4af5-94e5-26c0ecfa4c5b',
        group_id: '661651eb-646a-410f-9e99-29127e1cb710'
      },
      {
        user_id: '2b8c1a16-a641-4abf-a198-4bd22f5459c2',
        group_id: '5a3f029c-c88b-419a-b440-4dc64379c9c9'
      },
      {
        user_id: '2b8c1a16-a641-4abf-a198-4bd22f5459c2',
        group_id: '661651eb-646a-410f-9e99-29127e1cb710'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('UserGroup', null, {});
  }
};
