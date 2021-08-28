// module.exports.routeData = require('../models/routes.json');
const mongoose = require('mongoose');
const models = require('./models');

const database = 'ratings_reviews';
mongoose.connect(`mongodb://localhost/${database}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  }
);