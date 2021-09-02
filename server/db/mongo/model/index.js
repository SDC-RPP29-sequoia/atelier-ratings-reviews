// const db = require('../secondary');
// const Promise = require('bluebird');


// ==== Import tables ====
const Characteristic = require('./Characteristics.js');
const Review = require('./Reviews.js');
const ReviewMetadata = require('./ReviewMetadata.js');

// This will control requests between server model and the associated dabatase.
// This may be turned into a class later with state if that helps with queries.

// ===== Create Methods =====
const addReview = (reviewServer) => {
  return new Promise( (resolve, reject) => {
    const review = new Review({
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
    });

    review.save(error => {
      if (error) {
        console.log('addReview error:', error);
        reject(error);
      } else {
        // TODO: Validate if created
        updateMetadataForAddedReview(review)
        .then(result => resolve(result))
        .catch(error => {
          console.log('Error updating metadata while saving review', error);
          reject(error)
        });
      }
    });
  });
};
module.exports.addReview = addReview;

// ===== Read Methods =====
const getReviewsByProduct = (productIdFilter, page, count, sortBy, filter) => {
  // TODO: Implement other parameters either here or higher up. See which is better
  return new Promise( (resolve, reject) => {
    Review.find(
      productIdFilter,
      (error, review) => {
        if (error) {
          console.log('getReviewsByProduct error:', error);
          reject(error);
        } else {
          resolve(review);
        }
      }
    );
  });
};
module.exports.getReviewsByProduct = getReviewsByProduct;

const getReview = (reviewIdFilter) => {
  return new Promise( (resolve, reject) => {
    Review.findOne(
      reviewIdFilter,
      (error, review) => {
        if (error) {
          console.log('getReview error:', error);
          reject(error);
        } else {
          resolve(review);
        }
      }
    );
  });
};
module.exports.getReview = getReview;

const getReviewMetadata = (productIdFilter) => {
  return new Promise( (resolve, reject) => {
    Review.findOne(
      productIdFilter,
      (error, metadata) => {
        if (error) {
          console.log('getReviewMetadata error:', error);
          reject(error);
        } else {
          resolve(metadata);
        }
      }
    );
  });
};
module.exports.getReviewMetadata = getReviewMetadata;

// ===== Update Methods =====
const reportReview = (reviewIdFilter) => {
  return new Promise( (resolve, reject) => {
    Review.findOneAndUpdate(
      reviewIdFilter,
      { reported: true },
      (error) => {
        if (error) {
          console.log('reportReview error:', error);
          reject(error);
        } else {
          // TODO: Validate if updated
          updateMetadataForRemovedReview(review)
          .then(result => resolve(result))
          .catch(error => {
            console.log('Error updating metadata while reporting review', error);
            reject(error)
          });
        }
      }
    );
  });
};
module.exports.reportReview = reportReview;

const markReviewHelpful = (reviewIdFilter) => {
  return new Promise( (resolve, reject) => {
    getReview(reviewIdFilter)
    .then(review => {
      review.helpfulness++;
      review.save(error => {
        if (error) {
          console.log('markReviewHelpful save error:', error);
          reject(error);
        } else {
          // TODO: Validate if updated
          resolve(review);
        }
      });
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
    ReviewMetadata.findOne(
      { product_id: review.product_id },
      (error, reviewMetadata) => {
        if (error) {
          console.log('updateMetadata finding metadata error:', error);
          reject(error);
        } else {
          reviewMetadata.count++;
          reviewMetadata.ratings[review.rating]++;
          if (review.recommend) {
            reviewMetadata.recommended++;
          }

          review.characteristics.forEach(characteristic => {
            if (reviewMetadata.characteristics[characteristic]) {
              // TODO: See more how these should be stored in metadata
              // id, name, value
            } else {
              reviewMetadata.characteristics.push(characteristic);
            }
          });

          reviewMetadata.save(error => {
            if (error) {
              console.log('updateMetadata saving metadata error:', error);
              reject(error);
            } else {
              // TODO: Validate if updated
              resolve();
            }
          });
        }
      }
    );
  });
};

const updateMetadataForRemovedReview = (review) => {
  return new Promise( (resolve, reject) => {
    ReviewMetadata.findOne(
      { product_id: review.product_id },
      (error, reviewMetadata) => {
        if (error) {
          console.log('updateMetadata finding metadata error:', error);
          reject(error);
        } else {
          reviewMetadata.count--;
          reviewMetadata.ratings[review.rating]--;
          if (review.recommend) {
            reviewMetadata.recommended--;
          }

          review.characteristics.forEach(characteristic => {
            // TODO: See more how these should be stored in metadata
              // id, name, value
          });

          reviewMetadata.save(error => {
            if (error) {
              console.log('updateMetadata saving metadata error:', error);
              reject(error);
            } else {
              // TODO: Validate if updated
              resolve();
            }
          });
        }
      }
    );
  });
}

// ===== Delete Methods =====
const eraseDatabaseData = () => {
  console.log('Erasing Mongo database data');
  return new Promise ((resolve, reject) => {
    Promise
    .all(
      [
        Characteristic.deleteMany({}),
        Review.deleteMany({}),
        ReviewMetadata.deleteMany({})
      ])
    .then((values) => {
      console.log('Erased all data in Mongo database:', values);
      resolve();
    })
    .catch( error => {
      console.log('Failed to erase all data in Mongo database');
      reject(error);
    });
  })
};
module.exports.eraseDatabaseData = eraseDatabaseData;




