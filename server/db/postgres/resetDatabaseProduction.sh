cd "$(dirname "$0")" /
sequelize db:drop --env production /
createdb ratings_reviews -U markthomas /
sequelize db:migrate --env production