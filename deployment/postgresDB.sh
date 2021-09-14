createdb ratings_reviews_dev -U markthomas /
&& createdb ratings_reviews_test -U markthomas /
&& sequelize db:migrate
# sequelize db:drop