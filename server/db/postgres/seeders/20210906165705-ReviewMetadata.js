'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'review_metadata',
    [
      {
        product_id: 1,
        rating_id: 1,
        recommended_id: 1
      },
      {
        product_id: 2,
        rating_id: 2,
        recommended_id: 2
      },
      {
        product_id: 3,
        rating_id: null,
        recommended_id: null
      },
      {
        product_id: 4,
        rating_id: 3,
        recommended_id: 3
      }
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('review_metadata', null, {}),
};
