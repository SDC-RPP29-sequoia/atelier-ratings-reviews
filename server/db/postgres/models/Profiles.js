module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    username: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    tableName: 'profile',
    indexes: [{
      unique: true,
      fields: ['username']
    }]
  });
  Profile.associate = function(models) {
    Profile.hasMany(models.Review, {
      foreignKey: 'profile_id',
      as: 'reviews',
      onDelete: 'CASCADE',
    });
  };
  return Profile;
};
