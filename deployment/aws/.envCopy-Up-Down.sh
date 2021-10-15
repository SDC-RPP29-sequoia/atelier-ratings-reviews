# copy up
scp -i "atelier-sequoia-server.cer" ./deployment/aws/.env ubuntu@ec2-18-119-123-42.us-east-2.compute.amazonaws.com:~/

# copy down
scp -i "atelier-sequoia-server.cer" ubuntu@ec2-18-119-123-42.us-east-2.compute.amazonaws.com:~/atelier-ratings-reviews/server/db/postgres/config/.env ./deployment/aws

