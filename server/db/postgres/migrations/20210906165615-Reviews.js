'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('review', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      review_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        unique: true
      },
      rating: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      summary: {
        type: Sequelize.STRING
      },
      recommend:{
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      response: {
        type: Sequelize.STRING
      },
      body: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      helpfulness: {
        type: Sequelize.INTEGER
      },
      reported:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      product_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      profile_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE
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
    //         name: 'idx_review_review_id',
    //         fields: ['review_id']
    //     },
    //   }
    // }).then((queryInterface, Sequelize) => {
    //   queryInterface.addIndex(
    //     'review',
    //     ['review_id'],
    //     {
    //       name: 'idx_review_review_id',
    //       indicesType: 'UNIQUE',
    //       where: { bool : 'true' },
    //     }
    //   );
    });//;//.then(() => queryInterface.addConstraint('review', ['review_id'], {
    //   type: 'unique',
    //   name: 'idx_review_review_id'
    // }));
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('review');
  }
};
