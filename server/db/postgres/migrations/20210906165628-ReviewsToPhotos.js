'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('review_to_photo', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      photo_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        unique: 'compositeIndex'
      },
      review_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        unique: 'compositeIndex'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    // }, {
    //   uniqueKeys: {
    //     unique_tag: {
    //         customIndex: true,
    //         fields: [
    //           'review_id',
    //           'photo_id'
    //         ]
    //     }
    //   }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('review_to_photo');
  }
};
