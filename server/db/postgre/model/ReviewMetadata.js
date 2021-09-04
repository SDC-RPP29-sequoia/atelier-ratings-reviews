const { DataTypes } = require('sequelize');

const ReviewMetadata = sequelize.define('ReviewMetadata', {
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'review_meta_data'
});
module.exports.ReviewMetadata = ReviewMetadata;