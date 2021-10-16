'use strict';

const router = require('express').Router();

// Authentication
// To use this API, you must create a GitHub API Token and attach it in every request as an "Authorization" header.
router.get('/loaderio-820164498ed16bb94bfe6e8106a24b63/', (req, res) => {
  console.log('Getting loader.io key for stress testing');
  res.sendFile('/home/ubuntu/atelier-ratings-reviews/server/loaderio-820164498ed16bb94bfe6e8106a24b63.txt');
});

module.exports = router;