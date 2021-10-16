'use strict';

const rootRouter = require('./root');
const ratingsReviewsRouter = require('./ratingsReviews');

module.exports = (app) => {
  app.use('/', rootRouter);
  app.use('/reviews', ratingsReviewsRouter);
};