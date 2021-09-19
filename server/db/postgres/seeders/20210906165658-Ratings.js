'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'rating',
    [
      {
        star_0: null,
        star_1: null,
        star_2: null,
        star_3: null,
        star_4: 1,
        star_5: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        star_0: null,
        star_1: null,
        star_2: 1,
        star_3: 1,
        star_4: 2,
        star_5: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        star_0: null,
        star_1: null,
        star_2: 1,
        star_3: null,
        star_4: 1,
        star_5: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        star_0: null,
        star_1: 1,
        star_2: null,
        star_3: null,
        star_4: 1,
        star_5: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        star_0: null,
        star_1: null,
        star_2: null,
        star_3: null,
        star_4: null,
        star_5: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        star_0: null,
        star_1: null,
        star_2: 2,
        star_3: 3,
        star_4: null,
        star_5: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        star_0: null,
        star_1: null,
        star_2: null,
        star_3: null,
        star_4: null,
        star_5: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        star_0: null,
        star_1: 1,
        star_2: 1,
        star_3: 1,
        star_4: null,
        star_5: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        star_0: null,
        star_1: null,
        star_2: 1,
        star_3: 1,
        star_4: null,
        star_5: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        star_0: null,
        star_1: 2,
        star_2: 1,
        star_3: null,
        star_4: null,
        star_5: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('rating', null, {}),
};
