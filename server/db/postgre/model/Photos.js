const { DataTypes } = require('sequelize');

const Photo = sequelize.define('Photo', {
  photo_id_external: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'photo'
});
module.exports.Photo = Photo;