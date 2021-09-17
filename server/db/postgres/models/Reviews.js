module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    review_id: DataTypes.INTEGER, // allowNull: false
    product_id: DataTypes.INTEGER, // allowNull: false
    profile_id: DataTypes.INTEGER, // allowNull: false
    rating: DataTypes.INTEGER, // allowNull: false
    summary: DataTypes.STRING, // allowNull: false
    recommend: DataTypes.BOOLEAN, // allowNull: false
    body: DataTypes.TEXT, // allowNull: false
    response: DataTypes.STRING,
    date: DataTypes.DATE,
    helpfulness: DataTypes.INTEGER,
    reported: DataTypes.BOOLEAN,
  }, {
    tableName: 'review'
  });
  Review.associate = function(models) {
    Review.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    });
    Review.belongsTo(models.Profile, {
      foreignKey: 'profile_id',
      as: 'user'
    });

    Review.belongsToMany(models.Characteristic, {
      through: models.ReviewToCharacteristic,
      foreignKey: 'review_id'
    });
    Review.hasMany(models.ReviewToCharacteristic, {
      foreignKey: 'review_id',
      as: 'characteristics',
      onDelete: 'CASCADE',
    });

    Review.belongsToMany(models.Photo, {
        through: models.ReviewToPhoto,
        foreignKey: 'review_id'
    });
    Review.hasMany(models.ReviewToPhoto, {
      foreignKey: 'review_id',
      as: 'photos',
      onDelete: 'CASCADE',
    });
  };
  return Review;
};