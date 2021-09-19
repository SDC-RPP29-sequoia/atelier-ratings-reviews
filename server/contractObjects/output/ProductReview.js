class ProductReview {
  constructor() {
    this.review_id = null;
    this.rating = null;
    this.summary = '';
    this.body = '';
    this.recommend = null;
    this.reviewer_name = '';
    this.response = null;
    this.date = null;
    this.helpfulness = null;
    this.photos = [];         // { id: 5, url: 'http://foo.bar' }
  }
}
module.exports.ProductReview = ProductReview;