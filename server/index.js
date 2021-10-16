const app = require('./app.js');
const config = require('./config/config');

// const mongo = require('./db/mongo')(); // Can add env/config variable here

// const postgres = require('./db/postgres')(); // Can add env/config variable here
// postgres(() => { console.log('Postgres DB started'); })
// .then(() => {
//   app.listen(port, () => {
//     console.log(`NSA is listening in at http://localhost:${port}`);
//   })
// });

app.listen(config.port, () => {
  console.log(`NSA is listening in on ${config.name} at ${config.baseUrl}:${config.port}`);
})

// TODO:
// Currently DB connection w/ testing migration already in progress for model/routes when this is called.
// Promise.all([
//   // mongo(() => { console.log('Mongo DB started'); }),
//   postgres(() => { console.log('Postgres DB started'); })
// ])
// .then(() => {
//   app.listen(port, () => {
//     console.log(`NSA is listening in at http://localhost:${port}`);
//   })
// })
// .catch(error => {
//   console.log('Error in making database connections', error);
// });

module.exports = app;