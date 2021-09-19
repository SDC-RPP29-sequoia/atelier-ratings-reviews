class ProductReviewsRequest {
  static sortEnum = {
    newest: 'newest',
    helpful: 'helpful',
    relevant: 'relevant'
  };

  constructor(productId, page = 1, count = 5, sortBy) {
    this.product_id = productId;
    this.page = page;
    this.count = count;
    this.sortBy = this.validateSortBy(sortBy.toLowerCase());
  }

  validateSortBy(sortBy) {
    if (sortBy !== '') {
      const enums = Object.keys(ProductReviewsRequest.sortEnum);
      if (!enums.includes(sortBy)) {
        sortBy = '';
      }
    }
    this.sortBy = sortBy;
  }
}
module.exports.ProductReviewsRequest = ProductReviewsRequest;