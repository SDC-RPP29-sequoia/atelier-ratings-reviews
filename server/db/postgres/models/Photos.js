module.exports = (sequelize, DataTypes) => {
  const Photo = sequelize.define('Photo', {
    photo_id: DataTypes.INTEGER, // allowNull: false
    url: DataTypes.STRING, // allowNull: false
  }, {
    tableName: 'photo',
    indexes: [{
      unique: true,
      name: 'idx_photo_photo_id',
      fields: ['photo_id']
    }]
  });
  Photo.associate = function(models) {
    Photo.belongsToMany(models.Review, {
      through: models.ReviewToPhoto,
      foreignKey: 'photo_id'
    });
    Photo.hasMany(models.ReviewToPhoto, {
      foreignKey: 'photo_id',
      as: 'reviews',
      onDelete: 'CASCADE',
    });
  };
  return Photo;
};