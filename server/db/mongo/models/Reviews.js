module.exports = (mongoose) => {
  const characteristics = require('./Characteristics.js')(mongoose);
  const photos = require('./Photos.js')(mongoose);

  const reviews = {};

  reviews.schema = mongoose.Schema({
    review_id: { type: Number, required: true },
    product_id: { type: Number, required: true },
    rating: { type: Number, required: true },
    summary: { type: String, required: true },
    body: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    recommend: { type: Boolean, required: true },
    helpfulness: { type: Number },
    reported: { type: Boolean },
    user: {
      username: { type: String, required: true },
      email: { type: String, required: true },
      createdAt: { type: Date, required: true },
      updatedAt: { type: Date, required: true },
    },
    photos: [
     { type: photos.schema }
    ],
    characteristics: [
      { type: characteristics.schema }
    ]
  });

  const modelName = 'Review';
  reviews.model = mongoose.models[modelName] || mongoose.model(modelName, reviews.schema);

  return reviews;
};