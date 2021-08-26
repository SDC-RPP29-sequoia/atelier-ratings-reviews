module.exports.routeData = require('../data/routes.json');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ratings_reviews',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  }
);

// // ===== Schemas/Models =====
const itemSchema = mongoose.Schema({
  size: {type: String, required: true},
});
const Item = mongoose.model('Item', itemSchema);

// ===== DB Write Methods =====
const addItems = items => {
  return Item.insertMany(items);
};
module.exports.addItems = addItems;