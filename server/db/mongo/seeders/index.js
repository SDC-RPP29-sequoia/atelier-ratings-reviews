const mongoose = require('mongoose');
const models = require('../models');
const controllers = require('../controllers');
const reviewsData = require('./ReviewsData.js');
const reviewsMetadataData = require('./ReviewsMetadata.js');

const reSeedDatabase = (database) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(`mongodb://localhost/${database}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      }
    )
    .catch ( error =>
      console.error('Unable to connect to the Mongo database:', error)
    )
    .then ( () => {
      console.log('Connection to Mongo has been established successfully.');
      controllers.eraseDatabaseData()
      .then (() => seedDatabase(models))
      .then (() => resolve())
      .catch ( error => {
        console.log('Unable to reset Mongo database', error);
        reject();
      });
    })
    .catch ( error => {
      console.error('Unable to initialize the Mongo database:', error);
      reject();
    })
  });;
}

const seedDatabase = (models) => {
  console.log('Seeding Mongo database');
  return new Promise((resolve, reject) => {
    const createReviews = models.Review.create(reviewsData);
    const createReviewsMetadata = models.ReviewMetadata.create(reviewsMetadataData);
    Promise.all([createReviews, createReviewsMetadata])
    .then(() => {
      console.log('Seeded Mongo database');
      resolve();
    })
    .catch(error => {
      console.log('Unable to create Mongo database', error);
      reject();
    });
  });
};

const database = 'ratings_reviews_dev';
reSeedDatabase(database);

// // Load env vars
// dotenv.config({ path: "./config/config.env" });

// // Load models
// const User = require("./models/User");

// // Connect to DB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useUnifiedTopology: true,
// });

// // Read JSON files
// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
// );

// // Import into DB
// const importData = async () => {
//   try {
//     await User.create(users);
//     console.log("Data Imported...");
//     process.exit();
//   } catch (err) {
//     console.error(err);
//   }
// };

// // Delete data
// const deleteData = async () => {
//   try {
//     await User.deleteMany();
//     console.log("Data Destroyed...");
//     process.exit();
//   } catch (err) {
//     console.error(err);
//   }
// };

// if (process.argv[2] === "-i") {
//   importData();
// } else if (process.argv[2] === "-d") {
//   deleteData();
// }