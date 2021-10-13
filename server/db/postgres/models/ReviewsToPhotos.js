module.exports = (sequelize, DataTypes) => {
  const ReviewToPhoto = sequelize.define('ReviewToPhoto', {
    photo_id: DataTypes.INTEGER, // allowNull: false
    review_id: DataTypes.INTEGER, // allowNull: false
  }, {
    tableName: 'review_to_photo',
    indexes: [{
      unique: true,
      name: 'idx_review_to_photo_review_id',
      fields: ['review_id']
    }, {
      unique: true,
      name: 'idx_review_to_photo_photo_id',
      fields: ['photo_id']
    }]
  });
  ReviewToPhoto.associate = function(models) {
    ReviewToPhoto.belongsTo(models.Photo, {
      foreignKey: 'photo_id',
      as: 'photos'
    });
    ReviewToPhoto.belongsTo(models.Review, {
      foreignKey: 'review_id',
      as: 'reviews'
    });
  };
  return ReviewToPhoto;
};