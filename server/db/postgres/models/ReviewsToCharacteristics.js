module.exports = (sequelize, DataTypes) => {
  const ReviewToCharacteristic = sequelize.define('ReviewToCharacteristic', {
    characteristic_id: DataTypes.INTEGER, // allowNull: false
    review_id: DataTypes.INTEGER, // allowNull: false
    rating: DataTypes.INTEGER, // allowNull: false
  }, {
    tableName: 'review_to_characteristic',
    indexes: [{
      unique: true,
      name: 'idx_review_to_characteristic_review_id',
      fields: ['review_id']
    }, {
      unique: true,
      name: 'idx_review_to_characteristic_characteristic_id',
      fields: ['characteristic_id']
    }]
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