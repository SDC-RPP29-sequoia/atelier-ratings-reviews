'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('characteristic', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      characteristic_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        unique: true
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      rating_id: {
        type: Sequelize.INTEGER
      },
      review_metadata_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('characteristic');
  }
};
