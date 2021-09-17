class Review {
  constructor() {
    this.review_id = null;
    this.product_id = null;
    this.rating = null;
    this.summary = '';
    this.body = '';
    this.recommend = null;
    this.reviewer_name = '';
    this.response = null;
    this.date = null;
    this.helpfulness = null;
    this.photos = [];
    this.characteristics = [];
  }

  addCharacteristic(idExternal, name, rating) {
    this.characteristics[name] = {
      id: idExternal,
      value: rating
    }
  }
}
module.exports.Review = Review;