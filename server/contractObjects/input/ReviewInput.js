class ReviewInput {
  constructor(data) {
    this.product_id = data.product_id; // Required ID of the product to post the review for -> validate deeper?
    this.rating = data.rating; // Integer (1-5) indicating the review rating
    this.summary = data.summary; // Summary text of the review
    this.body = data.body; // Continued or full text of the review
    this.recommend = data.recommend; // Value indicating if the reviewer recommends the product
    this.name = data.name; // Username for question asker
    this.email = data.email; // Email address for question asker
    this.date = new Date();
    this.photos = data.photos; // Array of text urls that link to images to be shown
    this.characteristics = [];

    // Property validation
    if (this.rating < 0 || this.rating === undefined || this.rating === null) {
      this.rating = 0;
    } else
    if (this.rating > 5) {
      this.rating = 5;
    }

    if (!Array.isArray(this.photos)) {
      this.photos = [];
    }
  }

  addCharacteristics(characteristics) {
    for (characteristicId in characteristics) {
      const characteristic = {
        id: characteristicId,
        rating: characteristics[characteristicId]
      }
      this.characteristics.push(characteristic);
    }
  }
}
module.exports = ReviewInput;