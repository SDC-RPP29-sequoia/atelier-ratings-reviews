'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'profile',
    [
      {
        username: 'Jane Doe',
        email: 'janedoe@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'Jon Doe',
        email: 'jondoe@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'Foo Bar',
        email: 'foo@bar.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'funtime',
        email: 'first.last@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'mymainstreammother',
        email: 'first.last@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'bigbrotherbenjamin',
        email: 'first.last@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'fashionperson',
        email: 'first.last@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'shortandsweeet',
        email: 'first.last@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'negativity',
        email: 'first.last@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'anyone',
        email: 'first.last@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'shopaddict',
        email: 'first.last@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'figuringitout',
        email: 'first.last@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'bigbrother',
        email: 'first.last@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('profile', null, {}),
};
