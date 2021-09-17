sequelize db:drop /
createdb ratings_reviews_test -U markthomas /
sequelize db:migrate /
sequelize db:seed:all