const env = process.env.NODE_ENV || 'development';
const db = require('../../models'); // (env)

const {
  Product,
  Profile,
  Review,
  ReviewMetadata } = db;

  // This module creates data derived from existing data in the database
