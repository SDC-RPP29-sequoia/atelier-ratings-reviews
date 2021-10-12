module.exports = (sequelize, DataTypes) => {
  const ReviewMetadata = sequelize.define('ReviewMetadata', {
    product_id: DataTypes.INTEGER, // allowNull: false
    rating_id: DataTypes.INTEGER,
    recommended_id: DataTypes.INTEGER,
  }, {
    tableName: 'review_metadata',
    indexes: [{
      unique: true,
      fields: [
        'product_id',
        'rating_id',
        'recommended_id',
      ]
    }]
  });
  ReviewMetadata.associate = function(models) {
    ReviewMetadata.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    });
    ReviewMetadata.belongsTo(models.Rating, {
      foreignKey: 'rating_id',
      as: 'rating'
    });
    ReviewMetadata.belongsTo(models.Recommended, {
      foreignKey: 'recommended_id',
      as: 'recommended'
    });

    ReviewMetadata.hasMany(models.Characteristic, {
      foreignKey: 'review_metadata_id',
      as: 'characteristics',
      onDelete: 'CASCADE',
    });
  };
  return ReviewMetadata;
};