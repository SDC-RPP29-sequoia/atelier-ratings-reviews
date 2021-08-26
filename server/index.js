const app = require('./app.js');
const port = 3000;

// Primary DB
const { sequelize, models } = require('./db/primary')
const seedDataBase = require('./db/primary/seed');

const eraseDatabaseOnSync = false;//true;

// Secondary DB
const modelsSecondary = require('./db/secondary');

// Initialize server w/ DB
sequelize.sync({ force: eraseDatabaseOnSync }).then( () => {
  if (eraseDatabaseOnSync) {
    seedDatabase(models);
  }

  app.listen(port, () => {
    console.log(`NSA is listening in at http://localhost:${port}`);
  });
});