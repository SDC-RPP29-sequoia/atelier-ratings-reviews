cd "$(dirname "$0")" /
sequelize db:drop --env development /
createdb ratings_reviews_dev -U markthomas /
sequelize db:migrate --env development