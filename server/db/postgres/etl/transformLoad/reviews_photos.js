// Add reviews_photos (2,742,540 entries - 476 MB)
//    generates all photos
//    adds associations for photos to reviews
module.exports = (db, filename = 'reviews_photos.csv') => {
  const {
    Photo,
    ReviewToPhoto,
    Review } = db;

  // {
  //   id: '1',
  //   review_id: '5',
  //   url: 'https://images.unsplash.com/photo-1560570803-7474...'
  // }
  const transformAndLoad = (json, lineNumber) => {
    return new Promise((resolve, reject) => {
      ReviewToPhoto.findOne({ where: {
        review_id: json.review_id,
        photo_id: json.id,
      }})
      .then(row => {
        const reviewToPhoto = row?.get();
        if (reviewToPhoto) {
          resolve(reviewToPhoto);
        } else {
          createReviewsPhotos(json, filename, lineNumber)
          .then(reviewToPhoto => resolve(reviewToPhoto))
          .catch(error => reject(error));
        }
      })
    });
  };

  const createReviewsPhotos = (json, lineNumber) => {
    return new Promise((resolve, reject) => {
      // TODO: Repeated code from characteristic_reviews. Maybe factor this out?
      const reviewIdExternal = parseInt(json.review_id);
      const getReviewId = new Promise((resolve, reject) => {
        Review.findOne({ where: {review_id: reviewIdExternal }})
        .then(review => {
          const reviewId = review.id;
          if (reviewId) {
            // console.log('Review.findOne: ', reviewId);
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

      const photoIdExternal = parseInt(json.id)
      const getPhotoId = new Promise((resolve, reject) => {
        Photo.findOrCreate({
          where: { photo_id: photoIdExternal },
          defaults: {
            photo_id: photoIdExternal,
            url: json.url
          }
        })
        .then(rows => {
          const photo = rows[0]?.get();
          const created = rows[1];
          if (!photo) {
            console.log('Failed to create photo for external ID: ', photoIdExternal);
            reject();
          } else if (created) {
            // console.log('Added photo: ', photo.id)
          } else {
            // console.log('Found existing photo: ', photo.id)
          }
          resolve(photo.id);
        })
        .catch(error => {
          console.log(`Failed to find photo for external ID ${photoIdExternal}`, error);
          reject(error);
        });
      });

      Promise.all([getReviewId, getPhotoId])
      .then(ids => {
        const reviewId = ids[0];
        // console.log('reviewId: ', reviewId);
        const photoId = ids[1];
        // console.log('photoId: ', photoId);

        const association = {
          review_id: reviewId,
          photo_id: photoId
        };

        ReviewToPhoto.findOrCreate({
          where: association,
          defaults: association
        })
        .then(result => {
          const reviewToPhoto = result[0].get();
          // console.log('ReviewToPhoto.findOrCreate: ', reviewToPhoto);
          resolve(reviewToPhoto);
        })
        .catch(error => {
          console.log(`ReviewToPhoto.findOrCreate failed to create review-photo association: ${reviewIdExternal}-${photoIdExternal} for line # ${lineNumber}`, error);
          reject(error);
        })
      })
      .catch(error => {
        console.log(`Failed to get supporting IDs & create review-photo association: ${reviewIdExternal}-${photoIdExternal} for line # ${lineNumber}`, error);
        reject(error);
      });
    })
  };

  return {
    filename,
    transformAndLoad
  };
}