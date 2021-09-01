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

const Characteristic = sequelize.define('Characteristic', {
  value: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'characteristic'
});
module.exports.Characteristic = Characteristic;

// ==== Table Relations ====
Characteristic.hasOne(CharacteristicName);
CharacteristicName.belongsTo(Characteristic);