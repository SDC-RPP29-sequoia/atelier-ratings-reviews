module.exports = (mongoose) => {
  const ratings = {};

  ratings.schema = mongoose.Schema({
    0: { type: Number },
    1: { type: Number },
    2: { type: Number },
    3: { type: Number },
    4: { type: Number },
    5: { type: Number },
  });

  const modelName = 'Rating';
  ratings.model = mongoose.models[modelName] || mongoose.model(modelName, ratings.schema);

  return ratings;
};