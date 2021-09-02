const { DataTypes } = require('sequelize');

const Characteristic = sequelize.define('Characteristic', {
  value: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'characteristic'
});
module.exports.Characteristic = Characteristic;