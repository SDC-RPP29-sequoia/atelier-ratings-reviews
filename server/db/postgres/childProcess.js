const childProcess = require('child_process');
const path = require('path');

const execute = (bashFileName, directoryPath) => {
  return new Promise((resolve, reject) => {
    try {
      const exec = childProcess.exec;
      const filePath = path.join(directoryPath, bashFileName);
      const cli = exec(`sh ${filePath}`);
      cli.stdout.on('data', (data)=>{
          console.log(data);
      });
      cli.stderr.on('data', (data)=>{
          console.error(data);
          reject(data);
      });
      // https://stackoverflow.com/questions/37522010/difference-between-childprocess-close-exit-events
      cli.on('close', (code) => {
        console.log(`${bashFileName} process exited with code ${code}`);
        resolve(code);
      });
      cli.on('exit', (code, signal) => {
        if (code) {
          console.error(`${bashFileName} process exited with code`, code);
          reject(code);
        } else if (signal) {
          console.error(`${bashFileName} process was killed with signal`, signal);
          reject(signal);
        } else {
          console.log(`${bashFileName} process exited okay`);
          resolve(code);
        }
      });
    } catch(error) {
      console.error(`${bashFileName} threw an exception`, error);
      reject(error);
    }
  });
}

module.exports.execute = execute;