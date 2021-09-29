class ProductReviews {
  constructor(productId, page, count) {
    this.product = productId,
    this.page = page,
    this.count = count,
    this.results = [] // Contains ProductReview objects
  }
}
module.exports = ProductReviews;