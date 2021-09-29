'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'profile',
    [
      { // 1
        username: 'Jane Doe',
        email: 'janedoe@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { // 2
        username: 'Jon Doe',
        email: 'jondoe@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { // 3
        username: 'Foo Bar',
        email: 'foo@bar.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { // 4
        username: 'funtime',
        email: 'first.last@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { // 5
        username: 'mymainstreammother',
        email: 'first.last@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { // 6
        username: 'bigbrotherbenjamin',
        email: 'first.last@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { // 7
        username: 'fashionperson',
        email: 'first.last@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { // 8
        username: 'shortandsweeet',
        email: 'first.last@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { // 9
        username: 'negativity',
        email: 'first.last@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { // 10
        username: 'anyone',
        email: 'first.last@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { // 11
        username: 'shopaddict',
        email: 'first.last@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { // 12
        username: 'figuringitout',
        email: 'first.last@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { // 13
        username: 'bigbrother',
        email: 'first.last@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { // 14 - For adding reviews
        username: 'reviewAdder1',
        email: 'foo.bar1@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { // 15 - For adding reviews
        username: 'reviewAdder2',
        email: 'foo.bar2@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { // 16 - For reporting reviews
        username: 'reviewAdder3',
        email: 'foo.bar2@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { // 17 - For reporting reviews
        username: 'reviewAdder4',
        email: 'foo.bar2@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('profile', null, {}),
};
