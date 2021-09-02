const { DataTypes } = require('sequelize');

const ReviewMetadataRating = sequelize.define('ReviewMetadataRating', {
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
  tableName: 'review_meta_data_rating'
});
module.exports.ReviewMetadataRating = ReviewMetadataRating;