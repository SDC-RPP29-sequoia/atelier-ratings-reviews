// This file will call each of the suporting ETL files, and load them in the appropriate order,
//    doing any intermediate associations/transformations as needed

const extractor = require('./extract/csvToJson.js');

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
  const postgres = require('../index.js')('development'); // Can add env/config variable here
  // console.log('postgres:', postgres);
  postgres(() => { console.log('Postgres DB started'); })
  // require('../../../index.js')
  .then(db => {
    const characteristics = require('./transformLoad/characteristics.js')(db.model);
    const reviews = require('./transformLoad/reviews.js')(db.model);
    const reviewsToCharacteristics = require('./transformLoad/characteristic_reviews.js')(db.model);
    const reviewsToPhotos = require('./transformLoad/reviews_photos.js')(db.model);

    const isDryRun = false;
    console.log('Running ETL!');
    if (isDryRun) {
      console.log('As a dry run');
    }
    extractor.parseCsvFileToJson(
    //   characteristics.filename,
    //   characteristics.transformAndLoad,
    //   isDryRun)
    // .then(() => console.log(`Completed ETL of ${characteristics.filename}`))

    // .then(() => extractor.parseCsvFileToJson(
    //   reviews.filename,
    //   reviews.transformAndLoad,
    //   isDryRun)//)
    // .then(() => console.log(`Completed ETL of ${reviews.filename}`))

    // .then(() => extractor.parseCsvFileToJson(

    //   reviewsToCharacteristics.filename,
    //   reviewsToCharacteristics.transformAndLoad,
    //   isDryRun)//)
    // .then(() => console.log(`Completed ETL of ${reviewsToCharacteristics.filename}`))

    // .then(() => extractor.parseCsvFileToJson(

      reviewsToPhotos.filename,
      reviewsToPhotos.transformAndLoad,
      isDryRun)//)
    .then(() => console.log(`Completed ETL of ${reviewsToPhotos.filename}`))

    .catch(error => console.log('Error reading CSV to Postgres database', error))
    // .finally(() => process.exit());
  });
};

if (process.argv[2] === '-d') {
  dryRun();
} else if (process.argv[2] === '-r' || process.argv[2] === undefined) {
  run();
}