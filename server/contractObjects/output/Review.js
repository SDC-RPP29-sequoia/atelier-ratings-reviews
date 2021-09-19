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
    this.photos = [];           // { id: 5, url: 'http://foo.bar' }
    this.characteristics = [];  // { fit: { id: 5, value: 4.3 }}
  }

  addCharacteristic(idExternal, name, rating) {
    this.characteristics[name] = {
      id: idExternal,
      value: rating
    }
  }
}
module.exports.Review = Review;