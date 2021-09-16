const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');

module.exports.parseCsvFileToJson = (fileName, callback, dryRun = false) => {
  return new Promise((resolve, reject) => {
    let initialPath = '../../../../data/raw';
    if (dryRun) {
      initialPath += '/sample';
      fileName = fileName.replace('.csv', '_sample.csv');
    }
    const filePath = path.resolve(initialPath, fileName);

    // Open the file as a readable stream
    const readStream = fs.createReadStream(filePath);

    const promises = [];
    // This will wait until we know the readable stream is actually valid before piping
    readStream.on('open', () => {
      // This just pipes the read stream to the response object
      readStream.pipe(
        csv()
        .subscribe(
          (json, lineNumber) => { //single json object will be emitted for each csv line & parsed asynchronously
            promises.push(callback(json, lineNumber));
          },
          (error) => {
            console.log(`Error parsing CSV file ${filePath}`, error);
            process.exit();
            reject();
          },
          () => {
            Promise.all(promises)
              .then(ids => {
                console.log('%c🍺🍺🍺🍺 Success! 🍺🍺🍺🍺', 'color:green;');
                console.log(`${ids.length} entries processed!`);
                resolve();
              });
          }
        )
      );
    });

    // This catches any errors that happen while creating the readable stream (usually invalid names)
    readStream.on('error', (error) => {
      console.log(`Error reading file ${filePath}`, error);
      process.exit();
    });
  });
};