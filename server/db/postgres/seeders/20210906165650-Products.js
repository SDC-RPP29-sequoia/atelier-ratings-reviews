'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'product',
    [
      { // 2 reviews
        product_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // 5 reviews
        product_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // Has no reviews
        product_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // Contains reported review, review with photos, review with characteristics ratings
        product_id: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // For reported review test
        product_id: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // For helpfulness review test
        product_id: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // 7 reviews - has more reviews than fit on one default page (+5)
        product_id: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // For adding a review
        product_id: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // For reporting reviews
        product_id: 9,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // For no characteristics
        product_id: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // For no ratings or recommendations
        product_id: 11,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // For metadata updates from adding review
        product_id: 12,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('product', null, {}),
};
