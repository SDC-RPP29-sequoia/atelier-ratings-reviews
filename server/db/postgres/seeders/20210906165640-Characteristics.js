'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'characteristic',
    [
      {
        characteristic_id: 1,
        name: "Fit",
        rating_id: null,
        review_metadata_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        characteristic_id: 2,
        name: "Length",
        rating_id: 4,
        review_metadata_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        characteristic_id: 3,
        name: "Comfort",
        rating_id: 5,
        review_metadata_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        characteristic_id: 4,
        name: "Quality",
        rating_id: null,
        review_metadata_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        characteristic_id: 5,
        name: "Quality",
        rating_id: 6,
        review_metadata_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        characteristic_id: 6,
        name: "Fit",
        rating_id: null,
        review_metadata_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        characteristic_id: 7,
        name: "Length",
        rating_id: null,
        review_metadata_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        characteristic_id: 8,
        name: "Comfort",
        rating_id: null,
        review_metadata_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        characteristic_id: 9,
        name: "Quality",
        rating_id: null,
        review_metadata_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        characteristic_id: 10,
        name: "Fit",
        rating_id: 7,
        review_metadata_id: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        characteristic_id: 11,
        name: "Length",
        rating_id: 8,
        review_metadata_id: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        characteristic_id: 12,
        name: "Comfort",
        rating_id: 9,
        review_metadata_id: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        characteristic_id: 13,
        name: "Quality",
        rating_id: 10,
        review_metadata_id: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // For adding reviews, product 8, initially rated
        characteristic_id: 14,
        name: "Comfort",
        rating_id: 11,
        review_metadata_id: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // For adding reviews, product 8, initially unrated
        characteristic_id: 15,
        name: "Quality",
        rating_id: null,
        review_metadata_id: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // For reporting reviews
        characteristic_id: 16,
        name: "Length",
        rating_id: 17,
        review_metadata_id: 9,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // For adding reviews, product 12, metadata update
        characteristic_id: 17,
        name: "Comfort",
        rating_id: null,
        review_metadata_id: 12,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // For adding reviews, product 12, metadata update
        characteristic_id: 18,
        name: "Quality",
        rating_id: 16,
        review_metadata_id: 12,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('characteristic', null, {}),
};
