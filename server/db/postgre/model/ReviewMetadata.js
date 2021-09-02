const { DataTypes } = require('sequelize');

const ReviewMetadata = sequelize.define('ReviewMetadata', {
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  count: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ratings: {
    type: DataTypes.STRING,
    allowNull: false
  },
  recommended: {
    type: DataTypes.BOOLEAN
  },
  characteristics: {
    // TODO: THIS IS TBD! Just a placeholder
    type: DataTypes.STRING
  }
}, {
  tableName: 'review_meta_data'
});
module.exports.ReviewMetadata = ReviewMetadata;