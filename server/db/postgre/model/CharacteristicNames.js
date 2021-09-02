const { DataTypes } = require('sequelize');

const CharacteristicName = sequelize.define('CharacteristicName', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  characteristic_id_external: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'characteristic_name'
});
module.exports.CharacteristicName = CharacteristicName;