'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'product',
    [
      {
        product_id: 1
      },
      {
        product_id: 2
      },
      {
        product_id: 3
      },
      {
        product_id: 4
      },
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('product', null, {}),
};
