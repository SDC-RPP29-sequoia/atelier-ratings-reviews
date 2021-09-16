'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('rating', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      star_0: { type: Sequelize.INTEGER },
      star_1: { type: Sequelize.INTEGER },
      star_2: { type: Sequelize.INTEGER },
      star_3: { type: Sequelize.INTEGER },
      star_4: { type: Sequelize.INTEGER },
      star_5: { type: Sequelize.INTEGER },
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
    await queryInterface.dropTable('rating');
  }
};
