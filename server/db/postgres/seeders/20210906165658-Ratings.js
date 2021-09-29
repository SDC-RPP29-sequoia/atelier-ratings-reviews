'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'rating',
    [
      { // 1
        star_0: null,
        star_1: null,
        star_2: null,
        star_3: null,
        star_4: 1,
        star_5: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // 2
        star_0: null,
        star_1: null,
        star_2: 1,
        star_3: 1,
        star_4: 2,
        star_5: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // 3
        star_0: null,
        star_1: null,
        star_2: 1,
        star_3: null,
        star_4: 1,
        star_5: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // 4
        star_0: null,
        star_1: 1,
        star_2: null,
        star_3: null,
        star_4: 1,
        star_5: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // 5
        star_0: null,
        star_1: null,
        star_2: null,
        star_3: null,
        star_4: null,
        star_5: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // 6
        star_0: null,
        star_1: null,
        star_2: 2,
        star_3: 3,
        star_4: null,
        star_5: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // 7
        star_0: null,
        star_1: null,
        star_2: null,
        star_3: null,
        star_4: null,
        star_5: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // 8
        star_0: null,
        star_1: 1,
        star_2: 1,
        star_3: 1,
        star_4: null,
        star_5: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // 9
        star_0: null,
        star_1: null,
        star_2: 1,
        star_3: 1,
        star_4: null,
        star_5: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // 10
        star_0: null,
        star_1: 2,
        star_2: 1,
        star_3: null,
        star_4: null,
        star_5: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // 11
        star_0: null,
        star_1: null,
        star_2: 1,
        star_3: 1,
        star_4: null,
        star_5: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // 12 - For reporting reviews - product
        star_0: null,
        star_1: null,
        star_2: 1,
        star_3: null,
        star_4: 1,
        star_5: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // 13 - For reporting reviews - characteristic
        star_0: null,
        star_1: null,
        star_2: 1,
        star_3: null,
        star_4: 1,
        star_5: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // 14 - For no product characteristics
        star_0: null,
        star_1: null,
        star_2: 5,
        star_3: null,
        star_4: 10,
        star_5: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // 15 - for metadata updates from adding review
        star_0: null,
        star_1: null,
        star_2: null,
        star_3: null,
        star_4: 3,
        star_5: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // 16 - characteristic for metadata updates from adding review
        star_0: null,
        star_1: null,
        star_2: 1,
        star_3: null,
        star_4: null,
        star_5: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // 17 - characteristic for metadata updates from removing review
        star_0: null,
        star_1: null,
        star_2: 1,
        star_3: null,
        star_4: 1,
        star_5: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('rating', null, {}),
};
