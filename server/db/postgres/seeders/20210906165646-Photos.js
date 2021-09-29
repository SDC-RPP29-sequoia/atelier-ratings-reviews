'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'photo',
    [
      {
        photo_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        url: 'https://images.unsplash.com/photo-1560570803-7474c0f9af99?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80'
      },
      {
        photo_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        url: 'https://images.unsplash.com/photo-1561693532-9ff59442a7db?ixlib=rb-1.2.1&auto=format&fit=crop&w=975&q=80'
      },
      {
        photo_id: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
        url: 'https://images.unsplash.com/photo-1487349384428-12b47aca925e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80'
      },
      {
        photo_id: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
        url: 'https://images.unsplash.com/photo-1542574621-e088a4464f7e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3028&q=80'
      },
      {
        photo_id: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
        url: 'https://images.unsplash.com/photo-1560294559-1774a164fb0a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80'
      },
      {
        photo_id: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
        url: 'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80'
      },
      {
        photo_id: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
        url: 'https://images.unsplash.com/photo-1549812474-c3cbd9a42eb9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80'
      },
      {
        photo_id: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
        url: 'https://images.unsplash.com/photo-1560829675-11dec1d78930?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1652&q=80'
      },
      {
        photo_id: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
        url: 'https://images.unsplash.com/photo-1559709319-3ae960cda614?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80'
      },
      {
        photo_id: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
        url: 'https://images.unsplash.com/photo-1519689373023-dd07c7988603?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80'
      }
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('photo', null, {}),
};
