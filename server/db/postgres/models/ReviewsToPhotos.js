module.exports = (sequelize, DataTypes) => {
  const ReviewToPhoto = sequelize.define('ReviewToPhoto', {
    photo_id: DataTypes.INTEGER, // allowNull: false
    review_id: DataTypes.INTEGER, // allowNull: false
  }, {
    tableName: 'review_to_photo'
  });
  ReviewToPhoto.associate = function(models) {
    ReviewToPhoto.belongsTo(models.Photo, {
      foreignKey: 'photo_id',
      as: 'characteristics'
    });
    ReviewToPhoto.belongsTo(models.Review, {
      foreignKey: 'review_id',
      as: 'reviews'
    });
  };
  return ReviewToPhoto;
};