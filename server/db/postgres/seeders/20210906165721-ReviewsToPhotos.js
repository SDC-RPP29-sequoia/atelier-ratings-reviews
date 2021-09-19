'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'review_to_photo',
    [
      {
        photo_id: 1,
        review_id: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        photo_id: 2,
        review_id: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        photo_id: 3,
        review_id: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        photo_id: 4,
        review_id: 9,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        photo_id: 5,
        review_id: 9,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        photo_id: 6,
        review_id: 9,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        photo_id: 7,
        review_id: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        photo_id: 8,
        review_id: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        photo_id: 9,
        review_id: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('review_to_photo', null, {}),
};
