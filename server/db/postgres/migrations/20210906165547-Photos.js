'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('photo', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      photo_id:  {
        allowNull: false,
        type: Sequelize.INTEGER,
        unique: true
      },
      url: {
        allowNull: false,
        type: Sequelize.STRING
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
    //         fields: ['photo_id']
    //     }
    //   }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('photo');
  }
};
