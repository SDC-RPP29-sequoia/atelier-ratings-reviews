const fs = require('fs');
const path = require('path');
const { Writable } = require('stream');
const csv = require('csvtojson');

const { DatabaseQueue, DatabaseQueueCollection } =
    { CallbackChunk, CallbackChunkCollection } = require('./callbackQueues.js');

const getFilePath = (fileName, dryRun) => {
  let initialPath = '../../../../data/raw';
  if (dryRun) {
    initialPath += '/sample';
    fileName = fileName.replace('.csv', '_sample.csv');
  }
  return path.resolve(initialPath, fileName);
}

module.exports.parseCsvFileToJson = (fileName, callbackDB, dryRun = false, maxChunkSize = 10000) => {
  return new Promise((resolve, reject) => {
    const filePath = getFilePath(fileName, dryRun);

    // Open the file as a readable stream
    const readStream = fs.createReadStream(filePath);

    // Create queues to batch data into for database insertion in chunks
    const databaseQueueCollection = new DatabaseQueueCollection();
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
        } ,
        objectMode: true
    });

    let executionQueues = [];
    let lineNumber = 0;
    // This will wait until we know the readable stream is actually valid before piping
    readStream.on('open', () => {
      // This just pipes the read stream to the response object
      console.log(`Stream has been opened for file ${fileName}`);
      readStream
      // Old, direct method. Stream overwhelms DB in large files
      // .pipe(
      //   csv()
      //   .subscribe(
      //     (json, lineNumber) => {
      //       //single json object will be emitted for each csv line & parsed asynchronously
      //       promises.push(callback(json, lineNumber));
      //     },
      //     (error) => {
      //       console.log(`Error parsing CSV file ${filePath}`, error);
      //       process.exit();
      //       reject();
      //     },
      //     () => {
      //       Promise.all(promises)
      //         .then(ids => {
      //           console.log('%c🍺🍺🍺🍺 Success! 🍺🍺🍺🍺', 'color:green;');
      //           console.log(`${ids.length} entries processed!`);
      //           resolve();
      //         });
      //     }
      //   )
      // )

// node object for memory management. e.g. process object? Under 250 MB

      .pipe(csv({}, { objectMode: true }))
      .pipe(writeStreamDB)
      .on('finish', () => {
        if (queue.length > 0) {
          console.log(`\n=== Writing JSON batch to database up to EOF (${lineNumber} lines) ===`);
          console.log(`For file: ${fileName}`);

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
          console.log(`🍺🍺🍺🍺 ${lineNumber} entries to be processed from file:`, fileName);
          resolve();
        })
        .catch(error => {
          console.log('\n❌❌❌❌ Batch Failure! ❌❌❌❌');
          console.log(`❌❌❌❌ Failed to process file:`, fileName);
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