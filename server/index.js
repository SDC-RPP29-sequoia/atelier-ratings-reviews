const app = require('./app.js');
const port = 3000;

const eraseDatabaseOnSync = false;//true;

// Primary DB
const mongo = require('./db/mongo');
mongo.initializeDatabase(eraseDatabaseOnSync,
  // app.listen(port, () => {
  //   console.log(`NSA is listening in at http://localhost:${port}`);
  // })
);

// Secondary DB
const postgre = require('./db/postgre')
postgre.initializeDatabase(eraseDatabaseOnSync,
  app.listen(port, () => {
    console.log(`NSA is listening in at http://localhost:${port}`);
  })
);