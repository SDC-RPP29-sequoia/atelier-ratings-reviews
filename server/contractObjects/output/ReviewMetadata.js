class ReviewMetaData {
  constructor(product_id) {
    this.product_id = product_id;
    this.ratings = {};
    this.recommended = {};
    this.characteristics = {};
  }

  addRating(star, count) {
    this.ratings[star] = count;
  }

  addRecommended(recommended, count) {
    if (recommended) {
      this.recommended.true = count;
    } else {
      this.recommended.false = count;
    }
  }

  addCharacteristic(idExternal, name, rating) {
    this.characteristics[name] = {
      id: idExternal,
      value: rating
    }
  }
}
module.exports.ReviewMetaData = ReviewMetaData;