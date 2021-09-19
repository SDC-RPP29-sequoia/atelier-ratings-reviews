'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'recommended',
    [
      {
        true: 1,
        false: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        true: 3,
        false: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        true: 2,
        false: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('recommended', null, {}),
};
