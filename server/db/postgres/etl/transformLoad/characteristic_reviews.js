const db = require('../../models');

const {
  Characteristic,
  Review,
  ReviewToCharacteristic } = db;

// Add characteristic_reviews (19,327,575 entries - 1.58 GB)
//    adds associations for characteristics to reviews
//    generates data for these associations

const fileName = 'characteristic_reviews.csv';
module.exports.fileName = fileName;

// { id: '1', characteristic_id: '1', review_id: '1', value: '4' }
module.exports.transformAndLoad = (json, lineNumber) => {
  return new Promise((resolve, reject) => {
    const reviewIdExternal = parseInt(json.review_id);
    const getReviewId = new Promise((resolve, reject) => {
      Review.findOne({ where: {review_id: reviewIdExternal }})
      .then(review => {
        const reviewId = review.id;
        if (reviewId) {
          console.log('Review.findOne: ', reviewId);
          resolve(reviewId);
        } else {
          console.log(`Review.findOne failed to find review for external ID ${reviewIdExternal}`, error);
          reject(error);
        }
      })
      .catch(error => {
        console.log(`Failed to find review for external ID ${reviewIdExternal}`, error);
        reject(error);
      });
    });

    const characteristicIdExternal = parseInt(json.characteristic_id);
    const getCharacteristicId = new Promise((resolve, reject) => {
      Characteristic.findOne({ where: { characteristic_id: characteristicIdExternal }})
      .then(characteristic => {
        const characteristicId = characteristic.id;
        if (characteristicId) {
          console.log('Characteristic.findOne: ', characteristicId);
          resolve(characteristicId);
        } else {
          console.log(`Characteristic.findOne failed to find characteristic for external ID ${characteristicIdExternal}`);
          reject(error);
        }
      })
      .catch(error => {
        console.log(`Failed to find characteristic for external ID ${characteristicIdExternal}`, error);
        reject(error);
      });
    });

    Promise.all([getReviewId, getCharacteristicId])
    .then(ids => {
      const reviewId = ids[0];
      console.log('reviewId: ', reviewId);
      const characteristicId = ids[1];
      console.log('characteristicId: ', characteristicId);
      const rating = parseInt(json.value);
      console.log('rating: ', rating);

      ReviewToCharacteristic.findOrCreate({
        where: {
          characteristic_id: characteristicId,
          review_id: reviewId
        },
        defaults: {
          characteristic_id: characteristicId,
          review_id: reviewId,
          rating: rating
        }
      })
      .then(result => {
        const reviewToCharacteristic = result[0].get();
        console.log('ReviewToCharacteristic.findOrCreate: ', reviewToCharacteristic);
        resolve(reviewToCharacteristic);
      })
      .catch(error => {
        console.log(`ReviewToCharacteristic.findOrCreate failed to create review-characteristic association: ${reviewIdExternal}-${characteristicIdExternal} for line # ${lineNumber}`, error);
        console.log(where);
        console.log(defaults);
        reject(error);
      })
    })
    .catch(error => {
      console.log(`Failed to get supporting IDs and to create review-characteristic association: ${reviewIdExternal}-${characteristicIdExternal} for line # ${lineNumber}`, error);
      reject(error);
    });
  });
};