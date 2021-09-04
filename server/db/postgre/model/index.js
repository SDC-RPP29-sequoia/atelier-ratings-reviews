// const Promise = require('bluebird');
const adaptor = require('./adaptor.js');

// This will control requests between server model and the associated dabatase.
// This may be turned into a class later with state if that helps with queries.

// ==== Import tables and set up associations ====
const Review = require ('./Reviews.js');
const Product = require ('./Products.js');
Review.hasOne(Product);
Product.belongsTo(Review);

const Profile = require('./Profiles.js');
Review.hasOne(Profile);
Profile.belongsTo(Review);

const Characteristic = require('./Characteristics.js');
Characteristic.hasOne(Rating);
Rating.belongsTo(Characteristic);

Review.belongsToMany(Characteristic, { through: 'review_to_characteristic' });
Characteristic.belongsToMany(Review, { through: 'review_to_characteristic' });

const Photo = require('./Photos.js');
Review.belongsToMany(Photo, { through: 'review_to_photo' });
Photo.belongsToMany(Review, { through: 'review_to_photo' });

const ReviewMetadata = require('./ReviewMetadata.js');
Characteristic.hasOne(ReviewMetadata);
ReviewMetadata.belongsTo(Characteristic);

const Rating = require('./Ratings.js');
ReviewMetadata.hasOne(Rating);
Rating.belongsTo(ReviewMetadata);

const Recommended = require('./Recommended.js');
ReviewMetadata.hasOne(Recommended);
Recommended.belongsTo(ReviewMetadata);


// ===== Create Methods =====
const addReview = (reviewServer) => {
  return new Promise( (resolve, reject) => {
    const review = {
      review_id_external: reviewServer.id,
      product_id: reviewServer.product_id,
      rating: reviewServer.rating,
      summary: reviewServer.summary,
      body: reviewServer.body,
      recommend: reviewServer.recommend,
      helpfulness: reviewServer.helpfulness,
      userName: reviewServer.name,
      userEmail: reviewServer.email,
      photos: reviewServer.photos,
      characteristics: reviewServer.characteristics
    };

    Review.create(review)
    .then(rowsAdded => {
      if (rowsAdded === 0) {
        console.log('Review failed to be added');
        reject();
      } else {
        updateMetadataForAddedReview(review)
        .then(() => resolve())
      }
    })
    .catch( error => {
      console.log('addReview error:', error);
      reject(error);
    });
  });
};
module.exports.addReview = addReview;

// ===== Read Methods =====
const getProductReviews = (productIdFilter, page, count, sortBy, filter) => {
  // TODO: Implement other parameters either here or higher up. See which is better
  return new Promise( (resolve, reject) => {
    Review.findAll({ where: productIdFilter })
    .then( reviews => {
      if (reviews === null || reviews.length === 0) {
        console.log('No reviews found!', productIdFilter);
      } else {
        resolve(adaptor.productReviewsToOutput(reviews));
      }
    })
    .catch( error => {
      console.log('getProductReviews error:', error);
      reject(error);
    });
  });
};
module.exports.getProductReviews = getProductReviews;

const getReview = (reviewIdFilter) => {
  return new Promise( (resolve, reject) => {
    Review.findOne({ where: reviewIdFilter })
    .then( review => {
      if (review === null) {
        console.log('Review not found!', reviewFilter);
      } else {
        resolve(adaptor.reviewToOutput(review));
      }
    })
    .catch( error => {
      console.log('getReview error:', error);
      reject(error);
    });
  });
};
module.exports.getReview = getReview;

const getReviewMetadata = (productIdFilter) => {
  return new Promise( (resolve, reject) => {
    ReviewMetadata.findOne({ where: productIdFilter })
    .then( metadata => {
      if (metadata === null) {
        console.log('ReviewMetadata not found!', productIdFilter);
      } else {
        resolve(adaptor.reviewMetadataToOutput(metadata));
      }
    })
    .catch( error => {
      console.log('getReviewMetadata error:', error);
      reject(error);
    });
  });
};
module.exports.getReviewMetadata = getReviewMetadata;

// ===== Update Methods =====
const reportReview = (reviewIdFilter) => {
  return new Promise( (resolve, reject) => {
    Review.update(
      {reported: true},
      {returning: true, where: reviewIdFilter}
    ).then(affectedRows => {
      if (affectedRows === 0) {
        console.log('Review failed to be reported');
        reject();
      } else {
        updateMetadataForRemovedReview(review)
        .then(() => resolve());
      }
    })
    .catch(error => {
      console.log('reportReview error:', error);
      reject(error);
    });
  });
};
module.exports.reportReview = reportReview;

const markReviewHelpful = (reviewIdFilter) => {
  return new Promise( (resolve, reject) => {
    Review.increment('helpfulness', { where: reviewIdFilter })
    .then(affectedRows => {
      if (affectedRows.length === 0) {
        console.log('Review failed to be marked as helpful');
        reject();
      } else {
        resolve();
      }
    })
    .catch(error => {
      console.log('markReviewHelpful error:', error);
      reject(error);
    });
  });
};
module.exports.markReviewHelpful = markReviewHelpful;

