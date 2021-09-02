// const Promise = require('bluebird');

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
const CharacteristicName = require('./CharacteristicNames.js');
Characteristic.hasOne(CharacteristicName);
CharacteristicName.belongsTo(Characteristic);

Review.belongsToMany(Characteristic, { through: 'review_to_characteristic' });
Characteristic.belongsToMany(Review, { through: 'review_to_characteristic' });

const Photo = require('./Photos.js');
Review.belongsToMany(Photo, { through: 'review_to_photo' });
Photo.belongsToMany(Review, { through: 'review_to_photo' });

const ReviewMetadata = require('./ReviewMetadata.js');
const ReviewMetadataRating = require('./ReviewMetadataRatings.js');
ReviewMetadata.hasOne(ReviewMetadataRating);
ReviewMetadataRating.belongsTo(ReviewMetadata);
// TODO: Handle associated characteristics here as well


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
const getReviewsByProduct = (productIdFilter, page, count, sortBy, filter) => {
  // TODO: Implement other parameters either here or higher up. See which is better
  return new Promise( (resolve, reject) => {
    Review.findAll({ where: productIdFilter })
    .then( review => {
      if (review === null) {
        console.log('No reviews found!', productIdFilter);
      } else {
        resolve(review);
      }
    })
    .catch( error => {
      console.log('getReviewsByProduct error:', error);
      reject(error);
    });
  });
};
module.exports.getReviewsByProduct = getReviewsByProduct;

const getReview = (reviewIdFilter) => {
  return new Promise( (resolve, reject) => {
    Review.findOne({ where: reviewIdFilter })
    .then( review => {
      if (review === null) {
        console.log('Review not found!', reviewFilter);
      } else {
        resolve(review);
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
        resolve(metadata);
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
    ReviewMetadata.increment(
      ['count', 'recommended'],
      { where: { product_id: review.product_id } }
    )
    .then(affectedRows => {
      if (affectedRows.length === 0) {
        console.log('Review metadata failed to be incremented');
        reject();
      } else {
        ReviewMetadataRating.increment(
          `star_${review.rating}`,
          { where: { id: affectedRows[0].id } })
        .then(rowsAffected => {
          if (rowsAffected.length === 0) {
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
      }
    })
    .catch(error => {
      console.log('updateMetadata incrementing error:', error);
      reject(error);
    });

    // TODO: Work out characteristics
    // review.characteristics.forEach(characteristic => {
    //   if (reviewMetadata.characteristics[characteristic]) {
    //     // TODO: See more how these should be stored in metadata
    //     // id, name, value
    //   } else {
    //     reviewMetadata.characteristics.push(characteristic);
    //   }
    // });
  });
};

const updateMetadataForRemovedReview = (review) => {
  return new Promise( (resolve, reject) => {
    ReviewMetadata.decrement(
      ['count', 'recommended'],
      { where: { product_id: review.product_id } }
    )
    .then(affectedRows => {
      if (affectedRows.length === 0) {
        console.log('Review metadata failed to be decremented');
        reject();
      } else {
        ReviewMetadataRating.decrement(
          `star_${review.rating}`,
          { where: { id: affectedRows[0].id } })
        .then(rowsAffected => {
          if (rowsAffected.length === 0) {
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
      }
    })
    .catch(error => {
      console.log('updateMetadata decrementing error:', error);
      reject(error);
    });

    // TODO: Work out characteristics
    // review.characteristics.forEach(characteristic => {
    //   if (reviewMetadata.characteristics[characteristic]) {
    //     // TODO: See more how these should be stored in metadata
    //     // id, name, value
    //   } else {
    //     reviewMetadata.characteristics.push(characteristic);
    //   }
    // });
  });
}

// ===== Delete Methods =====