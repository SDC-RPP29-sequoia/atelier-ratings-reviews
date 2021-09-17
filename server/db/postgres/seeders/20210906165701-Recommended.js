'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'recommended',
    [
      {
        true: 1,
        false: 1
      },
      {
        true: 3,
        false: 2
      },
      {
        true: 2,
        false: 1
      },
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('recommended', null, {}),
};
