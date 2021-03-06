const adaptor = require('./adaptor.js');

module.exports = (db) => {
  const {
    Review,
    ReviewMetadata } = db;

  // ===== Create Methods =====
  const addReview = (reviewServer) => {
    return new Promise( (resolve, reject) => {
      const review = new Review({
        review_id: reviewServer.id,
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

  // ===== Read Methods =====
  const getProductReviews = (productIdFilter, page, count, sortBy, filter) => {
    // TODO: Implement other parameters either here or higher up. See which is better
    return new Promise( (resolve, reject) => {
      Review.find(
        productIdFilter,
        (error, reviews) => {
          if (error) {
            console.log('getProductReviews error:', error);
            reject(error);
          } else {
            resolve(adaptor.productReviewsToOutput(reviews));
          }
        }
      );
    });
  };

  const getReview = (reviewIdFilter) => {
    return new Promise( (resolve, reject) => {
      Review.findOne(
        reviewIdFilter,
        (error, review) => {
          if (error) {
            console.log('getReview error:', error);
            reject(error);
          } else {
            resolve(adaptor.reviewToOutput(review));
          }
        }
      );
    });
  };

  const getReviewMetadata = (productIdFilter) => {
    return new Promise( (resolve, reject) => {
      Review.findOne(
        productIdFilter,
        (error, metadata) => {
          if (error) {
            console.log('getReviewMetadata error:', error);
            reject(error);
          } else {
            resolve(adaptor.reviewMetadataToOutput(metadata));
          }
        }
      );
    });
  };

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

  const updateMetadataForAddedReview = (review) => {
    return new Promise( (resolve, reject) => {
      ReviewMetadata.findOne(
        { product_id: review.product_id },
        (error, reviewMetadata) => {
          if (error) {
            console.log('updateMetadata finding metadata error:', error);
            reject(error);
          } else {
            incrementRatings(review, reviewMetadata);
            incrementRecommended(review, reviewMetadata);

            // TODO: This is dirty/dumb. Fix later!
            review.characteristics?.forEach(characteristic => {
              reviewMetadata.characteristics?.forEach(characteristicMetadata => {
                if (characteristic.id === characteristicMetadata.id) {
                  incrementRatings(characteristic, characteristicMetadata);
                }
              })
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
            decrementRatings(review, reviewMetadata);
            decrementRecommended(review, reviewMetadata);

            // TODO: This is dirty/dumb. Fix later!
            review.characteristics?.forEach(characteristic => {
              reviewMetadata.characteristics?.forEach(characteristicMetadata => {
                if (characteristic.id === characteristicMetadata.id) {
                  decrementRatings(characteristic, characteristicMetadata);
                }
              })
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

  // TODO: These may be contenders for schema METHODS
  const incrementRatings = (newRating, ratingLog) => {
    ratingLog.ratings[newRating.rating]++;
    return ratingLog;
  };

  // TODO: These may be contenders for schema METHODS
  const decrementRatings = (newRating, ratingLog) => {
    ratingLog.ratings[newRating.rating]--;
    return ratingLog;
  };

  // TODO: These may be contenders for schemas & schema METHODS?
  const incrementRecommended = (review, reviewMetadata) => {
    if (review.recommend !== undefined) {
      if (review.recommend) {
        reviewMetadata.recommended.true++;
      } else {
        reviewMetadata.recommended.false++;
      }
    }
  }

  // TODO: These may be contenders for schemas & schema METHODS?
  const decrementRecommended = (review, reviewMetadata) => {
    if (review.recommend !== undefined) {
      if (review.recommend) {
        reviewMetadata.recommended.true--;
      } else {
        reviewMetadata.recommended.false--;
      }
    }
  }

  // ===== Delete Methods =====
  const eraseDatabaseData = () => {
    console.log('Erasing Mongo database data');
    return new Promise ((resolve, reject) => {
      Promise
      .all(
        [
          Review.deleteMany({}),
          ReviewMetadata.deleteMany({})
        ])
      .then((values) => {
        console.log('Erased all data in Mongo database:', values);
        console.log('Reviews Deleted: ', values[0].deletedCount);
        console.log('ReviewsMetadata Deleted: ', values[1].deletedCount);
        resolve();
      })
      .catch( error => {
        console.log('Failed to erase all data in Mongo database');
        reject(error);
      });
    })
  };

  return {
    addReview,
    getProductReviews,
    getReview,
    getReviewMetadata,
    reportReview,
    markReviewHelpful,
    eraseDatabaseData
  };
}