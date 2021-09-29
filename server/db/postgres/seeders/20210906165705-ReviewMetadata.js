'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'review_metadata',
    [
      { // 1
        product_id: 1,
        rating_id: 1,
        recommended_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // 2
        product_id: 2,
        rating_id: 2,
        recommended_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // 3 - No recommendation ratings, no star ratings
        product_id: 3,
        rating_id: null,
        recommended_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // 4
        product_id: 4,
        rating_id: 3,
        recommended_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_id: 5,
        rating_id: null,
        recommended_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_id: 6,
        rating_id: null,
        recommended_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_id: 7,
        rating_id: null,
        recommended_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_id: 8,
        rating_id: null,
        recommended_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // For reporting reviews
        product_id: 9,
        rating_id: 12,
        recommended_id: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // For no characteristics
        product_id: 10,
        rating_id: 14,
        recommended_id: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // For no ratings or recommendations
        product_id: 11,
        rating_id: null,
        recommended_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // For metadata updates from adding review
        product_id: 12,
        rating_id: 15,
        recommended_id: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('review_metadata', null, {}),
};
