module.exports = (mongoose) => {
  const characteristics = require('./Characteristics.js')(mongoose);
  const ratings = require('./Ratings.js')(mongoose);

  const reviewMetadata = {};

  reviewMetadata.schema = mongoose.Schema({
    product_id: { type: Number, required: true },
    ratings: { type: ratings.schema },
    recommended: {
      true: { type: Number },
      false: { type: Number }
    },
    characteristics: [
      { type: characteristics.schema }
    ]
  });

  const modelName = 'ReviewMetadata';
  reviewMetadata.model = mongoose.models[modelName] || mongoose.model(modelName, reviewMetadata.schema);

  return reviewMetadata;
};