const { DataTypes } = require('sequelize');

const Recommended = sequelize.define('Recommended', {
  true: { type: DataTypes.INTEGER },
  false: { type: DataTypes.INTEGER }
}, {tableName: 'recommended'}
);

module.exports.Recommended = Recommended;