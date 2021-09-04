class ProductReview {
  constructor() {
    this.review_id = null;
    this.rating = null;
    this.summary = '';
    this.recommend = null;
    this.response = null;
    this.body = '';
    this.date = null;
    this.reviewer_name = '';
    this.helpfulness = null;
    this.photos = [];
  }
}
module.exports.ProductReview = ProductReview;