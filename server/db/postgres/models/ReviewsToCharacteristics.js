module.exports = (sequelize, DataTypes) => {
  const ReviewToCharacteristic = sequelize.define('ReviewToCharacteristic', {
    characteristic_id: DataTypes.INTEGER, // allowNull: false
    review_id: DataTypes.INTEGER, // allowNull: false
    rating: DataTypes.INTEGER, // allowNull: false
  }, {
    tableName: 'review_to_characteristic'
  });
  ReviewToCharacteristic.associate = function(models) {
    ReviewToCharacteristic.belongsTo(models.Review, {
      foreignKey: 'review_id',
      as: 'reviews'
    });
    ReviewToCharacteristic.belongsTo(models.Characteristic, {
      foreignKey: 'characteristic_id',
      as: 'characteristics'
    });
  };
  return ReviewToCharacteristic;
};