// This file will call each of the suporting ETL files, and load them in the appropriate order,
//    doing any intermediate associations/transformations as needed

const extractor = require('./csvToJson.js');

const dryRun = () => {
  const testCallback = (json, lineNumber) => {
    return new Promise((resolve, reject) => {
      try {
        console.log('Reading Line #: ', lineNumber);
        console.log('JSON! YAY!!!', json);
        resolve();
      }
      catch {
        reject();
      }
    });
  };

  const fileName1 = 'characteristic_reviews_sample.csv';
  const fileName2 = 'characteristics_sample.csv';
  const fileName3 = 'reviews_photos_sample.csv';
  const fileName4 = 'reviews_sample.csv';
  const isDryRun = true;
  extractor.parseCsvFileToJson(fileName1, testCallback, isDryRun)
  .then(() => console.log('Yay!!!! ALLL DONE! 1'))
  .then(() => extractor.parseCsvFileToJson(fileName2, testCallback, isDryRun))
  .then(() => console.log('Yay!!!! ALLL DONE! 2'))
  .then(() => extractor.parseCsvFileToJson(fileName3, testCallback, isDryRun))
  .then(() => console.log('Yay!!!! ALLL DONE! 3'))
  .then(() => extractor.parseCsvFileToJson(fileName4, testCallback, isDryRun))
  .then(() => console.log('Yay!!!! ALLL DONE! 4'))
  .catch(error => console.log('Error reading CSV to Postgres database', error))
  .finally(() => process.exit());
};

const run = () => {
  const characteristics = require('./characteristics.js');
  const reviews = require('./reviews.js');
  const reviewsToCharacteristics = require('./characteristic_reviews.js');
  const reviewsToPhotos = require('./reviews_photos.js');

  const isDryRun = true;
  extractor.parseCsvFileToJson(
    characteristics.fileName,
    characteristics.transformAndLoad,
    isDryRun)
  .then(() => console.log(`Completed ETL of ${characteristics.fileName}`))

  .then(() => extractor.parseCsvFileToJson(
    reviews.fileName,
    reviews.transformAndLoad,
    isDryRun))
  .then(() => console.log(`Completed ETL of ${reviews.fileName}`))

  .then(() => extractor.parseCsvFileToJson(
    reviewsToCharacteristics.fileName,
    reviewsToCharacteristics.transformAndLoad,
    isDryRun))
  .then(() => console.log(`Completed ETL of ${reviewsToCharacteristics.fileName}`))

  .then(() => extractor.parseCsvFileToJson(
    reviewsToPhotos.fileName,
    reviewsToPhotos.transformAndLoad,
    isDryRun))
  .then(() => console.log(`Completed ETL of ${reviewsToPhotos.fileName}`))

  .catch(error => console.log('Error reading CSV to Postgres database', error))
  .finally(() => process.exit());
};


if (process.argv[2] === '-d') {
  dryRun();
} else if (process.argv[2] === '-r' || process.argv[2] === undefined) {
  run();
}