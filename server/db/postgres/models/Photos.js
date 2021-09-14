module.exports = (sequelize, DataTypes) => {
  const Photo = sequelize.define('Photo', {
    photo_id: DataTypes.INTEGER, // allowNull: false
    url: DataTypes.STRING, // allowNull: false
  }, {
    tableName: 'photo'
  });
  Photo.associate = function(models) {
    Photo.belongsToMany(models.Review, { through: models.ReviewToPhoto });
    Photo.hasMany(models.ReviewToPhoto, {
      foreignKey: 'photo_id',
      as: 'reviews',
      onDelete: 'CASCADE',
    });
  };
  return Photo;
};