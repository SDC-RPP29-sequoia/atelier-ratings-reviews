# From: https://chartio.com/resources/tutorials/how-to-drop-a-database-in-mongodb-from-the-command-line/
mongo /
use ratings_reviews_test /
db.dropDatabase() /
use ratings_reviews_test /
exit /
node ./seeders/index.js