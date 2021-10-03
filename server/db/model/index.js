const adaptor = require('./adaptor.js');

// This will control requests between server and primary/secondary dabatases.
  // This may be turned into a class later with state if that helps with queries.
  // If data is kept in sync between databases, then this can also be used for:
  //    Falling back to the other database if the first one fails on a query step
  //    Making concurrent calls to the DBs and returning whichever one returns first?


// TODO: Improvement: GetReviewsBatch ? Includes metadata in response

// ===== FOR ALL METHODS =====
// 1. Receives input contract object needed for db controller based on URL params/query. Other data left raw.
// 2. Completes forming contract object for sending to either DB
// 3. Makes DB request to the appropriate database
// 4. Receives DB request in output contract object and sends it back
module.exports = (envOrConfigIn) => {
  const dbPrimaryInit = () => new Promise(resolve => resolve()); //require('../mongo')(envOrConfigIn); // TODO: Uncomment this once Mongo is ready
  const dbSecondaryInit = require('../postgres')(envOrConfigIn);
  // console.log('dbSecondaryInit: ', dbSecondaryInit);
  return () => {
    return new Promise((resolve, reject) => {
      Promise.all([
        dbPrimaryInit(),
        dbSecondaryInit()
      ])
      .then(databases => {
        const dbPrimary = databases[0];
        const dbSecondary = databases[1];

        // console.log('databases: ', databases);

        const dbModel = {
          primary: dbPrimary,
          secondary: dbSecondary,
          methods: {}
        };

        // console.log('dbModel: ', dbModel);

        const usePrimaryDB = false;
        dbModel.usePrimaryDB = usePrimaryDB;

        const getProductReviews = (productIdOrObject, page, count, sortBy) => {
          let productId = productIdOrObject;
          if (typeof productIdOrObject === 'object') {
            productId = productIdOrObject.productId;
            page = productIdOrObject.page;
            count = productIdOrObject.count;
            sortBy = productIdOrObject.sortBy;
          }
          console.log('getProductReviews');
          console.log('productId: ', productId);
          // { product_id: productId }
          return new Promise( (resolve, reject) => {
            const productReviewRequest = adaptor.productReviewsRequestFromServerToDatabase(productId, page, count, sortBy);
            console.log('productReviewRequest: ', productReviewRequest);
            let filter = undefined; // TODO sort this out, including location of definition

            let db = usePrimaryDB ? dbPrimary.methods : dbSecondary.methods;
            console.log('dbModel: ', dbModel);
            console.log('dbSecondary: ', dbSecondary);
            console.log('db used: ', db);

            db.getProductReviews(productReviewRequest, filter)
            .then(results => {
              console.log('db.getProductReviews results: ', results);
              resolve(results);
            })
            .catch(error => {
              console.log('getProductReviews error:', error);
              reject(error);
            })
          });
        }
        dbModel.methods.getProductReviews = getProductReviews;

        const getReview = (reviewId, getCharacteristics = true) => {
          // { review_id: reviewId }
          return new Promise( (resolve, reject) => {
            console.log('reviewId in controller', reviewId);
              let db = usePrimaryDB ? dbPrimary.methods : dbSecondary.methods;
              // TODO: Later return the appropriate id filter based on the database used via a function, rather than hard-coded
              let reviewIdFilter = { review_id: reviewId};

              db.getReview(reviewIdFilter, getCharacteristics)
              .then(result => {
                resolve(result);
              })
              .catch(error => {
                console.log('getReview error:', error);
                reject(error);
              })
              resolve();
          });
        }
        dbModel.methods.getReview = getReview;

        const getReviewMetadata = (productId) => {
          // { product_id: productId }
          return new Promise( (resolve, reject) => {
            let db = usePrimaryDB ? dbPrimary.methods : dbSecondary.methods;
            // TODO: Later return the appropriate id filter based on the database used via a function, rather than hard-coded
            let productIdFilter = { product_id: productId};

            db.getReviewMetadata(productIdFilter)
            .then(result => {
              resolve(result);
            })
            .catch(error => {
              console.log('getReviewMetadata error:', error);
              reject(error);
            })
          });
        }
        dbModel.methods.getReviewMetadata = getReviewMetadata;

        const reportReview = (reviewId) => {
          // { review_id: reviewId }
          return new Promise( (resolve, reject) => {
            let db = usePrimaryDB ? dbPrimary.methods : dbSecondary.methods;

            let reviewIdFilter = { review_id: reviewId};
            db.reportReview(reviewIdFilter)
            .then(() => {
              resolve();
            })
            .catch(error => {
              console.log('reportReview error:', error);
              reject(error);
            })
          });
        }
        dbModel.methods.reportReview = reportReview;

        const markReviewHelpful = (reviewId) => {
          // { review_id: reviewId }
          return new Promise( (resolve, reject) => {
            let db = usePrimaryDB ? dbPrimary.methods : dbSecondary.methods;

            let reviewIdFilter = { review_id: reviewId};
            db.markReviewHelpful(reviewIdFilter)
            .then(() => {
              resolve();
            })
            .catch(error => {
              console.log('markReviewHelpful error:', error);
              reject(error);
            })
          });
        }
        dbModel.methods.markReviewHelpful = markReviewHelpful;

        const addReview = (reviewServer) => {
          return new Promise( (resolve, reject) => {
            const review = adaptor.reviewFromServerToDatabase(reviewServer);
            let db = usePrimaryDB ? dbPrimary.methods : dbSecondary.methods;

            db.addReview(review)
            .then(() => {
              resolve();
            })
            .catch(error => {
              console.log('addReview error:', error);
              reject(error);
            })
          });
        }
        dbModel.methods.addReview = addReview;

        // console.log('dbModel: ', dbModel);
        resolve(dbModel);
      })
      .catch(error => {
        console.log('Error initializing databases in controller', erorr);
        reject(error);
      })
    });
  };

  // const dbPrimary = require('../mongo')(envOrConfigIn);
  // const dbSecondary = require('../postgres')(envOrConfigIn);
}