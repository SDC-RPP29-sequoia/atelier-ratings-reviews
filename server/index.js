const app = require('./app.js');
const port = 3000;

const eraseDatabaseOnSync = false;//true;

// Primary DB
const mongo = require('./db/mongo');
mongo.initializeDatabase(eraseDatabaseOnSync,
  () => {
    console.log('Mongo DB started');
  }
);

// Secondary DB
const postgres = require('./db/postgres')
postgres.initializeDatabase(eraseDatabaseOnSync,
  () => {
    console.log('Postgres DB started');
    app.listen(port, () => {
      console.log(`NSA is listening in at http://localhost:${port}`);
    })
  }
);