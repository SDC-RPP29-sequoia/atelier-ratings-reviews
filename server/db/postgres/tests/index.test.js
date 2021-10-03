import postgres from '../index.js';

const postgresInit = postgres('test');

let postgresDB;
let db;

// ==== Test Template ====
// For Jest usage, see: https://jestjs.io/docs/getting-started
describe('postgres tests', function () {
  beforeAll(() => {
    return new Promise((resolve, reject) => {
      postgresInit(() => console.log('Postgres is ready for testing!'))
      .then((postgres) => {
        postgresDB = postgres;
        db = postgresDB.methods;
        resolve();
      })
      .catch(error => {
        console.log('Postgres had an error initializing', error);
        reject(error);
      });
    });

  });

  afterAll(() => {
    return new Promise((resolve, reject) => {
      if (postgresDB) {
        postgresDB.closeDatabase()
        .then(() => {
          console.log('Postgres connection has closed');
          resolve();
        })
        .catch(error => {
          console.log('Postgres had an error closing', error);
          reject(error);
        });
      } else {
        console.log('No instance of postgres exists to close!');
        reject();
      }
    })
  });

  // ===== Create Methods =====
  describe('addReview', function () {
    it('Adds a review to the database', done => {
      let reviewAdded = {
        product_id: 8,
        name: 'reviewAdder1',
        email: 'foo.bar1@gmail.com',
        rating: 2,
        recommend: true,
        body: 'Foo bar et al ad hominem',
        date: new Date()
      };

      db.addReview(reviewAdded)
      .then(() => {
        done();
      })
      .catch(error => done(error));
    });

    it('Adds the reviewer as a new user if they aren\'t already in the database', done => {
      let reviewAdded = {
        product_id: 8,
        name: 'newUser',
        email: 'new@user.com',
        rating: 3,
        recommend: true,
        summary: 'Bleep blorp!',
        body: 'Foo bar et al ad hominem',
        date: new Date()
      };

      let profileExpected = {
        username: 'newUser',
        email: 'new@user.com',
      };

      db.getProfile({ username: reviewAdded.name })
      .then(profile => {
        expect(profile).toBeUndefined();
      })
      .then(() => db.addReview(reviewAdded))
      .then(() => db.getProfile({ username: reviewAdded.name }))
      .then(profile => {
        expect(profile).toBeDefined();
        expect(profile).toEqual(expect.objectContaining(profileExpected));
        done();
      })
      .catch(error => done(error));
    });

    it('Adds photos to the database if included', done => {
      let reviewAdded = {
        product_id: 8,
        name: 'newUser2',
        email: 'new@user2.com',
        rating: 0,
        recommend: true,
        summary: 'Bleep blorp!',
        body: 'Foo bar et al ad hominem',
        date: new Date(),
        photos: [
          'http://picasa.com/mrFancyPants.jpg',
          'http://picasa.com/mrFancyPants2.jpg',
          'http://picasa.com/mrFancyPants3.jpg'
        ]
      };

      Promise.all([
        db.getPhoto({ url: reviewAdded.photos[0] }),
        db.getPhoto({ url: reviewAdded.photos[1] }),
        db.getPhoto({ url: reviewAdded.photos[2] })
      ])
      .then(photos => {
        expect(photos[0]).toBeUndefined();
        expect(photos[1]).toBeUndefined();
        expect(photos[2]).toBeUndefined();
      })
      .then(() => db.addReview(reviewAdded))
      .then(() => {
        Promise.all([
          db.getPhoto({ url: reviewAdded.photos[0] }),
          db.getPhoto({ url: reviewAdded.photos[1] }),
          db.getPhoto({ url: reviewAdded.photos[2] })
        ])
        .then(photos => {
          expect(photos[0]).toBeDefined();
          expect(photos[1]).toBeDefined();
          expect(photos[2]).toBeDefined();
          done();
        })
      })
      .catch(error => done(error));
    });

    it('Adds characteristic rating if provided and none yet given.', done => {
      let reviewAdded = {
        product_id: 8,
        name: 'reviewAdder5',
        email: 'foo.bar5@gmail.com',
        rating: 4,
        summary: 'Bleep blorp!',
        recommend: true,
        body: 'Foo bar et al ad hominem',
        date: new Date(),
        characteristics: [
          { 15: 2 }
        ]
      };

      db.getCharacteristic({ characteristic_id: 15 })
      .then(characteristic => {
        expect(characteristic.rating_id).toBeNull();
      })
      .then(() => db.addReview(reviewAdded))
      .then(() => db.getCharacteristic({ characteristic_id: 15 }))
      .then(characteristic => {
        expect(characteristic.rating_id).toBeDefined();
        done();
      })
      .catch(error => done(error));
    });

  //   // // TBD: What happens if the existing user's email is different in the review?
  //   // it('', done => {
  //   // });

  //   // // TBD: What happens if the existing user submits more than one review?
  //   // it('', done => {
  //   // });


    it('Updates the metadata of the associated product. Also adds rating to characteristic if null.', done => {
      let reviewAdded = {
        product_id: 12,
        name: 'reviewAdder6',
        email: 'foo.bar6@gmail.com',
        rating: 2,
        summary: 'Bleep blorp!',
        recommend: true,
        body: 'Foo bar et al ad hominem',
        date: new Date(),
        characteristics: [
          { 17: 5 },
          { 18: 4 }
        ]
      };

      let metadataInitialExpected = {
        product_id: 12,
        ratings: {
          4: 3
        },
        recommended: {
          true: 1,
          false: 1
        },
        characteristics: {
          Comfort: {
            id: 17,
            value: null,
          },
          Quality: {
            id: 18,
            value: 2,
          }
        }
      };

      let metadataFinalExpected = {
        product_id: 12,
        ratings: {
          4: 3,
          2: 1
        },
        recommended: {
          true: 2,
          false: 1
        },
        characteristics: {
          Comfort: {
            id: 17,
            value: 5,
          },
          Quality: {
            id: 18,
            value: 3,
          }
        }
      };

      let productIdFilter = { product_id: metadataInitialExpected.product_id };

      db.getReviewMetadata(productIdFilter)
      .then(metadata => {
        expect(metadata).toEqual(expect.objectContaining(metadataInitialExpected));
      })
      .then(() => db.addReview(reviewAdded))
      .then(() => db.getReviewMetadata(productIdFilter))
      .then(metadata => {
        expect(metadata).toEqual(expect.objectContaining(metadataFinalExpected));
        done();
      })
      .catch(error => done(error));
    });
  });

  // ===== Read Methods =====
  // Has no reviews (3)
  // Contains reported review, review with photos, review with characteristics ratings (4)
  describe('getProductReviews', function () {
    it('Returns an array of reviews associated with a product by product public id', done => {
        let productReviewsExpected = {
          product: 1,
          page: 1,
          count: 5,
          results: [
            {
              review_id: 1,
              reviewer_name: 'funtime',
              rating: 5,
              summary: 'This product was great!',
              recommend: true,
              response: null,
              body: 'I really did or did not like this product based on whether it was sustainably sourced.  Then I found out that its made from nothing at all.',
              date: new Date(1596080481467),
              helpfulness: 8
            },
            {
              review_id: 2,
              reviewer_name: 'mymainstreammother',
              rating: 4,
              summary: 'This product was ok!',
              recommend: false,
              response: null,
              body: 'I really did not like this product solely because I am tiny and do not fit into it.',
              date: new Date(1610178433963),
              helpfulness: 2
            }
          ]
        };

        let productReviewRequest = {
          product_id: productReviewsExpected.product,
          page: productReviewsExpected.page,
          count: productReviewsExpected.count,
          sortBy: 'newest' };

        db.getProductReviews(productReviewRequest)
        .then(productReviews => {
          expect(productReviews).toBeDefined();
          expect(productReviews).toEqual(expect.objectContaining(productReviewsExpected));
          done();
        })
        .catch(error => done(error));
    });

  //   // TBD
  //   it('Returns an array of reviews, with some existing reviews with photo data for a review with photos', done => {
  //     // let productReviewsExpected = {
  //     //   product: 1,
  //     //   page: 1,
  //     //   count: 5,
  //     //   results: [
  //     //     {
  //     //       review_id: 1,
  //     //       product_id: 1,
  //     //       profile_id: 4,
  //     //       rating: 5,
  //     //       summary: 'This product was great!',
  //     //       recommend: true,
  //     //       response: null,
  //     //       body: 'I really did or did not like this product based on whether it was sustainably sourced.  Then I found out that its made from nothing at all.',
  //     //       date: new Date(1596080481467),
  //     //       helpfulness: 8,
  //     //       photos: [],
  //     //     },
  //     //     {
  //     //       review_id: 2,
  //     //       product_id: 1,
  //     //       profile_id: 5,
  //     //       rating: 4,
  //     //       summary: 'This product was ok!',
  //     //       recommend: false,
  //     //       response: null,
  //     //       body: 'I really did not like this product solely because I am tiny and do not fit into it.',
  //     //       date: new Date(1610178433963),
  //     //       helpfulness: 2,
  //     //       photos: []
  //     //     }
  //     //   ]
  //     // };

  //     // let productIdFilter = { product_id: productReviewsExpected.product };
  //     // db.getProductReviews(productIdFilter).then(productReviews => {
  //     //   expect(productReviews).toBeDefined();
  //     //   expect(productReviews).toEqual(expect.objectContaining(productReviewsExpected));
  //     //   console.log(review);
  //     //   done();
  //     // })
  //     // .catch(error => done(error));
  //   });

  //   // TBD
  //   it('Returns an array of reviews associated with a product by product public id, with reported reviews missing', done => {
  //     // let productReviewsExpected = {
  //     //   product: 1,
  //     //   page: 1,
  //     //   count: 5,
  //     //   results: [
  //     //     {
  //     //       review_id: 1,
  //     //       product_id: 1,
  //     //       profile_id: 4,
  //     //       rating: 5,
  //     //       summary: 'This product was great!',
  //     //       recommend: true,
  //     //       response: null,
  //     //       body: 'I really did or did not like this product based on whether it was sustainably sourced.  Then I found out that its made from nothing at all.',
  //     //       date: new Date(1596080481467),
  //     //       helpfulness: 8,
  //     //       photos: [],
  //     //     },
  //     //     {
  //     //       review_id: 2,
  //     //       product_id: 1,
  //     //       profile_id: 5,
  //     //       rating: 4,
  //     //       summary: 'This product was ok!',
  //     //       recommend: false,
  //     //       response: null,
  //     //       body: 'I really did not like this product solely because I am tiny and do not fit into it.',
  //     //       date: new Date(1610178433963),
  //     //       helpfulness: 2,
  //     //       photos: []
  //     //     }
  //     //   ]
  //     // };

  //     // let productIdFilter = { product_id: productReviewsExpected.product };
  //     // db.getProductReviews(productIdFilter).then(productReviews => {
  //     //   expect(productReviews).toBeDefined();
  //     //   expect(productReviews).toEqual(expect.objectContaining(productReviewsExpected));
  //     //   console.log(review);
  //     //   done();
  //     // })
  //     // .catch(error => done(error));
  //   });

  //   // TBD
  //   it('Returns an array of reviews sorted by newest', done => {
  //     // let productReviewsExpected = {
  //     //   product: 1,
  //     //   page: 1,
  //     //   count: 5,
  //     //   results: [
  //     //     {
  //     //       review_id: 1,
  //     //       product_id: 1,
  //     //       profile_id: 4,
  //     //       rating: 5,
  //     //       summary: 'This product was great!',
  //     //       recommend: true,
  //     //       response: null,
  //     //       body: 'I really did or did not like this product based on whether it was sustainably sourced.  Then I found out that its made from nothing at all.',
  //     //       date: new Date(1596080481467),
  //     //       helpfulness: 8,
  //     //       photos: [],
  //     //     },
  //     //     {
  //     //       review_id: 2,
  //     //       product_id: 1,
  //     //       profile_id: 5,
  //     //       rating: 4,
  //     //       summary: 'This product was ok!',
  //     //       recommend: false,
  //     //       response: null,
  //     //       body: 'I really did not like this product solely because I am tiny and do not fit into it.',
  //     //       date: new Date(1610178433963),
  //     //       helpfulness: 2,
  //     //       photos: []
  //     //     }
  //     //   ]
  //     // };

  //     // let productIdFilter = { product_id: productReviewsExpected.product };
  //     // db.getProductReviews(productIdFilter).then(productReviews => {
  //     //   expect(productReviews).toBeDefined();
  //     //   expect(productReviews).toEqual(expect.objectContaining(productReviewsExpected));
  //     //   console.log(review);
  //     //   done();
  //     // })
  //     // .catch(error => done(error));
  //   });

  //   // TBD
  //   it('Returns an array of reviews sorted by helpful', done => {
  //     // let productReviewsExpected = {
  //     //   product: 1,
  //     //   page: 1,
  //     //   count: 5,
  //     //   results: [
  //     //     {
  //     //       review_id: 1,
  //     //       product_id: 1,
  //     //       profile_id: 4,
  //     //       rating: 5,
  //     //       summary: 'This product was great!',
  //     //       recommend: true,
  //     //       response: null,
  //     //       body: 'I really did or did not like this product based on whether it was sustainably sourced.  Then I found out that its made from nothing at all.',
  //     //       date: new Date(1596080481467),
  //     //       helpfulness: 8,
  //     //       photos: [],
  //     //     },
  //     //     {
  //     //       review_id: 2,
  //     //       product_id: 1,
  //     //       profile_id: 5,
  //     //       rating: 4,
  //     //       summary: 'This product was ok!',
  //     //       recommend: false,
  //     //       response: null,
  //     //       body: 'I really did not like this product solely because I am tiny and do not fit into it.',
  //     //       date: new Date(1610178433963),
  //     //       helpfulness: 2,
  //     //       photos: []
  //     //     }
  //     //   ]
  //     // };

  //     // let productIdFilter = { product_id: productReviewsExpected.product };
  //     // db.getProductReviews(productIdFilter).then(productReviews => {
  //     //   expect(productReviews).toBeDefined();
  //     //   expect(productReviews).toEqual(expect.objectContaining(productReviewsExpected));
  //     //   console.log(review);
  //     //   done();
  //     // })
  //     // .catch(error => done(error));
  //   });

  //   // TBD
  //   it('Returns an array of reviews sorted by relevant', done => {
  //     // let productReviewsExpected = {
  //     //   product: 1,
  //     //   page: 1,
  //     //   count: 5,
  //     //   results: [
  //     //     {
  //     //       review_id: 1,
  //     //       product_id: 1,
  //     //       profile_id: 4,
  //     //       rating: 5,
  //     //       summary: 'This product was great!',
  //     //       recommend: true,
  //     //       response: null,
  //     //       body: 'I really did or did not like this product based on whether it was sustainably sourced.  Then I found out that its made from nothing at all.',
  //     //       date: new Date(1596080481467),
  //     //       helpfulness: 8,
  //     //       photos: [],
  //     //     },
  //     //     {
  //     //       review_id: 2,
  //     //       product_id: 1,
  //     //       profile_id: 5,
  //     //       rating: 4,
  //     //       summary: 'This product was ok!',
  //     //       recommend: false,
  //     //       response: null,
  //     //       body: 'I really did not like this product solely because I am tiny and do not fit into it.',
  //     //       date: new Date(1610178433963),
  //     //       helpfulness: 2,
  //     //       photos: []
  //     //     }
  //     //   ]
  //     // };

  //     // let productIdFilter = { product_id: productReviewsExpected.product };
  //     // db.getProductReviews(productIdFilter).then(productReviews => {
  //     //   expect(productReviews).toBeDefined();
  //     //   expect(productReviews).toEqual(expect.objectContaining(productReviewsExpected));
  //     //   console.log(review);
  //     //   done();
  //     // })
  //     // .catch(error => done(error));
  //   });

  //   // TBD
  //   it('Returns an array of reviews from page 2 if specified & more reviews than count on page 1', done => {
  //     // let productReviewsExpected = {
  //     //   product: 1,
  //     //   page: 1,
  //     //   count: 5,
  //     //   results: [
  //     //     {
  //     //       review_id: 1,
  //     //       product_id: 1,
  //     //       profile_id: 4,
  //     //       rating: 5,
  //     //       summary: 'This product was great!',
  //     //       recommend: true,
  //     //       response: null,
  //     //       body: 'I really did or did not like this product based on whether it was sustainably sourced.  Then I found out that its made from nothing at all.',
  //     //       date: new Date(1596080481467),
  //     //       helpfulness: 8,
  //     //       photos: [],
  //     //     },
  //     //     {
  //     //       review_id: 2,
  //     //       product_id: 1,
  //     //       profile_id: 5,
  //     //       rating: 4,
  //     //       summary: 'This product was ok!',
  //     //       recommend: false,
  //     //       response: null,
  //     //       body: 'I really did not like this product solely because I am tiny and do not fit into it.',
  //     //       date: new Date(1610178433963),
  //     //       helpfulness: 2,
  //     //       photos: []
  //     //     }
  //     //   ]
  //     // };

  //     // let productIdFilter = { product_id: productReviewsExpected.product };
  //     // db.getProductReviews(productIdFilter).then(productReviews => {
  //     //   expect(productReviews).toBeDefined();
  //     //   expect(productReviews).toEqual(expect.objectContaining(productReviewsExpected));
  //     //   console.log(review);
  //     //   done();
  //     // })
  //     // .catch(error => done(error));
  //   });

  //   // TBD
  //   it('Returns an array of reviews from page 1, even if page 2 specified, if less reviews than count on page 1', done => {
  //     // let productReviewsExpected = {
  //     //   product: 1,
  //     //   page: 1,
  //     //   count: 5,
  //     //   results: [
  //     //     {
  //     //       review_id: 1,
  //     //       product_id: 1,
  //     //       profile_id: 4,
  //     //       rating: 5,
  //     //       summary: 'This product was great!',
  //     //       recommend: true,
  //     //       response: null,
  //     //       body: 'I really did or did not like this product based on whether it was sustainably sourced.  Then I found out that its made from nothing at all.',
  //     //       date: new Date(1596080481467),
  //     //       helpfulness: 8,
  //     //       photos: [],
  //     //     },
  //     //     {
  //     //       review_id: 2,
  //     //       product_id: 1,
  //     //       profile_id: 5,
  //     //       rating: 4,
  //     //       summary: 'This product was ok!',
  //     //       recommend: false,
  //     //       response: null,
  //     //       body: 'I really did not like this product solely because I am tiny and do not fit into it.',
  //     //       date: new Date(1610178433963),
  //     //       helpfulness: 2,
  //     //       photos: []
  //     //     }
  //     //   ]
  //     // };

  //     // let productIdFilter = { product_id: productReviewsExpected.product };
  //     // db.getProductReviews(productIdFilter).then(productReviews => {
  //     //   expect(productReviews).toBeDefined();
  //     //   expect(productReviews).toEqual(expect.objectContaining(productReviewsExpected));
  //     //   console.log(review);
  //     //   done();
  //     // })
  //     // .catch(error => done(error));
  //   });

  //   // TBD
  //   it('Returns an array of reviews of specified count less than default of 5', done => {
  //     // let productReviewsExpected = {
  //     //   product: 1,
  //     //   page: 1,
  //     //   count: 5,
  //     //   results: [
  //     //     {
  //     //       review_id: 1,
  //     //       product_id: 1,
  //     //       profile_id: 4,
  //     //       rating: 5,
  //     //       summary: 'This product was great!',
  //     //       recommend: true,
  //     //       response: null,
  //     //       body: 'I really did or did not like this product based on whether it was sustainably sourced.  Then I found out that its made from nothing at all.',
  //     //       date: new Date(1596080481467),
  //     //       helpfulness: 8,
  //     //       photos: [],
  //     //     },
  //     //     {
  //     //       review_id: 2,
  //     //       product_id: 1,
  //     //       profile_id: 5,
  //     //       rating: 4,
  //     //       summary: 'This product was ok!',
  //     //       recommend: false,
  //     //       response: null,
  //     //       body: 'I really did not like this product solely because I am tiny and do not fit into it.',
  //     //       date: new Date(1610178433963),
  //     //       helpfulness: 2,
  //     //       photos: []
  //     //     }
  //     //   ]
  //     // };

  //     // let productIdFilter = { product_id: productReviewsExpected.product };
  //     // db.getProductReviews(productIdFilter).then(productReviews => {
  //     //   expect(productReviews).toBeDefined();
  //     //   expect(productReviews).toEqual(expect.objectContaining(productReviewsExpected));
  //     //   console.log(review);
  //     //   done();
  //     // })
  //     // .catch(error => done(error));
  //   });

  //   // TBD
  //   it('Returns an array of reviews of specified count more than default of 5', done => {
  //     // let productReviewsExpected = {
  //     //   product: 1,
  //     //   page: 1,
  //     //   count: 5,
  //     //   results: [
  //     //     {
  //     //       review_id: 1,
  //     //       product_id: 1,
  //     //       profile_id: 4,
  //     //       rating: 5,
  //     //       summary: 'This product was great!',
  //     //       recommend: true,
  //     //       response: null,
  //     //       body: 'I really did or did not like this product based on whether it was sustainably sourced.  Then I found out that its made from nothing at all.',
  //     //       date: new Date(1596080481467),
  //     //       helpfulness: 8,
  //     //       photos: [],
  //     //     },
  //     //     {
  //     //       review_id: 2,
  //     //       product_id: 1,
  //     //       profile_id: 5,
  //     //       rating: 4,
  //     //       summary: 'This product was ok!',
  //     //       recommend: false,
  //     //       response: null,
  //     //       body: 'I really did not like this product solely because I am tiny and do not fit into it.',
  //     //       date: new Date(1610178433963),
  //     //       helpfulness: 2,
  //     //       photos: []
  //     //     }
  //     //   ]
  //     // };

  //     // let productIdFilter = { product_id: productReviewsExpected.product };
  //     // db.getProductReviews(productIdFilter).then(productReviews => {
  //     //   expect(productReviews).toBeDefined();
  //     //   expect(productReviews).toEqual(expect.objectContaining(productReviewsExpected));
  //     //   console.log(review);
  //     //   done();
  //     // })
  //     // .catch(error => done(error));
  //   });

  //   // TBD
  //   it('Returns undefined if failing to find a product to fetch reviews for', done => {
  //     // let productIdFilter = { product_id: -1 };
  //     // db.getProductReviews(productIdFilter)
  //     // .then(review => {
  //     //   expect(review).toBeUndefined();
  //     //   done();
  //     // })
  //     // .catch(error => done(error));
  //   });
  });

  // TBD: Table join for reviewer name, characteristics, photos
  describe('getReview', function () {
    it('Returns an existing review by public review ID', done => {
      let reviewExpected = {
        review_id: 2,
        product_id: 1,
        reviewer_name: 'mymainstreammother',
        rating: 4,
        summary: 'This product was ok!',
        recommend: false,
        response: null,
        body: 'I really did not like this product solely because I am tiny and do not fit into it.',
        date: new Date(1610178433963),
        helpfulness: 2
      };

      let reviewIdFilter = { review_id: reviewExpected.review_id };
      db.getReview(reviewIdFilter).then(review => {
        expect(review).toBeDefined();
        expect(review).toEqual(expect.objectContaining(reviewExpected));
        done();
      })
      .catch(error => done(error));
    });

    it('Returns a review with response message if present', done => {
      let reviewExpected = {
        review_id: 3,
        product_id: 2,
        reviewer_name: 'bigbrotherbenjamin',
        rating: 4,
        summary: 'I am liking these glasses',
        recommend: true,
        response: 'Glad you\'re enjoying the product!',
        body: 'They are very dark.  But that\'s good because I\'m in very sunny spots',
        date: new Date(1609325851021),
        helpfulness: 5,
      };

      let reviewIdFilter = { review_id: reviewExpected.review_id };
      db.getReview(reviewIdFilter).then(review => {
        expect(review).toBeDefined();
        expect(review).toEqual(expect.objectContaining(reviewExpected));
        done();
      })
      .catch(error => done(error));
    });

    // Not allowed - for now?
    // it('Returns a review without a product rating if none was provided', done => {
    //   let reviewExpected = {
    //     review_id: 11,
    //     product_id: 8,
    //     reviewer_name: 'bigbrother',
    //     rating: null,
    //     summary: 'These pants are ok!',
    //     recommend: false,
    //     response: null,
    //     body: 'A little tight on the waist.',
    //     date: new Date(1592977554987),
    //     helpfulness: 2
    //   };

    //   let reviewIdFilter = { review_id: reviewExpected.review_id };
    //   db.getReview(reviewIdFilter).then(review => {
    //     expect(review).toBeDefined();
    //     expect(review).toEqual(expect.objectContaining(reviewExpected));
    //     console.log(review);
    //     done();
    //   })
    //   .catch(error => done(error));
    // });

    it('Returns an existing review with photo data for a review with photos', done => {
      let reviewExpected = {
        review_id: 5,
        product_id: 2,
        reviewer_name: 'shortandsweeet',
        rating: 3,
        summary: 'I\'m enjoying wearing these shades',
        recommend: true,
        response: null,
        body: 'Comfortable and practical.',
        date: new Date(1615987717620),
        helpfulness: 5,
        photos: [
          {
            id: 1,
            url: 'https://images.unsplash.com/photo-1560570803-7474c0f9af99?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80'
          },
          {
            id: 2,
            url: 'https://images.unsplash.com/photo-1561693532-9ff59442a7db?ixlib=rb-1.2.1&auto=format&fit=crop&w=975&q=80'
          },
          {
            id: 3,
            url: 'https://images.unsplash.com/photo-1487349384428-12b47aca925e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80'
          },
        ]
      };

      let reviewIdFilter = { review_id: reviewExpected.review_id };
      db.getReview(reviewIdFilter).then(review => {
        expect(review).toBeDefined();
        expect(review).toEqual(expect.objectContaining(reviewExpected));
        done();
      })
      .catch(error => done(error));
    });

    it('Returns an existing review with characteristics data for a review with characteristic ratings', done => {
      let reviewExpected = {
        review_id: 2,
        product_id: 1,
        reviewer_name: 'mymainstreammother',
        rating: 4,
        summary: 'This product was ok!',
        recommend: false,
        response: null,
        body: 'I really did not like this product solely because I am tiny and do not fit into it.',
        date: new Date(1610178433963),
        helpfulness: 2,
        characteristics: {
          'Length': {
            id: 2,
            value: 4
          }
        }
      };

      let reviewIdFilter = { review_id: reviewExpected.review_id };
      db.getReview(reviewIdFilter).then(review => {
        expect(review).toBeDefined();
        expect(review).toEqual(expect.objectContaining(reviewExpected));
        done();
      })
      .catch(error => done(error));
    });

    it('Returns undefined if failing to find a review', done => {
      let reviewIdFilter = { review_id: -1 };
      db.getReview(reviewIdFilter)
      .then(review => {
        expect(review).toBeUndefined();
        done();
      })
      .catch(error => done(error));
    });

    it('Returns undefined for existing review if review is reported', done => {
      let reviewIdFilter = { review_id: 9 };
      db.getReview(reviewIdFilter)
      .then(review => {
        expect(review).toBeUndefined();
        done();
      })
      .catch(error => done(error));
    });
  });

  // TBD: Table join for rating_id & recommended_id
  describe('getReviewMetadata', function () {
    it('Returns metadata for the reviews of an existing product by public product ID', done => {
      let metadataExpected = {
        product_id: 10,
        ratings: {
          2: 5,
          4: 10,
          5: 1 },
        recommended: {
          true: 3,
          false: 5
        }
      };

      let productIdFilter = { product_id: metadataExpected.product_id };
      db.getReviewMetadata(productIdFilter).then(metadata => {
        expect(metadata).toBeDefined();
        expect(metadata).toEqual(expect.objectContaining(metadataExpected));
        done();
      })
      .catch(error => done(error));
    });

    it('Returns metadata for the reviews of an existing product with no ratings or recommendations', done => {
      let metadataExpected = {
        product_id: 11,
        ratings: {},
        recommended: {},
        characteristics: {}
      };

      let productIdFilter = { product_id: metadataExpected.product_id };
      db.getReviewMetadata(productIdFilter).then(metadata => {
        expect(metadata).toBeDefined();
        expect(metadata).toEqual(expect.objectContaining(metadataExpected));
        done();
      })
      .catch(error => done(error));
    });

    it('Returns metadata for the reviews with characteristic ratings', done => {
      let metadataExpected = {
        product_id: 1,
        ratings: {
          4: 1,
          5: 1
        },
        recommended: {
          true: 1,
          false: 1
        },
        characteristics: {
          Fit: {
            id: 1,
            value: null,
          },
          Length: {
            id: 2,
            value: 2.5,
          },
          Comfort: {
            id: 3,
            value: 5,
          },
          Quality: {
            id: 4,
            value: null
          }
        }
      };

      let productIdFilter = { product_id: metadataExpected.product_id };
      db.getReviewMetadata(productIdFilter).then(metadata => {
        expect(metadata).toBeDefined();
        expect(metadata).toEqual(expect.objectContaining(metadataExpected));
        done();
      })
      .catch(error => done(error));
    });

    it('Returns undefined if the specified product does not exist', done => {
      let productIdFilter = { product_id: -1 };
      db.getReviewMetadata(productIdFilter)
      .then(metadata => {
        expect(metadata).toBeUndefined();
        done();
      })
      .catch(error => done(error));
    });
  });

  // ===== Update Methods =====
  describe('reportReview', function () {
    // TODO: Separate out later, but should have a fresh database for each test as these tests share results and run asynchronously.
    it('Marks a review as reported by public review ID, which prevents it from returning in future get requests and removes the review\'s contributions to metadata', done => {
      let reviewExpected = { // Review to report 1
        review_id: 12,
        product_id: 9,
        reviewer_name: "reviewAdder3",
        rating: 5,
        summary: 'Report me!!',
        recommend: true,
        response: null,
        body: 'I really like these pants. Best fit ever!',
        date: new Date(1609325851021),
        helpfulness: 2
      };
      let reviewIdFilter = { review_id: reviewExpected.review_id };

      let metadataExpectedInitial = {
        product_id: 9,
        ratings: {
          2: 1,
          4: 1,
          5: 1
        },
        recommended: {
          true: 2,
          false: 1
        },
        characteristics: {
          Length: {
            id: 16,
            value: 3.67,
          }
        }
      };

      let metadataExpectedFinal = {
        product_id: 9,
        ratings: {
          2: 1,
          4: 1
        },
        recommended: {
          true: 1,
          false: 1
        },
        characteristics: {
          Length: {
            id: 16,
            value: 3,
          }
        }
      };

      let productIdFilter = { product_id: metadataExpectedInitial.product_id };

      db.getReviewMetadata(productIdFilter)
      .then(metadata => {
        expect(metadata).toEqual(expect.objectContaining(metadataExpectedInitial));
      })
      .then(() => db.getReview(reviewIdFilter))
      .then(review => {
        expect(review).toBeDefined();
        expect(review).toEqual(expect.objectContaining(reviewExpected));
      })
      .then(() => db.reportReview(reviewIdFilter))
      .then(() => db.getReview(reviewIdFilter))
      .then(review => expect(review).toBeUndefined())
      .then(() => db.getReviewMetadata(productIdFilter))
      .then(metadata => {
        expect(metadata).toEqual(expect.objectContaining(metadataExpectedFinal));
        done();
      })
      .catch(error => done(error));
    });

    // it('Marks a review as reported by public review ID, which prevents it from returning in future get requests', done => {
    //   let reviewExpected = { // Review to report 1
    //     review_id: 12,
    //     product_id: 9,
    //     reviewer_name: "reviewAdder3",
    //     rating: 5,
    //     summary: 'Report me!!',
    //     recommend: true,
    //     response: null,
    //     body: 'I really like these pants. Best fit ever!',
    //     date: new Date(1609325851021),
    //     helpfulness: 2
    //   };
    //   let reviewIdFilter = { review_id: reviewExpected.review_id };

    //   db.getReview(reviewIdFilter)
    //   .then(review => {
    //     expect(review).toBeDefined();
    //     expect(review).toEqual(expect.objectContaining(reviewExpected));
    //   })
    //   .then(() => db.reportReview(reviewIdFilter))
    //   .then(() => db.getReview(reviewIdFilter))
    //   .then(review => {
    //     expect(review).toBeUndefined();
    //     done();
    //   })
    //   .catch(error => done(error));
    // });

    // it('Marks a review as reported by public review ID, which removes the review\'s contributions to metadata', done => {
    //   let metadataExpectedInitial = {
    //     product_id: 9,
    //     ratings: {
    //       2: 1,
    //       4: 1
    //     },
    //     recommended: {
    //       true: 1,
    //       false: 1
    //     },
    //     characteristics: {
    //       Length: {
    //         id: 16,
    //         value: 3,
    //       }
    //     }
    //   };

    //   // { // Review to report 2
    //   //   review_id: 13,
    //   //   product_id: 9,
    //   //   profile_id: 17,
    //   //   rating: 2,
    //   //   summary: 'Report me, too!!',
    //   //   recommend: false,
    //   //   response: null,
    //   //   body: 'I really like these pants. Best fit ever!',
    //   //   date: new Date(1609325851021),
    //   //   createdAt: new Date(),
    //   //   updatedAt: new Date(),
    //   //   helpfulness: 2,
    //   //   reported: false,
    //   // },

    //   let metadataExpectedFinal = {
    //     product_id: 9,
    //     ratings: {
    //       4: 1
    //     },
    //     recommended: {
    //       true: 1
    //     },
    //     characteristics: {
    //       Length: {
    //         id: 16,
    //         value: 4,
    //       }
    //     }
    //   };

    //   let productIdFilter = { product_id: metadataExpectedInitial.product_id };
    //   let reviewIdFilter = { review_id: 13 };

    //   db.getReviewMetadata(productIdFilter)
    //   .then(metadata => {
    //     expect(metadata).toEqual(expect.objectContaining(metadataExpectedInitial));
    //   })
    //   .then(() => db.getReview(reviewIdFilter))
    //   .then(review => {
    //     expect(review).toBeDefined();
    //   })
    //   .then(() => db.reportReview(reviewIdFilter))
    //   .then(() => db.getReview(reviewIdFilter))
    //   .then(review => expect(review).toBeUndefined())
    //   .then(() => db.getReviewMetadata(productIdFilter))
    //   .then(metadata => {
    //     expect(metadata).toEqual(expect.objectContaining(metadataExpectedFinal));
    //     done();
    //   })
    //   .catch(error => done(error));
    // });

    // TBD: Finish. Requires updating data and therefore initial expected data
    // it('Marks a review as reported by public review ID, which prevents it from returning in future product review get requests', done => {
    //   let reviewExpected = { // Review to report 1
    //     review_id: 12,
    //     product_id: 9,
    //     reviewer_name: "reviewAdder3",
    //     rating: 5,
    //     summary: 'Report me!!',
    //     recommend: true,
    //     response: null,
    //     body: 'I really like these pants. Best fit ever!',
    //     date: new Date(1609325851021),
    //     helpfulness: 2
    //   };
    //   let reviewIdFilter = { review_id: reviewExpected.review_id };
    //   let productIdFilter = { product_id: reviewExpected.product_id };

    //   db.getReview(reviewIdFilter)
    //   .then(review => {
    //     expect(review).toBeDefined();
    //     expect(review).toEqual(expect.objectContaining(reviewExpected));
    //   })
    //   .then(() => db.getProductReviews(productIdFilter))
    //   .then (productReviews => {
    //     expect(productReviews.length).toEqual(3);
    //   })
    //   .then(() => db.reportReview(reviewIdFilter))
    //   .then(() => db.getReview(reviewIdFilter))
    //   .then(review => {
    //     expect(review).toBeUndefined();
    //   })
    //   .then(() => db.getProductReviews(productIdFilter))
    //   .then (productReviews => {
    //     expect(productReviews.length).toEqual(2);
    //     done();
    //   })
    //   .catch(error => done(error));
    // });

    it('Does nothing if the specifed review does not exist', done => {
      let reviewIdFilter = { review_id: -1 };

      db.reportReview(reviewIdFilter)
      .then(() => {
        done();
      })
      .catch(error => done(error));
    });
  });

  describe('markReviewHelpful', function () {
    it('Increments the helpful count of a review by public review ID', done => {
      let reviewIdFilter = { review_id: 14 };

      db.getReview(reviewIdFilter)
      .then(review => {
        expect(review).toBeDefined();
        expect(review.helpfulness).toEqual(2);
      })
      .then(() => db.markReviewHelpful(reviewIdFilter))
      .then(() => db.getReview(reviewIdFilter))
      .then(review => {
        expect(review).toBeDefined();
        expect(review.helpfulness).toEqual(3);
        done();
      })
      .catch(error => done(error));
    });

    it('Does nothing if the specifed review does not exist', done => {
      let reviewIdFilter = { review_id: -1 };

      db.markReviewHelpful(reviewIdFilter)
      .then(() => {
        done();
      })
      .catch(error => done(error));
    });
  });

  // ===== Delete Methods =====

});