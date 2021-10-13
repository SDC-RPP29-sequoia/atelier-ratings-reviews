'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('review_metadata', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        unique: true
      },
      rating_id: {
        type: Sequelize.INTEGER,
        unique: true
      },
      recommended_id: {
        type: Sequelize.INTEGER,
        unique: true
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
    //           'product_id',
    //           'rating_id',
    //           'recommended_id',
    //         ]
    //     }
    //   }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('review_metadata');
  }
};
