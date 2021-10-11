// This module creates data derived from existing data in the database
module.exports = (db) => {
  const {
    Product,
    Review,
    Characteristic,
    Recommended,
    Rating,
    ReviewMetadata } = db;

    const getCharacteristics = (review_metadata_id) => {
      return new Promise((resolve, reject) => {
        Characteristic.findAll({ where: { review_metadata_id } })
        .then(rows => {
          if (rows === null || rows.length === 0) {
            console.log('No characteristics found!', { review_metadata_id });
            resolve();
          } else {
            let characteristics = [];
            rows.forEach(row => {
              characteristics.push(row.get());
            });
            resolve(characteristics);
          }
        })
        .catch(error => {
          console.log('ReviewMetadata getCharacteristic error:', error);
          reject(error);
        });
      });
    }

    const getReviewMetadata = () => {
      return new Promise((resolve, reject) => {
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

            const productRating = {

            }

            //   For each review id
            reviews.forEach(review => {
            // 2a. Update product rating
            //    { /
                  // star_0: null,
                  // star_1: null,
                  // star_2: 1,
                  // star_3: null,
                  // star_4: null,
                  // star_5: null,
                  //}
                  // 2b. Update product recommended
                  // {
                  //   true: 3,
                  //   false: 5,
                  // }
                  // 2c. For each review characteristic
                  // update count in rating id for characteristic id
            })

        // 3. For each characteristic id, calculate value from rating
          }
        })
        .catch(error => {
          console.log('ReviewMetadata getReview error:', error);
          reject(error);
        });
      });
    }

    const updateProductMetadata = (product_id) => {
      ReviewMetadata.findOne({ where: { product_id } })
      .then(row => {
        const reviewMetadata = row.get();

        if (reviewMetadata.rating_id && reviewMetadata.recommended_id) {
          // Metadata already exists, skip
          resolve();
        } else {
          const review_metadata_id = reviewMetadata.id;

          // 1. Get all characteristic ids
          // 2. Get all review ids
          // 4. Asychronously:
          Promise.all([
            getCharacteristics(review_metadata_id),
            getReviewMetadata(product_id)
          ])
          .then(results => {
            const characteristics = results[0];
            const reviewMetadata = results[1];
          //    4a. Update each characterstic id with calculated value
          //    4b. Asynchronously:
          //      4ba. Create new product rating & get id
          //      4bb. Create new recommended rating & get id
          //      4bc. Update metadata table with ids
          })

        }
      })
    };
    // 5. Next product
}

