const { DataTypes } = require('sequelize');

const Characteristic = sequelize.define('Characteristic', {
  characteristic_id_external: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rating: {
    type: DataTypes.SMALLINT,
  }
}, {
  tableName: 'characteristic'
});
module.exports.Characteristic = Characteristic;