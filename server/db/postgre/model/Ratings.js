const { DataTypes } = require('sequelize');

const Rating = sequelize.define('Rating', {
  star_0: {
    type: DataTypes.INTEGER
  },
  star_1: {
    type: DataTypes.INTEGER
  },
  star_2: {
    type: DataTypes.INTEGER
  },
  star_3: {
    type: DataTypes.INTEGER
  },
  star_4: {
    type: DataTypes.INTEGER
  },
  star_5: {
    type: DataTypes.INTEGER
  },
}, {
  tableName: 'rating'
});
module.exports.Rating = Rating;