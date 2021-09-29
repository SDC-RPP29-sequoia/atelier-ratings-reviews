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
    return (0 < this.ready.size && this.running.size < this.maxConcurrentRuns);
  }

  allHaveRun() {
    return (this.ran.size === this.collection.length);
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
    console.log('\n❌❌❌❌ Chunk failed to run to completion! ❌❌❌❌');
    console.log(`❌❌❌❌ ${this.ran.size} of ${this.collection.length} total callbacks ran ❌❌❌❌`);
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

  // Grow chunk size exponentially until cap is reached
  static getNewChunkSize(currentChunkSize, maxChunkSize = 10000, rate = 'exponential') {
    if (currentChunkSize < 2 || rate === 'linear') {
      currentChunkSize = Math.min(currentChunkSize + 1, maxChunkSize);
    } else if (rate === 'double') {
      currentChunkSize = Math.min(currentChunkSize * 2, maxChunkSize);
    } else if (rate === 'exponential'){
      currentChunkSize = Math.min(currentChunkSize * currentChunkSize, maxChunkSize);
    }
    return currentChunkSize;
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
        // process.stdout.write(`\rRunning callback ${index + 1} in chunk of
        //   ${this.ran.size} entries processed from lines ${this.initialLineNumber} to ${this.maxLineNumber}...`);

        callback()
        .then(() => {
          this.dequeueRunningComplete(callback);
          process.stdout.write(`\r ${this.ran.size} entries processed from lines ${this.initialLineNumber} to ${this.maxLineNumber}...`);
          this.executeSync().then(resolve());
        })
        .catch(error => {
          console.log('\n❌❌❌❌ Batch Failure! ❌❌❌❌');
          console.log(`❌❌❌❌ Failed to synchronously process an entry at index ${index}
            within lines ${this.initialLineNumber} to ${this.maxLineNumber}! ❌❌❌❌`);
          this.dequeueRunningFailed(callback);
          reject(error);
        })
      } else {
        console.log('\n🍺🍺🍺🍺 Batch Success! 🍺🍺🍺🍺');
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
  constructor(runAll = true, maxConcurrentRuns = 100) {
    super(maxConcurrentRuns);

    this.runAll = runAll;
  }

  totalCallbacks() {
    let length = 0;
    this.collection.forEach(chunk => {
      length += chunk.collection.length;
    });
    return length;
  }

  totalCallbacksRunning() {
    let runs = 0;
    this.collection.forEach(chunk => {
      runs += chunk.running.size;
    });
    return runs;
  }

  totalCallbacksRan() {
    let runs = 0;
    this.collection.forEach(chunk => {
      runs += chunk.ran.size;
    });
    return runs;
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
      console.log('\n🍺🍺🍺🍺 Completed running all chunk callbacks 🍺🍺🍺🍺');
      console.log(`🍺🍺🍺🍺 ${cbChunk.ran.size} of ${cbChunk.collection.length} total callbacks ran 🍺🍺🍺🍺`);

      // Pause briefly in case this finished a smaller chunk while more chunks are being loaded, then load next chunk if available
      setTimeout(() => {}, 50);
      if (this.runAll && this.ableToRun()) {
        console.log('Running next chunk collection');
        this.execute();
      } else if (this.allHaveRun()) {
        console.log('🍺🍺🍺🍺 Completed running all chunk collections!! 🍺🍺🍺🍺');
        console.log(`🍺🍺🍺🍺 ${this.totalCallbacksRan()} of ${this.totalCallbacks()} total callbacks ran 🍺🍺🍺🍺`)
        return true;
      } else {
        return false;
      }
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