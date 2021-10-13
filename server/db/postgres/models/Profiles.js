module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    username: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    tableName: 'profile',
    indexes: [{
      unique: true,
      name: 'idx_profile_username',
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
