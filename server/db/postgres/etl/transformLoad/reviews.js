// Add reviews (5,774,952 entries - 2.87 GB)
//    generates all profiles, reviews
//    generates data for metadata
//      generates recommended, ratings (for product, for characteristic)
module.exports = (db, filename = 'reviews.csv') => {
  const {
    Product,
    Profile,
    Review,
    ReviewMetadata } = db;

  // {
  //   id: '2',
  //   product_id: '1',
  //   rating: '4',
  //   date: '1610178433963',
  //   summary: 'This product was ok!',
  //   body: 'I really did not like this product solely because I am tiny and do not fit into it.',
  //   recommend: 'false',
  //   reported: 'false',
  //   reviewer_name: 'mymainstreammother',
  //   reviewer_email: 'first.last@gmail.com',
  //   response: 'null',
  //   helpfulness: '2'
  // }
  const transformAndLoad = (json, lineNumber) => {
    return new Promise((resolve, reject) => {
      const getProfileId = new Promise((resolve, reject) => {
        console.log('getProfileId:', json.reviewer_name);
        Profile.findOrCreate({
          where: { username: json.reviewer_name },
          defaults: {
            username: json.reviewer_name,
            email: json.reviewer_email
          }
        })
        .then(rows => {
          const profile = rows[0]?.get();
          if (profile) {
            console.log('Added profile: ', profile.id);
            resolve(profile.id);
          } else {
            console.log('Failed to add profile for username: ', json.reviewer_name);
            console.log(error);
            reject(error);
          }
        })
        .catch(error => {
          console.log(`Failed to add file ${fileName} to Postgres database at line #${lineNumber}`, error);
          reject(error);
        });
      })

      const getProductId = new Promise((resolve, reject) => {
        const productId = json.product_id;
        console.log('getProductId:', productId);

        Product.findOrCreate({
          where: { product_id: productId },
          defaults: { product_id: productId }
        })
        .then(rows => {
          const product = rows[0].get();
          const created = rows[1];
          if (created) {
            ReviewMetadata.findOrCreate({
              where: { product_id: product.id },
              defaults: { product_id: product.id }
            })
            .then(() => {
              console.log('Created product & metadata for product external ID: ', product.id);
              resolve(product.id);
            })
            .catch(error => {
              console.log(`Failed to add metadata corresponding to product external ID ${productId}`, error);
              reject(error);
            });
          } else {
            console.log('Found product for external ID: ', product.id);
            resolve(product.id);
          }
        })
        .catch(error => {
          console.log(`Failed to add product or get product ID corresponding to product external ID ${productId}`, error);
        })
      });

      //  Add to Reviews table in a way to trigger update of ReviewMetadata
      Promise.all([getProfileId, getProductId])
      .then(ids => {
        const profileId = ids[0];
        const productId = ids[1];
        const createdAt = new Date(parseInt(json.date));
        console.log('Creating review for ');
        console.log('Product ID: ', productId);

        const reviewIdExternal = parseInt(json.id);
        const rating = parseInt(json.rating);
        const response = json.response === 'null' ? null : json.response;
        const reported = eval(json.reported);
        const recommend = eval(json.recommend);
        const helpfulness = parseInt(json.helpfulness);

        Review.findOrCreate({
          where: { review_id: reviewIdExternal },
          defaults: {
            review_id: reviewIdExternal,
            product_id: productId,
            profile_id: profileId,
            date: createdAt,
            rating: rating,
            summary: json.summary,
            body: json.body,
            recommend: recommend,
            reported: reported,
            response: response,
            helpfulness: helpfulness
          }
        })
        .then(rows => {
          const review = rows[0]?.get();
          const created = rows[1];
          if (!review) {
            console.log('Failed to create review for external ID: ', reviewIdExternal);
            reject();
          } else if (created) {
            console.log('Added review: ', review.id)
          } else {
            console.log('Found existing review: ', review.id)
          }
          resolve(review);
        })
      })
      .catch(error => {
        console.log(`Failed to get supporting IDs and add review ${json.id} for line # ${lineNumber}`, error);
        reject(error);
      });
    })
  };

  return {
    filename,
    transformAndLoad
  };
}