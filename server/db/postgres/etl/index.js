// This file will call each of the suporting ETL files, and load them in the appropriate order,
//    doing any in between associations/transformations as needed
// TBD: Handle one entire file at a time? vs. streaming concurrent files and handling line by line?

// Perhaps one part of this process is to save the imported ID and use that to assist in setting up table associations since
//    those may not hold during import.


// Add characteristics
//    generates all products, metadata, characteristics
const characteristicsEtl = require('./characteristics.js');

// Add reviews
//    generates all profiles, reviews
//    generates data for metadata
//      generates recommended, ratings (for product, for characteristic)
const reviewsEtl = require('./reviews.js');


// Add characteristic_reviews
//    adds associations for characteristics to reviews
//    generates data for these associations
const reviewsToCharacteristicsEtl = require('./characteristic_reviews.js');


// Add reviews_photos
//    generates all photos
//    adds associations for photos to reviews
const reviewsToPhotosEtl = require('./reviews_photos.js');
