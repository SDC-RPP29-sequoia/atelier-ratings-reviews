module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    star_0: DataTypes.INTEGER,
    star_1: DataTypes.INTEGER,
    star_2: DataTypes.INTEGER,
    star_3: DataTypes.INTEGER,
    star_4: DataTypes.INTEGER,
    star_5: DataTypes.INTEGER,
  }, {
    tableName: 'rating'
  });
  Rating.associate = function(models) {
    Rating.hasOne(models.ReviewMetadata, {
      foreignKey: 'rating_id',
      as: 'reviewMetadata',
      onDelete: 'CASCADE',
    });
    Rating.hasOne(models.Characteristic, {
      foreignKey: 'rating_id',
      as: 'characteristics',
      onDelete: 'CASCADE',
    });
  };
  return Rating;
};