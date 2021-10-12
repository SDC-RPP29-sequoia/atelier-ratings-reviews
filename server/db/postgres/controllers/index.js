const adaptor = require('./adaptor.js');
const { Sequelize } = require('sequelize');

module.exports = (db) => {
  const {
    Characteristic,
    Review,
    ReviewMetadata,
    Rating,
    Recommended,
    Profile,
    Photo,
    ReviewToPhoto,
    ReviewToCharacteristic } = db;

  // ===== Create Methods =====
  const addReview = (reviewServer) => {
    return new Promise( (resolve, reject) => {
      const reviewInput = {
        product_id: reviewServer.product_id,
        rating: reviewServer.rating,
        summary: reviewServer.summary,
        body: reviewServer.body,
        recommend: reviewServer.recommend,
        helpfulness: reviewServer.helpfulness,
        date: reviewServer.date,
        photos: reviewServer.photos,
        characteristics: reviewServer.characteristics
      };

      const profileInput = {
        username: reviewServer.name,
        email: reviewServer.email
      }

      Promise.all([
        Profile.findOrCreate({
          where: { username: profileInput.username},
          defaults: profileInput
        }),
        Review.findAll({
          attributes: [Sequelize.fn('max', Sequelize.col('review_id'))],
          raw: true,
        })
      ])
      .then(results => {
        let reviewIdMax = results[1][0].max;
        reviewIdMax++;

        reviewInput.review_id = reviewIdMax;
        reviewInput.profile_id = results[0][0].get().id;
      })
      .then(() => Review.create(reviewInput))
      .then(row => {
        if (row === undefined) {
          console.log('Review failed to be added');
          reject();
        } else {
          const reviewId = row.get().id;
          // console.log('Review ID: ', reviewId);

          return Promise.all([
            addAndAssociateReviewPhotos(reviewId, reviewInput.photos),
            addReviewCharacteristics(reviewId, reviewInput.characteristics),
            updateMetadataForAddedReview(reviewInput)
          ]);
        }
      })
      .then(() => {
        // console.log('Review Added!');
        resolve()
      })
      .catch(error => {
        console.log('addReview error:', error);
        reject(error);
      });
    });
  };

  const addPhotos = (photos) => {
    return new Promise((resolve, reject) => {
      Photo.findAll({
        attributes: [Sequelize.fn('max', Sequelize.col('photo_id'))],
        raw: true,
      })
      .then(result => {
        let photoIdMax = result[0].max;

        let createPhotos = [];
        photos.forEach(url => {
          // console.log('Photo url: ', url);
          // console.log('Photo id: ', photoIdMax);
          createPhotos.push(
            Photo.create({
              photo_id: ++photoIdMax,
              url: url
            })
          );
        })

        return Promise.all(createPhotos)
      })
      .then(results => {
        // console.log('Photos Created');
        let photosAdded = [];
        results.forEach(result => {
          let photoAdded = result.get();
          // console.log('Photo added: ', photoAdded);
          photosAdded.push(photoAdded);
        });
        resolve(photosAdded);
      })
      .catch(error => {
        console.log('Error creating photos', error);
        reject(error);
      });
    });
  };

  const addAndAssociateReviewPhoto = (reviewId, photoId) => {
    return new Promise((resolve, reject) => {
      ReviewToPhoto.create({
        photo_id: photoId,
        review_id: reviewId
      })
      .then(row => {
        let id = row.get();
        // console.log('PhotoToReviewId: ', id);
        resolve(id);
      })
      .catch(error => {
        console.log(`An error occurred associating review ID ${reviewId} to photo ID ${photoId}`, error);
        reject(error);
      })
    });
  };

  const addAndAssociateReviewPhotos = (reviewId, photos) => {
    return new Promise((resolve, reject) => {
      if (reviewId && photos && photos.length > 0) {
        addPhotos(photos)
        .then(photosAdded => {
          // console.log('photosAdded', photosAdded);
          let photosToReview = [];
          photosAdded.forEach(photoAdded => {
            let photoId = photoAdded.id;
            // console.log('photoId', photoId);
            photosToReview.push(addAndAssociateReviewPhoto(reviewId, photoId));
          });
          return Promise.all(photosToReview);
        })
        .then(() => {
          // console.log('Added review photos!');
          resolve();
        })
        .catch(error => {
          console.log(`Error associating photos with review of ID ${reviewId}`, error);
          reject(error);
        })
      } else {
        resolve();
      }
    });
  };

  const addRating = (value, count = 0) => {
    return new Promise((resolve, reject) => {
      const ratingProperty = `star_${value}`;
      const rating = {};
      rating[ratingProperty] = count;
      Rating.create(rating)
      .then(row => {
        let rating = row.get();
        resolve(rating);
      })
      .catch(error => {
        console.log(`Error creating rating for value ${value}`, error);
        reject(error);
      })
    });
  };

  const addReviewCharacteristic = (reviewId, characteristic) => {
    return new Promise((resolve, reject) => {
      let characteristicId = Object.keys(characteristic)[0];
      ReviewToCharacteristic.create({
        review_id: reviewId,
        characteristic_id: characteristicId,
        rating: characteristic[characteristicId]
      })
      .then(() => {
        console.log('Added review characteristic rating!');
        resolve();
      })
      .catch(error => {
        console.log(`Error in rating characteristic ID ${characteristicId} for review ID ${reviewId}, from ${characteristic}`, error);
        reject();
      });
    });
  };

  const addReviewCharacteristics = (reviewId, characteristics) => {
    return new Promise((resolve, reject) => {
      if (reviewId && characteristics && characteristics.length > 0) {
        let characteristicsToReview = [];
        characteristics.forEach(characteristic => {
          characteristicsToReview.push(addReviewCharacteristic(reviewId, characteristic));
        });

        Promise.all(characteristicsToReview)
        .then(() => {
          // console.log('Added review characteristics!');
          resolve();
        })
        .catch(error => {
          console.log(`Error associating characteristics with review of ID ${reviewId}`, error);
          reject(error);
        })
      } else {
        resolve();
      }
    });
  };

  // ===== Read Methods =====
  const getProductReviews = (productReviewRequest, filter) => {
    // TODO: Implement other parameters either here or higher up. See which is better
    return new Promise( (resolve, reject) => {
      const {
        product_id,
        page,
        count,
        sortBy } = productReviewRequest;

      Review.findAll({ where: { product_id } })
      .then(rows => {
        if (rows === null || rows.length === 0) {
          console.log('No reviews found!', { product_id });
          resolve();
        } else {
          let reviews = [];
          rows.forEach(row => {
            reviews.push(row.get());
          });

          const addUserName = (review) => {
            return new Promise((resolve, reject) => {
              Profile.findOne({ where: { id: review.profile_id }})
              .then(result => {
                const profile = result.get();
                review.username = profile.username;
                resolve();
              })
              .catch(error => {
                console.log('Error in adding username to review', error);
                reject(error);
              });
            });
          };

          const addUserNames = [];
          reviews.forEach(review => {
            addUserNames.push(addUserName(review));
          });

          Promise.all(addUserNames)
          .then(() => resolve(adaptor.productReviewsToOutput(reviews, productReviewRequest)))
          .catch(error => {
            console.log('Error in getting product reviews', error);
            reject();
          });
        }
      })
      .catch(error => {
        console.log('getProductReviews error:', error);
        reject(error);
      });
    });
  };

  // TBD: Table join for reviewer name, characteristics (joined to rating), photos
  const getReview = (reviewIdFilter, getCharacteristics = true) => {
    return new Promise( (resolve, reject) => {
      console.log('getReview promise');
      let review;
      Review.findOne({ where: reviewIdFilter })
      .then(row => {
        if (row === null) {
          console.log('Review not found!', reviewIdFilter);
          resolve();
        } else {
          console.log('Row: ', row);
          review = row.get();
          if (review.reported) {
            console.log('Review has been reported and will not be returned');
            resolve();
          } else {
            // TBD: Naive solution. Later implement table joins.
            const characteristicsCB = getCharacteristics
            ? getReviewCharacteristics
            : () => new Promise(resolve => resolve());

            Promise.all([
              getProfile(review.profile_id),
              getReviewPhotos(review.id),
              characteristicsCB(review.id)
            ])
            .then(results => {
              let profile = results[0];
              review.username = profile.username;

              let photos = results[1];
              if (photos) {
                review.photos = photos;
              }

              let characteristics = results[2];
              if (characteristics) {
                review.characteristics = characteristics;
              }
            })
            .then(() => {
              console.log('review: ', review);
              resolve(adaptor.reviewToOutput(review));
            })
          }
        }
      })
      .catch(error => {
        console.log('getReview error:', error);
        reject(error);
      });
    });
  };

  const getReviewPhotos = (reviewId) => {
    return new Promise((resolve, reject) => {
      ReviewToPhoto.findAll({ where: { review_id: reviewId } })
      .then (results => {
        if (results === null || results.length === 0) {
          resolve();
        } else {
          const getPhotos = [];
          results.forEach(result => {
            let row = result.get();
            getPhotos.push(getPhoto({ id: row.photo_id }));
          });
          Promise.all(getPhotos)
          .then(photos => {
            resolve(photos);
          })
        }
      })
      .catch(error => {
        console.log('getReviewPhotos Error', error);
        reject(error);
      })
    });
  }

  // TBD: Join with characteristics to get name
  const getReviewCharacteristics = (reviewId) => {
    return new Promise((resolve, reject) => {
      ReviewToCharacteristic.findAll({ where: { review_id: reviewId } })
      .then (results => {
        if (results === null || results.length === 0) {
          resolve();
        } else {
          const characteristics = [];
          results.forEach(result => {
            let reviewCharacteristic = result.get();
            characteristics.push(new Promise((resolve, reject) => {
              getCharacteristic({ characteristic_id: reviewCharacteristic.characteristic_id })
              .then(characteristic => {
                reviewCharacteristic.name = characteristic.name;
                resolve(reviewCharacteristic)
              })
              .catch(error => {
                console.log(`Error in getting characteristic name for characteristic_id ${reviewCharacteristic.characteristic_id}`, error)
                reject(error);
              })
            }));
          });
          Promise.all(characteristics)
          .then(characteristics => {
            resolve(characteristics);
          })
        }
      })
      .catch(error => {
        console.log('getReviewCharacteristics Error', error);
        reject(error);
      })
    });
  };

  // TBD: Join with rating & recommended
  // TBD: Make ratings object keys integers rather than strings
  // TBD: Make characteristics value property a string rather than float
  const getReviewMetadata = (productIdFilter) => {
    return new Promise( (resolve, reject) => {
      console.log('Getting review metadata!');
      getReviewMetadataRaw(productIdFilter)
      .then(metadata => {
        if (metadata) {
          resolve(adaptor.reviewMetadataToOutput(metadata));
        } else {
          resolve(undefined);
        }
      })
      .catch( error => {
        console.log('getReviewMetadata error:', error);
        reject(error);
      });
    });
  };

  const getReviewMetadataRaw = (productIdFilter) => {
    return new Promise( (resolve, reject) => {
      ReviewMetadata.findOne({ where: productIdFilter })
      .then(row => {
        if (row === null) {
          console.log('ReviewMetadata not found!', productIdFilter);
          resolve();
        } else {
          let metadata = row.get();

          let otherData = [];
          if (metadata.rating_id) {
            otherData.push(getRating({ id: metadata.rating_id }));
          } else {
            otherData.push(new Promise(resolve => resolve()));
          }
          if (metadata.recommended_id) {
            otherData.push(getRecommended({ id: metadata.recommended_id }));
          } else {
            otherData.push(new Promise(resolve => resolve()));
          }
          otherData.push(getCharacteristics({ review_metadata_id: metadata.id}));

          Promise.all(otherData)
          .then(results => {
            let rating = results[0];
            if (rating) {
              metadata.rating = rating;
            }

            let recommended = results[1];
            if (recommended) {
              metadata.recommended = recommended;
            }

            let characteristics = results[2];
            if (characteristics) {
              metadata.characteristics = characteristics;
            }

            resolve(metadata);
          })
          .catch(error => {
            console.log('Error getting ratings & recommendations for review metadata', error);
            reject(error);
          })
        }
      })
      .catch( error => {
        console.log('getReviewMetadata error:', error);
        reject(error);
      });
    });
  };

  const getProfile = (profileIdFilter) => {
    return getFromOne(profileIdFilter, Profile, 'getProfile');
  }

  const getPhoto = (photoIdFilter) => {
    return getFromOne(photoIdFilter, Photo, 'getPhoto');
  }

  // TBD: Use rating join
  const getCharacteristic = (characteristicIdFilter) => {
    return new Promise((resolve, reject) => {
      getFromOne(characteristicIdFilter, Characteristic, 'getCharacteristic')
      .then(characteristic => {
        if (characteristic) {
          getRating({ id: characteristic.rating_id })
          .then(rating => {
            characteristic.rating = rating;
            resolve(characteristic);
          })
        } else {
          resolve();
        }
      })
      .catch(error => {
        console.log('Error in getCharacteristic: ', error);
        reject(error);
      })
    });
  }

  // TBD: Use rating join
  const getCharacteristics = (characteristicIdFilter) => {
    return new Promise((resolve, reject) => {
      let getCharacteristicRatings = [];
      getFromMany(characteristicIdFilter, Characteristic, 'getCharacteristics')
      .then(rows => {
        if (rows) {
          rows.forEach(row => {
            getCharacteristicRatings.push(
              new Promise((resolve, reject) => {
                const characteristic = row.get();

                if (characteristic.rating_id === null) {
                  resolve(characteristic);
                } else {
                  getRating({ id: characteristic.rating_id })
                  .then(rating => {
                    characteristic.rating = rating;
                    resolve(characteristic);
                  })
                  .catch(error => {
                    console.log('Error getting rating for characteristic', error);
                    reject(error);
                  })
                }
              })
            );
          });

          Promise.all(getCharacteristicRatings)
          .then(characteristics => {
            resolve(characteristics);
          })
          .catch(error => {
            console.log('Error in getting rating for characteristics', error);
            reject(error);
          });
        } else {
          resolve();
        }
      })
      .catch(error => {
        console.log('Error in getCharacteristic: ', error);
        reject(error);
      })
    });
  }

  const getRating = (ratingIdFilter) => {
    return getFromOne(ratingIdFilter, Rating, 'getRating');
  }

  const getRecommended = (recommendedIdFilter) => {
    return getFromOne(recommendedIdFilter, Recommended, 'getRecommended');
  }

  // Generic 'get' method with no joins, that handles errors and returns, messages for finding a single record.
  const getFromOne = (idFilter, model, methodName) => {
    return new Promise( (resolve, reject) => {
      model.findOne({ where: idFilter })
      .then(row => {
        if (row === null) {
          console.log(`${model.name} not found!`, idFilter);
          resolve();
        } else {
          let item = row.get();
          resolve(item);
        }
      })
      .catch(error => {
        console.log(`${methodName} error:`, error);
        reject(error);
      });
    });
  }

  // Generic 'get' method with no joins, that handles errors and returns, messages for finding multiple records.
  const getFromMany = (idFilter, model, methodName) => {
    return new Promise( (resolve, reject) => {
      model.findAll({ where: idFilter })
      .then(rows => {
        if (rows === null || rows.length === 0) {
          console.log(`${model.name} not found!`, idFilter);
          resolve();
        } else {
          resolve(rows);
        }
      })
      .catch(error => {
        console.log(`${methodName} error:`, error);
        reject(error);
      });
    });
  }

  // ===== Update Methods =====
  const reportReview = (reviewIdFilter) => {
    return new Promise( (resolve, reject) => {
      Review.update(
        {reported: true},
        {returning: true, where: reviewIdFilter}
      ).then(affectedRows => {
        if (affectedRows[0] === 0) {
          console.log('Review failed to be reported');
          reject();
        } else {
          let review = affectedRows[1][0].get();
          getReviewCharacteristics(review.id)
          .then(characteristics => {
            if (characteristics) {
              review.characteristics = characteristics;
            }
            return updateMetadataForRemovedReview(review)
          })
          .then(() => resolve())
          .catch(error => {
            console.log('Error getting characteristics for removed review', error);
            reject(error);
          });
        }
      })
      .catch(error => {
        console.log('reportReview error:', error);
        reject(error);
      });
    });
  };

  // TODO: This will fail if null. Update similar to ratings & recommended.
  // TODO: In all 3 cases, rather than doing a find, increment, update, perhaps increment first, check rows affected, then fallback if 0 rows affected?
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
    return new Promise((resolve, reject) => {
      getReviewMetadataRaw({ product_id: review.product_id })
      .then(metadata => {
        Promise.all([
          incrementRecommended(review.recommend, metadata.recommended_id),
          incrementRatings(review.rating, metadata.rating_id),
          incrementCharacteristicsRating(review.characteristics, metadata.characteristics)
        ])
        .then(() => {
          resolve();
        })
        .catch(error => {
          console.log('updateMetadataForAddedReview incrementing error:', error);
          reject(error);
        });
      })
      .catch(error => {
        console.log('getReviewMetadataRaw error:', error);
        reject(error);
      });
    });
  };

  const updateMetadataForRemovedReview = (review) => {
    return new Promise((resolve, reject) => {
      getReviewMetadataRaw({ product_id: review.product_id })
      .then(metadata => {
        Promise.all([
          decrementRecommended(review.recommend, metadata.recommended_id),
          decrementRatings(review.rating, metadata.rating_id),
          decrementCharacteristicsRating(review.characteristics, metadata.characteristics)
        ])
        .then(() => {
          resolve();
        })
        .catch(error => {
          console.log('updateMetadataForAddedReview decrementing error:', error);
          reject(error);
        });
      })
      .catch(error => {
        console.log('getReviewMetadataRaw error:', error);
        reject(error);
      });
    });
  };

  const incrementRatings = (rating, ratingId) => {
    return updateRatings(rating, ratingId, true);
  };

  const decrementRatings = (rating, ratingId) => {
    return updateRatings(rating, ratingId, false);
  };

  const updateRatings = (rating, ratingId, increment = true) => {
    return new Promise((resolve, reject) => {
      if (rating === undefined || rating === null) {
        reject('No rating!');
      } else {
        const ratingProperty = `star_${rating}`;
        if (!ratingId) {
          const ratingEntry = {};
          ratingEntry[ratingProperty] = 1;
          Rating.create(ratingEntry)
          .then(row => {
            resolve(row.get());
          })
          .catch(error => {
            console.log('Review metadata rating failed to be created', error);
            reject(error);
          });
        } else {
          const ratingIdFilter = { id: ratingId };

          Rating.findOne({ where: ratingIdFilter })
          .then(row => {
            const rating = row.get();
            if (rating[ratingProperty] === null) {
              rating[ratingProperty] = 1;
            } else {
              rating[ratingProperty] = Math.max(0, rating[ratingProperty] + (increment ? 1 : -1));
            }

            return Rating.update(
              rating,
              { returning: true, where: ratingIdFilter }
            );
          })
          .then(rows => {
            if (rows && rows.length > 0) {
              // console.log('Rating updated', rows[1][0].get());
              resolve(rows[1][0].get());
            } else {
              console.log('Review metadata rating failed to be updated');
              reject();
            }
          })
          .catch(error => {
            console.log('updateMetadata updating rating error:', error);
            reject(error);
          });
        }
      }
    });
  };


  const incrementRecommended = (recommended, recommendedId) => {
    return updateRecommended(recommended, recommendedId, true);
  };

  const decrementRecommended = (recommended, recommendedId) => {
    return updateRecommended(recommended, recommendedId, false);
  };

  const updateRecommended = (recommended, recommendedId, increment = true) => {
    return new Promise((resolve, reject) => {
      if (recommended !== undefined || recommended !== null) {
        const recommendedProperty = recommended ? 'true' : 'false';

        if (!recommendedId) {
          const recommendedEntry = {};
          recommendedEntry[recommendedProperty] = 1;
          Recommended.create(recommendedEntry)
          .then(row => {
            resolve(row.get());
          })
          .catch(error => {
            console.log('Review metadata rating failed to be created', error);
            reject(error);
          });
        } else {
          const recommendedIdFilter = { id: recommendedId };

          Recommended.findOne({ where: recommendedIdFilter })
          .then(row => {
            let recommendedEntry = row.get();
            if (recommendedEntry[recommendedProperty] === undefined || recommendedEntry[recommendedProperty] === null) {
              recommendedEntry[recommendedProperty] = 1;
            } else {
              recommendedEntry[recommendedProperty] = Math.max(0, recommendedEntry[recommendedProperty] + (increment ? 1 : -1));
            }
            return Recommended.update(
              recommendedEntry,
              { returning: true, where: recommendedIdFilter }
            );
          })
          .then(rows => {
            if (rows && rows.length > 0) {
              // console.log('Recommended updated', rows[1][0].get());
              resolve(rows[1][0].get());
            } else {
              console.log('Review metadata recommendations failed to be updated');
              reject();
            }
          })
          .catch(error => {
            console.log('updateMetadata updating recommendations error:', error);
            reject(error);
          });
        }
      } else {
        resolve();
      }
    });
  };


  const incrementCharacteristicsRating = (characteristics, metadataCharacteristics) => {
    return updateCharacteristicsRating(characteristics, metadataCharacteristics, true);
  };

  const decrementCharacteristicsRating = (characteristics, metadataCharacteristics) => {
    return updateCharacteristicsRating(characteristics, metadataCharacteristics, false);
  };

  const updateCharacteristicsRating = (characteristics, metadataCharacteristics, increment = true, index = 0) => {
    return new Promise( (resolve, reject) => {
      if (characteristics && index === characteristics.length) {
        resolve(true);
      } else if (characteristics && metadataCharacteristics && index < characteristics.length) {
        const getMetadataCharacteristic = (metadataCharacteristics, characteristicId) => {
          for (let j = 0; j < metadataCharacteristics.length; j++) {
            if (metadataCharacteristics[j].id === parseInt(characteristicId)) {
              return metadataCharacteristics[j];
            }
          }
        }

        const incrementDecrement = (characteristicValue, metadataCharacteristic) => {
          return new Promise((resolve, reject) => {
            if (increment) {
              incrementRatings(characteristicValue, metadataCharacteristic.rating.id)
              .then(result => resolve(result))
              .catch(error => {
                console.log('Error incrementing', error);
                reject(error);
              })
            } else {
              decrementRatings(characteristicValue, metadataCharacteristic.rating.id)
              .then(result => resolve(result))
              .catch(error => {
                console.log('Error incrementing', error);
                reject(error);
              })
            }
          });
        };

        const characteristic = characteristics[index];
        let characteristicId = Object.keys(characteristic)[0];
        let characteristicValue = characteristic[characteristicId];
        if (!parseInt(characteristicId)) {
          // ID is not the numerical ID for metadata characteristics, so it is to be taken from review characteristic
          // TODO: This is bad. Hackish & hardcoded. Refactor method to be better.
          characteristicId = characteristic[characteristicId];
          characteristicValue = characteristic['rating'];
        }

        let metadataCharacteristic = getMetadataCharacteristic(metadataCharacteristics, characteristicId);
        if (metadataCharacteristic) {
          if (metadataCharacteristic.rating_id === null) {
            addRating(characteristicValue, 1)
            .catch(error => {
              console.log(`Error in adding rating for characteristic ${characteristic} for metadata characteristic ${metadataCharacteristic}`, error);
              reject(error);
            })
            .then(rating => {
              metadataCharacteristic.rating_id = rating.id;
              metadataCharacteristic.rating = rating;

              Characteristic.update(
                { rating_id: rating.id },
                { returning: true, where: { characteristic_id:  characteristicId }})
              .then(() => updateCharacteristicsRating(characteristics, metadataCharacteristics, increment, ++index))
              .then(() => resolve(true))
              .catch(error => {
                console.log(`Error in incrementing/decrementing rating for characteristic ${characteristic} for metadata characteristic ${metadataCharacteristic}`, error);
                reject(error);
              });
            })
          } else {
            incrementDecrement(characteristicValue, metadataCharacteristic)
            .then(() => updateCharacteristicsRating(characteristics, metadataCharacteristics, increment, ++index))
            .then(() => resolve(true))
            .catch(error => {
              console.log(`Error in incrementing/decrementing rating for characteristic ${characteristic} for metadata characteristic ${metadataCharacteristic}`, error);
              reject(error);
            })
          }
        } else {
          console.log('Metadata characteristic not found! For characteristic', characteristic);
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
  };

  // ===== Delete Methods =====

  return {
    addReview,
    getProductReviews,
    getReview,
    getReviewMetadata,
    getProfile,
    getPhoto,
    getCharacteristic,
    reportReview,
    markReviewHelpful
  };
}