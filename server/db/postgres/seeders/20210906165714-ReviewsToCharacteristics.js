'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'review_to_characteristic',
    [
      {
        review_id: 1,
        characteristic_id: 2,
        rating: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        review_id: 1,
        characteristic_id: 3,
        rating: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        review_id: 2,
        characteristic_id: 2,
        rating: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        review_id: 3,
        characteristic_id: 5,
        rating: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        review_id: 4,
        characteristic_id: 5,
        rating: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        review_id: 5,
        characteristic_id: 5,
        rating: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        review_id: 6,
        characteristic_id: 5,
        rating: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        review_id: 7,
        characteristic_id: 5,
        rating: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        review_id: 8,
        characteristic_id: 10,
        rating: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        review_id: 8,
        characteristic_id: 11,
        rating: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        review_id: 8,
        characteristic_id: 13,
        rating: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        review_id: 9,
        characteristic_id: 11,
        rating: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        review_id: 9,
        characteristic_id: 12,
        rating: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        review_id: 9,
        characteristic_id: 13,
        rating: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        review_id: 10,
        characteristic_id: 10,
        rating: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        review_id: 10,
        characteristic_id: 11,
        rating: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        review_id: 10,
        characteristic_id: 12,
        rating: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        review_id: 10,
        characteristic_id: 13,
        rating: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('review_to_characteristic', null, {}),
};