const updateMetadataForAddedReview = (review) => {
  return new Promise( (resolve, reject) => {
    Promise.all([
      incrementRecommended(review.recommended, fk1), // Needs to be the foreign key
      incrementRatings(review.rating, fk2), // Needs to be the foreign key
      updateCharacteristicsRating(review.characteristics)
    ])
    .then(values => {
      console.log(values);
      resolve();
    })
    .catch(error => {
      console.log('updateMetadata incrementing error:', error);
      reject(error);
    });
  });
};

const updateMetadataForRemovedReview = (review) => {
  return new Promise( (resolve, reject) => {
    Promise.all([
      decrementRecommended(review.recommended, fk1), // Needs to be the foreign key
      decrementRatings(review.rating, fk2), // Needs to be the foreign key
      updateCharacteristicsRating(review.characteristics, false)
    ])
    .then(values => {
      console.log(values);
      resolve();
    })
    .catch(error => {
      console.log('updateMetadata decrementing error:', error);
      reject(error);
    });
  });
};

const incrementRatings = (rating, ratingId) => {
  return new Promise((resolve, reject) => {
    Ratings.increment(
      `star_${rating}`,
      { where: { id: ratingId } })
    .then(affectedRows => {
      if (affectedRows.length === 0) {
        console.log('Review metadata rating failed to be incremented');
        reject();
      } else {
        resolve();
      }
    })
    .catch(error => {
      console.log('updateMetadata incrementing rating error:', error);
      reject(error);
    });
 });
};

const decrementRatings = (rating, ratingId) => {
  return new Promise((resolve, reject) => {
    Ratings.decrement(
      `star_${rating}`,
      { where: { id: ratingId } })
    .then(affectedRows => {
      if (affectedRows.length === 0) {
        console.log('Review metadata rating failed to be decremented');
        reject();
      } else {
        resolve();
      }
    })
    .catch(error => {
      console.log('updateMetadata decrementing rating error:', error);
      reject(error);
    });
  });
};

const incrementRecommended = (recommended, recommendedId) => {
  return new Promise((resolve, reject) => {
    if (recommended !== undefined) {
      const recommendedProperty = recommended ? 'true' : 'false';

      Recommended.increment(
        recommendedProperty,
        { where: { id: recommendedId } })
      .then(affectedRows => {
        if (affectedRows.length === 0) {
          console.log('Review metadata recommendations failed to be incremented');
          reject();
        } else {
          resolve();
        }
      })
      .catch(error => {
        console.log('updateMetadata incrementing recommendations error:', error);
        reject(error);
      });
    } else {
      resolve();
    }
  });
};

const decrementRecommended = (recommended, recommendedId) => {
  return new Promise((resolve, reject) => {
    if (recommended !== undefined) {
      const recommendedProperty = recommended ? 'true' : 'false';

      Recommended.decrement(
        recommendedProperty,
        { where: { id: recommendedId } })
      .then(affectedRows => {
        if (affectedRows.length === 0) {
          console.log('Review metadata recommendations failed to be decremented');
          reject();
        } else {
          resolve();
        }
      })
      .catch(error => {
        console.log('updateMetadata decrementing recommendations error:', error);
        reject(error);
      });
    } else {
      resolve();
    }
  });
};

const updateCharacteristicsRating = (characteristics, increment = true) => {
  const updates = [];
  for (let i = 0; i < characteristics.length; i++) {
    const characteristic = characteristics[i];
    let callback = null;
    if (increment) {
      callback = incrementCharacteristic.bind(null, characteristic);
    } else {
      callback = decrementCharacteristic.bind(null, characteristic);
    }
    updates.push(callback);
  }

  return new Promise( (resolve, reject) => {
    Promise.all([ updates ])
    .then(values => {
      console.log(values);
      resolve();
    })
    .catch(error => {
      console.log('Characteristic group incrementing error:', error);
      reject(error);
    });
  });
};

const incrementCharacteristic = (characteristic) => {
  // TODO: Actually needs to increment rating by id
  return new Promise((resolve, reject) => {
    Characteristic.increment(
      'rating',
      { where: { characteristic_id_external: characteristic.id } })
    .then(affectedRows => {
      if (affectedRows.length === 0) {
        console.log('Characteristic failed to be incremented');
        reject();
      } else {
        resolve();
      }
    })
    .catch(error => {
      console.log('Characteristic incrementing error:', error);
      reject(error);
    });
 });
};

const decrementCharacteristic = (characteristic) => {
  // TODO: Actually needs to increment rating by id
  return new Promise((resolve, reject) => {
    Characteristic.decrement(
      'rating',
      { where: { characteristic_id_external: characteristic.id } })
    .then(affectedRows => {
      if (affectedRows.length === 0) {
        console.log('Characteristic failed to be decremented');
        reject();
      } else {
        resolve();
      }
    })
    .catch(error => {
      console.log('Characteristic decrementing error:', error);
      reject(error);
    });
 });
};

// ===== Delete Methods =====