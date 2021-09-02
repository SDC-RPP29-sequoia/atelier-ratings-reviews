const { DataTypes } = require('sequelize');

const Profile = sequelize.define('Profile', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'profile'
});
module.exports.Profile = Profile;
