const { DataTypes } = require('sequelize');

const Product = sequelize.define('Product', {
  product_id_external: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'product'
});
module.exports.Product = Product;
