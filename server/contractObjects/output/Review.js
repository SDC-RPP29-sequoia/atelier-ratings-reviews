// class ProductReview {
//   constructor() {
//     this.review_id = null;
//     this.rating = null;
//     this.summary = '';
//     this.recommend = null;
//     this.response = null;
//     this.body = '';
//     this.date = null;
//     this.reviewer_name = '';
//     this.helpfulness = null;
//     this.photos = [];
//   }
// }

// const review = {
//   product_id: 0, // Required ID of the product to post the review for -> validate deeper?
//   rating: 0, // Integer (1-5) indicating the review rating
//   summary: '', // Summary text of the review
//   body: '', // Continued or full text of the review
//   recommend: false, // Value indicating if the reviewer recommends the product
//   name: '', // Username for question asker
//   email: '', // Email address for question asker
//   photos: [''], // Array of text urls that link to images to be shown
//   characteristics: { // Object of keys representing characteristic_id and values representing the review value for that characteristic.
//     characteristic_id:  0
//     // { "14": 5, "15": 5 //...}
//   }
// };
// module.exports.ProductReview = ProductReview;