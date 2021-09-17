module.exports = (mongoose) => {
  const ratings = require('./Ratings.js')(mongoose);

  // console.log('Schema:', ratings.schema);
  // console.log('Model:', ratings.model);
  // console.log('Name:', ratings.name);
  const characteristics = {};

  characteristics.schema = mongoose.Schema({
    characteristic_id: { type: Number, required: true },
    name: { type: String, required: true },
    rating: { type: Number },
    ratings: { type: ratings.schema }
  });

  const modelName = 'Characteristic';
  characteristics.model = mongoose.models[modelName] || mongoose.model(modelName, characteristics.schema);

  return characteristics;
};