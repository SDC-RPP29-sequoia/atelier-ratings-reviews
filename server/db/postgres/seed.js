const childProcess = require('./childProcess.js');

// TODO: Complete or remove. Currently seeding is done on the CLI and may be best called in a bash script, or loaded from here.
// Usage for later iterations needs to be seen/fleshed out first.
const seedDatabase = () => {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === 'test') {
      console.log('Seeding Postgres database');
      const bashFileName = 'resetDatabaseTest.sh';
      const path = __dirname;

      childProcess.execute(bashFileName, path)
      .then(() => {
        console.log('Done seeding postgres database');
        resolve();
      })
      .catch(error => {
        console.log('Error seeding postgres database', error);
        reject(error);
      });
    } else {
      console.log('Environment is: ', process.env.NODE_ENV);
      resolve();
    }
  });
};

if (process.argv[2] === '-r') {
  if (process.env.NODE_ENV === undefined) {
    process.env.NODE_ENV = 'test';
  }
  seedDatabase();
}

module.exports.seedDatabase = seedDatabase;