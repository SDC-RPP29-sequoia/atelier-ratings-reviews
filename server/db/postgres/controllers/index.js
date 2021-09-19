const adaptor = require('./adaptor.js');

module.exports = (db) => {
  const {
    Characteristic,
    Review,
    ReviewMetadata,
    Ratings,
    Recommended } = db;

  // ===== Create Methods =====
  const addReview = (reviewServer) => {
    return new Promise( (resolve, reject) => {
      const review = {
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

  // ===== Read Methods =====
  const getProductReviews = (productReviewRequest, filter) => {
    // TODO: Implement other parameters either here or higher up. See which is better
    return new Promise( (resolve, reject) => {
      const {
        page, count, sortBy
      } = productReviewRequest;
      const productIdFilter = productReviewRequest.productId;

      Review.findAll({ where: productIdFilter })
      .then( reviews => {
        if (reviews === null || reviews.length === 0) {
          console.log('No reviews found!', productIdFilter);
        } else {
          resolve(adaptor.productReviewsToOutput(reviews, productReviewRequest));
        }
      })
      .catch( error => {
        console.log('getProductReviews error:', error);
        reject(error);
      });
    });
  };

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
        { where: { characteristic_id: characteristic.id } })
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
        { where: { characteristic_id: characteristic.id } })
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

  return {
    addReview,
    getProductReviews,
    getReview,
    getReviewMetadata,
    reportReview,
    markReviewHelpful
  };
}