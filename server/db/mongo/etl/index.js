// Plan currently is to load mongoDB via postgres using db/model/postgresToMongo.js
// Transformation is easier this way
// Since Mongo will be more of a caching layer, and postgres the source of truth, ultimately a conversion between the two DBs must be handled
// Incorporating this as part of ETL makes sense for concurrent development and not duplicating effort