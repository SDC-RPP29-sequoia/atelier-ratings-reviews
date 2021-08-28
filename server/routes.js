const router = require('express').Router();
// const models = require('./models');
// const Auth = require('./middleware/auth');

// Authentication
// To use this API, you must create a GitHub API Token and attach it in every request as an "Authorization" header.

// https://learn-2.galvanize.com/cohorts/2592/blocks/94/content_files/Front%20End%20Capstone/project-atelier/reviews.md

// Returns a list of reviews for a particular product. This list does not include any reported reviews.
router.get('/reviews/',
  (req, res, next) => {
    const productId = req.query.product_id;
    const page = req.query.page ? req.query.page : 1; // Selects the page of results to return
    const count = req.query.count ? req.query.count : 5; // Specifies how many results per page to return.
    const sort = req.query.sort; // Changes the sort order of reviews to be based on "newest", "helpful", or "relevant"

    const result = {
      product_id: 0, // Required ID of the product to post the review for
      rating: 0, // Integer (1-5) indicating the review rating
      summary: '', // Summary text of the review
      body: '', // Continued or full text of the review
      recommend: false, // Value indicating if the reviewer recommends the product
      name: '', // Username for question asker
      email: '', // Email address for question asker // ==== not returned
      photos: [''], // Array of text urls that link to images to be shown
      characteristics: { // Object of keys representing characteristic_id and values representing the review value for that characteristic.
        characteristic_id:  0
        // { "14": 5, "15": 5 //...}
      }
    };

    // if reported = true, leave out
    // {
    // //   "product": "2",
    // //   "page": 0, Results are returned by count/page, page increments this
    // //   "count": 5,

    //   "results": [
    //     {
    //       "review_id": 5,
    // //       "rating": 3,
    // //       "summary": "I'm enjoying wearing these shades",
    // //       "recommend": false,
    //       "response": null,
    // //       "body": "Comfortable and practical.",
    //       "date": "2019-04-14T00:00:00.000Z",
    // //       "reviewer_name": "shortandsweeet",
    //       "helpfulness": 5,
    // //       "photos": [{
    // //           "id": 1,
    // //           "url": "urlplaceholder/review_5_photo_number_1.jpg"
    // //         },
    // //         {
    // //           "id": 2,
    // //           "url": "urlplaceholder/review_5_photo_number_2.jpg"
    // //         },
    // //         // ...
    // //       ]
    //     },
    //     {
    //       "review_id": 3,
    //       "rating": 4,
    //       "summary": "I am liking these glasses",
    //       "recommend": false,
    //       "response": "Glad you're enjoying the product!",
    //       "body": "They are very dark. But that's good because I'm in very sunny spots",
    //       "date": "2019-06-23T00:00:00.000Z",
    //       "reviewer_name": "bigbrotherbenjamin",
    //       "helpfulness": 5,
    //       "photos": [],
    //     },
    //     // ...
    //   ]
    // }

    res.status('200').send(result);
  });

// Returns review metadata for a given product.
router.get('/reviews/meta',
  (req, res, next) => {
    const reviewId = req.query.review_id;

    const result = {
      "product_id": "2",
      "ratings": {
        // 0: 0 ?,
        // 1: 0,
        2: 1,
        3: 1,
        4: 2,
        // 5: 0
      },
      "recommended": {
        0: 5,
        // 1: 2
      },
      "characteristics": {
        "Size": {
          "id": 14,
          "value": "4.0000"
        },
        "Width": {
          "id": 15,
          "value": "3.5000"
        },
        "Comfort": {
          "id": 16,
          "value": "4.0000"
        },
      }
    };

    res.status('200').send(result);
  });

// Adds a review for the given product.
router.post('/reviews',
  (req, res, next) => {

    let review = req.body;

    const result = {
      product_id: 0, // Required ID of the product to post the review for
      rating: 0, // Integer (1-5) indicating the review rating
      summary: '', // Summary text of the review
      body: '', // Continued or full text of the review
      recommend: false, // Value indicating if the reviewer recommends the product
      name: '', // Username for question asker
      email: '', // Email address for question asker
      photos: [''], // Array of text urls that link to images to be shown
      characteristics: { // Object of keys representing characteristic_id and values representing the review value for that characteristic.
        characteristic_id:  0
        // { "14": 5, "15": 5 //...}
      }
    };

    res.status('201').send();
  });

// Updates a review to show it was found helpful.
router.put('/reviews/:review_id/helpful',
  (req, res, next) => {
    const reviewId = req.params.review_id;

    // Increment by 1: "helpfulness": 5,

    res.status('204').send();
  });

// Updates a review to show it was reported.
// Note, this action does not delete the review, but the review will not be returned in the above GET request.
router.get('/reviews/:review_id/report',
  (req, res, next) => {
    const reviewId = req.params.review_id;

    // reported = true;

    res.status('204').send();
  });


module.exports = router;

