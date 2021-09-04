const { DataTypes } = require('sequelize');

const Review = sequelize.define('Review', {
  review_id_external: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  summary: {
    type: DataTypes.STRING,
    allowNull: false
  },
  recommend: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  response: {
    type: DataTypes.STRING
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date: {
    type: DataTypes.INTEGER
  },
  helpfulness: {
    type: DataTypes.INTEGER
  },
  reported: {
    type: DataTypes.BOOLEAN
  }
}, {
  tableName: 'review'
});
module.exports.Review = Review;

// Table methods
// const reportReview = (reviewId) => {
//   return new Promise( (resolve, reject) => {

//     // DB call here

//     if (error) {
//       console.log('reportReview error:', error);
//       reject(error);
//     } else {
//       resolve();
//     }
//   });
// }
// module.exports.reportReview = reportReview;

// const markReviewHelpful = (reviewId) => {
//   return new Promise( (resolve, reject) => {

//     // DB call here

//     if (error) {
//       console.log('markReviewHelpful error:', error);
//       reject(error);
//     } else {
//       resolve();
//     }
//   });
// }
// module.exports.markReviewHelpful = markReviewHelpful;