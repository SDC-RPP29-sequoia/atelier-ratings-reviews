module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    product_id: DataTypes.INTEGER, // allowNull: false
  }, {
    tableName: 'product',
    indexes: [{
      unique: true,
      fields: ['product_id']
    }]
  });
  Product.associate = function(models) {
    Product.hasMany(models.Review, {
      foreignKey: 'product_id',
      as: 'review',
      onDelete: 'CASCADE',
    });
    Product.hasOne(models.ReviewMetadata, {
      foreignKey: 'product_id',
      as: 'rewiewMetadata',
      onDelete: 'CASCADE',
    });
  };
  return Product;
};
