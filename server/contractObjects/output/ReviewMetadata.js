class ReviewMetadata {
  constructor(product_id) {
    this.product_id = product_id;
    this.ratings = {};          // { 1: 3, 4: 5, 5: 5 }
    this.recommended = {};      // { true: 2, false: 3}
    this.characteristics = {};  // { fit: { id: 5, value: 4.3 }}
  }

  addRating(star, count) {
    const starProperty = parseInt(star);
    if (count && starProperty) {
      this.ratings[starProperty] = count;
    }
  }

  addRecommended(recommended, count) {
    const recommendedBool = eval(recommended);
    if (recommendedBool && count > 0) {
      this.recommended.true = count;
    } else if (count > 0) {
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
module.exports = ReviewMetadata;