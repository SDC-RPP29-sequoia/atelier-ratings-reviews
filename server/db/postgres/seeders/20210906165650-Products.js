'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'product',
    [
      {
        product_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_id: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('product', null, {}),
};
