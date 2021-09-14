module.exports = (sequelize, DataTypes) => {
  const Recommended = sequelize.define('Recommended', {
    true: DataTypes.INTEGER,
    false: DataTypes.INTEGER
  }, {
    tableName: 'recommended'
  });
  Recommended.associate = function(models) {
    Recommended.hasOne(models.ReviewMetadata, {
      foreignKey: 'recommended_id',
      as: 'recommended',
      onDelete: 'CASCADE',
    });
  };
  return Recommended;
};