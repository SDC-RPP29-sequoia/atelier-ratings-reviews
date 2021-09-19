
import postgres from '../index.js';

const postgresInit = postgres('test');

let db;

// ==== Test Template ====
// For Jest usage, see: https://jestjs.io/docs/getting-started
describe('postgres tests', function () {
  beforeAll(() => {
    // jest.setTimeout(20 * 1000);
    return new Promise(resolve => {
      // jest.setTimeout(20 * 1000);
      postgresInit(() => console.log('Postgres is ready for testing!'))
      .then((postgres) => {
        db = postgres;
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
      db.closeDatabase()
      .then(() => {
        console.log('Postgres connection has closed');
        resolve();
      })
      .catch(error => {
        console.log('Postgres had an error closing', error);
        reject(error);
      });
    })
  });

  // ===== Create Methods =====
  describe('addReview', function () {
    it('', function () {
      // expect(wrapper.find('p').text()).toEqual('Loading...');
      //addReview(reviewServer)
    });
  });

  // ===== Read Methods =====
  describe('getProductReviews', function () {
    it('', function () {
      // expect(wrapper.find('p').text()).toEqual('Loading...');
      // getProductReviews(productReviewRequest, filter)
    });
  });

  describe('getReview', function () {
    it('', function () {
      // expect(wrapper.find('p').text()).toEqual('Loading...');
      // getReview(reviewIdFilter)
    });
  });

  describe('getReviewMetadata', function () {
    it('', function () {
      // expect(wrapper.find('p').text()).toEqual('Loading...');
      // getReviewMetadata(productIdFilter)
    });
  });

  // ===== Update Methods =====
  describe('reportReview', function () {
    it('', function () {
      // expect(wrapper.find('p').text()).toEqual('Loading...');
      // reportReview(reviewIdFilter)
    });
  });

  describe('markReviewHelpful', function () {
    it('', function () {
      // expect(wrapper.find('p').text()).toEqual('Loading...');
      // markReviewHelpful(reviewIdFilter)
    });
  });

  // ===== Delete Methods =====

});