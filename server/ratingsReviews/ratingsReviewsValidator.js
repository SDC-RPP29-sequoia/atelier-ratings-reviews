const {
  sendErrorResponse
} = require("../helpers");

exports.validateReview = (req,res,next) => {
  const reviewClient = req.body;
  let message = '';

  const isValidReview = (review) => {
    if (!review) {
      message = 'Review data is missing.';
      return false;
    } else if (!review.name) {
      message = 'Reviewer name is missing.';
      return false;
    } else if (!review.email) {
      message = 'Reviewer email is missing.';
      return false;
    } else if (review.rating === undefined && review.recommend === undefined) {
      message = 'Reviewer rating or recommendation is missing. At least one is needed.';
      return false;
    } else {
      return true;
    }
  };

  if (!isValidReview(reviewClient)) {
    return sendErrorResponse({res, statusCode: 400, message});
  } else {
    return next();
  }
};

// TODO: Make validators for empty params for each route