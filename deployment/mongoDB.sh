# Alternative way to start mongoDB: mongod --config /usr/local/etc/mongod.conf
brew services start mongodb-community@4.4 /
&& mongo /
&& use ratings_reviews /
&& db.[tableName].insert /
&& brew services stop mongodb-community@4.4

mongoimport --db ratings_reviews --collection inventory ^
          --authenticationDatabase admin --username <user> --password <password> ^
          --drop --file ~\downloads\inventory.crud.json
