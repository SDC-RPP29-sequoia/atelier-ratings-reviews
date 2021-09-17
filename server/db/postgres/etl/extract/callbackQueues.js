class RunQueue {
  constructor(maxConcurrentRuns = 100) {
    this.collection = [];
    this.ready = new Set();
    this.running = new Set();
    this.ran = new Set();
    this.maxConcurrentRuns = maxConcurrentRuns;
  }

  push(callback) {
    if (callback && !this.collection.includes(callback)) {
      this.collection.push(callback);
      this.ready.add(callback);
    }
  }

  ableToRun() {
    return (this.running.size < this.maxConcurrentRuns);
  }

  dequeueReady() {
    if (this.ready.size === 0) {
      console.log('No items are ready to run');
      return;
    } else {
      const callback = this.ready.values().next().value;
      this.ready.delete(callback);
      return callback;
    }
  }

  dequeueRunningComplete(callback) {
    this.running.delete(callback);
    this.ran.add(callback);
  }

  dequeueRunningFailed(callback) {
    this.running.delete(callback);
  }

  isRunning() {
    return this.running.size > 0;
  }

  allRun() {
    return (
      this.ready.size === 0 &&
      this.running.size === 0 &&
      this.ran.size === this.collection.length
      );
  }
}

class CallbackChunk extends RunQueue {
  constructor(jsonQueue, maxLineNumber, callback, emptyQueueCB) {
    super();
    this.initialLineNumber = maxLineNumber - jsonQueue.length + 1;
    this.maxLineNumber = maxLineNumber;

    this.enqueue(jsonQueue, callback, emptyQueueCB);
  }

  enqueue(jsonQueue, callback, emptyQueueCB) {
    let lineNumber = this.initialLineNumber;

    jsonQueue.forEach(json => {
      let initializedCB = callback.bind(null, json, lineNumber);
      this.push(initializedCB);
      lineNumber++;
    });
    emptyQueueCB();
  }

  executeSync() {
    return new Promise((resolve, reject) => {
      if (this.isRunning() && !this.allRun()) {
        // Ignore redundant execution call
        resolve();
    } else if (!this.allRun()) {
      const callback = this.dequeueReady();
      const index = this.collection.indexOf(callback);

      // console.log(`Executing callback at index ${index}`);
      this.running.add(callback);
      process.stdout.write(`\rRunning callback ${index + 1} in chunk of
        ${this.ran.size} entries processed from lines ${this.initialLineNumber} to ${this.maxLineNumber}...`);

      callback()
      .then(() => {
        this.dequeueRunningComplete(callback);
        return this.executeSync();
      })
      .catch(error => {
        console.log('❌❌❌❌ Batch Failure! ❌❌❌❌');
        console.log(`❌❌❌❌ Failed to synchronously process an entry at index ${index}
          within lines ${this.initialLineNumber} to ${this.maxLineNumber}! ❌❌❌❌`);
        this.dequeueRunningFailed(callback);
        reject(error);
      })
      } else {
        console.log('🍺🍺🍺🍺 Batch Success! 🍺🍺🍺🍺');
        console.log(`🍺🍺🍺🍺 ${this.ran.size} entries processed from lines ${this.initialLineNumber} to ${this.maxLineNumber}! 🍺🍺🍺🍺`);
        resolve();
      }
    })
  }

  // executeAsync() {
  //   return new Promise((resolve, reject) => {
  //     if(this.isRunning) {
  //       resolve();
  //     } else {
  //       console.log('Executing promises');
  //       this.setQueueCount();
  //       this.promises.forEach(promise => {
  //         promise();
  //       });

  //       Promise.all(this.promises)
  //       .then(ids => {
  //         console.log('🍺🍺🍺🍺 Batch Success! 🍺🍺🍺🍺');
  //         console.log(`🍺🍺🍺🍺 ${ids.length} entries processed from lines ${this.initialLineNumber} to ${this.maxLineNumber}! 🍺🍺🍺🍺`);
  //         this.numberRunning === 0;
  //         resolve();
  //       })
  //       .catch(error => {
  //         console.log('❌❌❌❌ Batch Failure! ❌❌❌❌');
  //         console.log(`❌❌❌❌ Failed to process an entry within lines ${this.initialLineNumber} to ${this.maxLineNumber}! ❌❌❌❌`);
  //         this.isRunning = false;
  //         reject(error);
  //       })
  //       .finally(() => {
  //         this.setQueueCount();
  //       });
  //     }
  //   });
  // }
}
module.exports.DatabaseQueue = CallbackChunk;

class CallbackChunkCollection extends RunQueue {
  constructor(maxConcurrentRuns = 100) {
    super(maxConcurrentRuns);
  }

  execute(cbChunk) {
    if (!this.ableToRun() || this.ready.size === 0) {
      console.log('Not able to run or no chunks are ready to run');
      return false;
    }

    if (cbChunk === undefined) {
      cbChunk = this.dequeueReady();
      if (cbChunk === undefined) {
        return false;
      }
    }

    this.running.add(cbChunk);
    process.stdout.write(`\rRunning ${this.running.size} chunks...`);
    cbChunk.executeSync()
    .then(() => {
      this.dequeueRunningComplete(cbChunk);
      return true;
    })
    .catch(error => {
      console.log('Error in running queued item', error);
      this.dequeueRunningFailed(cbChunk);
    });
  }

  pushAndExecute(cbChunk) {
    this.push(cbChunk);
    if (this.ableToRun()) {
      this.execute(cbChunk);
      return true;
    }
    return false;
  }
}
module.exports.DatabaseQueueCollection = CallbackChunkCollection;