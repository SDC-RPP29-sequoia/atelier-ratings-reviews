# Note: If error in loading DB, restart DB: sudo service postgresql start
# === Transfer between Servers ===
# First, dump the source database to a file. (ca. 30 sec)
pg_dump -U markthomas -d ratings_reviews_dev -f ratings_reviews.sql

# ==================================================================

# Second, copy the dump file to the remote server. (ca. 40 min)
scp -i "atelier-sequoia-server.cer" ratings_reviews.sql ubuntu@ec2-3-137-183-102.us-east-2.compute.amazonaws.com:~/

# Third, create a new database in the remote server:
sudo -u postgres psql
CREATE DATABASE targetdb;
\q

# Code language: PostgreSQL SQL dialect and PL/pgSQL (pgsql)
# Finally, restore the dump file on the remote server: (ca. 7 min local, min on AWS)
sudo -u postgres psql -d ratings_reviews -f ratings_reviews.sql
sudo psql -u markthomas -h 3.137.183.102 -d ratings_reviews -f ratings_reviews.sql # for when authorization is required

# on local MacOS
pg_dump -u markthomas -d ratings_reviews_dev -f ratings_reviews.sql
sudo -u markthomas psql -d ratings_reviews -f ratings_reviews.sql
sudo -u markthomas psql -d ratings_reviews_dev -f ratings_reviews.sql

# === Active Connections ===
sudo -u postgres psql
# The following query returns the active connections:
SELECT pid, usename, client_addr
FROM pg_stat_activity
WHERE datname ='ratings_reviews';

# To terminate the active connections to the dvdrental database, you use the following query:
SELECT pg_terminate_backend (pid)
FROM pg_stat_activity
WHERE datname = 'ratings_reviews';

\q