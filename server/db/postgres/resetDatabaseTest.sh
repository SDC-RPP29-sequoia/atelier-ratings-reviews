cd "$(dirname "$0")" /
sequelize db:drop --env test /
createdb ratings_reviews_test -U markthomas /
sequelize db:migrate --env test /
sequelize db:seed:all --env test