'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'recommended',
    [
      { // 1
        true: 1,
        false: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {  // 2
        true: 3,
        false: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {  // 3
        true: 2,
        false: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // 4 - for reported reviews
        true: 2,
        false: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // 5 - for no product characteristics
        true: 3,
        false: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // 6 - for metadata updates from adding review
        true: 1,
        false: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('recommended', null, {}),
};
