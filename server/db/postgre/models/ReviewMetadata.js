const { DataTypes } = require('sequelize');

const ReviewMetaData = sequelize.define('ReviewMetaData', {
  ratings: {
    type: DataTypes.STRING,
    allowNull: false
  },
  recommended: {
    type: DataTypes.BOOLEAN
  },
  characteristics: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'review_meta_data'
});
module.exports.ReviewMetaData = ReviewMetaData;