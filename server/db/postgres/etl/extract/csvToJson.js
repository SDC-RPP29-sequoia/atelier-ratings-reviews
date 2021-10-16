const fs = require('fs');
const path = require('path');
const { Writable } = require('stream');
const csv = require('csvtojson');

const { DatabaseQueue, DatabaseQueueCollection } =
    { CallbackChunk, CallbackChunkCollection } = require('./callbackQueues.js');

const getFilePath = (filename, dryRun) => {
  let initialPath = '../../../../data/raw';
  if (dryRun) {
    initialPath += '/sample';
    filename = filename.replace('.csv', '_sample.csv');
  }
  return path.resolve(initialPath, filename);
}

const lineNumberMultiple = 0; // For _to_characteristics: 8; 15, for _to_photos: 0
const lineNumberMuplipleSpread = 1; // for _to_photos: 3
module.exports.parseCsvFileToJson = (filename, callbackDB, dryRun = false, maxChunkSize = 10000, maxCollectionRun = 100) => {
  return new Promise((resolve, reject) => {
    const filePath = getFilePath(filename, dryRun);

    // Open the file as a readable stream
    const readStream = fs.createReadStream(filePath);

    // Create queues to batch data into for database insertion in chunks
    let runAll = true;
    const databaseQueueCollection = new DatabaseQueueCollection(runAll, maxCollectionRun);
    let queue = [];
    const emptyQueue = () => {
      queue = [];
    };

    // Write stream sets up batches of promises to run database insertions from
    let currentChunkSize = 1;
    const writeStreamDB = new Writable({
        write: (json, encoding, callback) => {
          // console.log('Piping JSON', json);
          lineNumber++;
          if ((lineNumberMultiple * 1000000) < lineNumber && lineNumber <= (lineNumberMultiple + lineNumberMuplipleSpread) * 1000000) { // Current cap since memory issues
            queue.push(json);
            if (queue.length >= currentChunkSize) {
              console.log(`Writing JSON batch to database up to line ${lineNumber}`);
              currentChunkSize = DatabaseQueue.getNewChunkSize(currentChunkSize, maxChunkSize);
              // console.log('Current Chunk Size', currentChunkSize);
              // Create queue and immediately invoke it to run synchronously
              const databaseQueue = new DatabaseQueue(
                queue,
                lineNumber,
                callbackDB,
                () => {
                  emptyQueue();
                  callback();
                }
              );
              databaseQueueCollection.pushAndExecute(databaseQueue);
            } else {
              // console.log(`Adding to queue line ${lineNumber}`);
              callback();
            }
          } else {
            // console.log('Next line...');
            callback();
          }
        },
        objectMode: true
    });

    let executionQueues = [];
    let lineNumber = 0;
    // This will wait until we know the readable stream is actually valid before piping
    readStream.on('open', () => {
      // This just pipes the read stream to the response object
      console.log(`Stream has been opened for file ${filename}`);
      // node object for memory management. e.g. process object? Under 250 MB
      readStream
      .pipe(csv({}, { objectMode: true }))
      .pipe(writeStreamDB)
      .on('finish', () => {
        if (queue.length > 0) {
          console.log(`\n=== Writing JSON batch to database up to EOF (${lineNumber} lines) ===`);
          console.log(`For file: ${filename}`);

          // Create queue and immediately invoke it to run synchronously
          const databaseQueue = new DatabaseQueue(queue,
            lineNumber,
            callbackDB,
            () => {
              emptyQueue();
            }
          );
          databaseQueueCollection.pushAndExecute(databaseQueue);
        }

        console.log('\nExecuting queues!');
        databaseQueueCollection.pushAndExecute();

        const queuesDb = [];
        executionQueues.forEach(executionQueue => {
          queuesDb.push(executionQueue.executeSync());
        });

        Promise.all(queuesDb)
        .then(() => {
          console.log('\n🍺🍺🍺🍺 File ETL Queue Load Success! 🍺🍺🍺🍺');
          console.log(`🍺🍺🍺🍺 ${lineNumber} entries to be processed from file:`, filename);
          resolve();
        })
        .catch(error => {
          console.log('\n❌❌❌❌ Batch Failure! ❌❌❌❌');
          console.log(`❌❌❌❌ Failed to process file:`, filename);
          console.log(error);
          reject(error);
        });
      });
    });

    readStream.on('error', (error) => {
      console.log(`\nError reading file ${filePath}`, error);
      process.exit();
    });
  });
};