const { Sequelize } = require('sequelize');

const controller = require('./controllers');
const models = require('./models');
const { seedDatabase } = require('./seed.js');

module.exports = (envOrConfigIn) => {
  // Establish config file for connection
  // TODO: The next two lines can maybe be factored out & shared from elsewhere?
  const envOrConfig = envOrConfigIn || process.env.NODE_ENV || 'development';
  const getConfig = (envOrconfig) => {
    if (typeof envOrconfig === 'object') {
      return envOrconfig;
    } else {
      const envConfigs = require('./config/config.js');
      let env;
      if (typeof envOrconfig === 'string') {
        env = envOrconfig;
      } else {
        env = process.env.NODE_ENV || 'development';
      }
      return envConfigs[env];
    }
  };

  // Establish database connection
  let sequelize;
  const connectDatabase = () => {
    return new Promise ((resolve, reject) => {
      try {
        const config = getConfig(envOrConfig);
        if (config.url) {
          console.log(`Connecting to Postgres at ${config.url}`);
          sequelize = new Sequelize(config.url, config);
        } else {
          console.log(`Connecting to Postgres at ${config.database}`);
          sequelize = new Sequelize(config.database, config.username, config.password, config);
        }
        resolve(sequelize);
      } catch (error) {
        console.error('Unable to connect to the Postgres database:', error);
        reject(error);
      }
    });
  };

  const closeDatabase = () => {
    return new Promise((resolve, reject) => {
      sequelize.close()
      .then(() => {
        console.log('Postgres database connection closed');
        resolve();
      })
      .catch(error => {
        console.log('Error closing postgres database connection!', error);
        reject(error);
      });
    });
  };

  const resetDatabase = (callback) => {
    return new Promise((resolve, reject) => {
      if (envOrConfig === 'test') {
        console.log('Resetting Postgres database');
        seedDatabase()
        .then (() => {
          console.log('Postgres database reset & re-seeded');
          callback && callback();
          resolve(true);
        })
        .catch (error => {
          console.log('Unable to reset Postgres database', error);
          reject(error);
        });
      } else {
        resolve(false);
      }
    })
  }

  const initializeDatabase = (callback) => {
    return new Promise((resolve, reject) => {
      let isDatabaseReset = false;
      console.log('Initializing Postgres database');
      resetDatabase()
      .catch(error => {
        console.log('Error resetting postgres database', error);
        reject(error);
      })
      .then(dbReset => {
        isDatabaseReset = dbReset;
        connectDatabase();
      })
      .then(sequelizeInstance => {
        // sequelize = sequelizeInstance;
        sequelize.authenticate();
      })
      .then(() => {
        // console.log('Connection to Postgres has been established successfully.');
        // if (eraseDatabaseOnSync || envOrConfig === 'test') {
        //   console.log('Resetting Postgres database')
        //   resetDatabase(callback)
        //   .then(() => {
        //     console.log('Postgres database reset');
        //     resolve();
        //   })
        // } else {
        if (isDatabaseReset) {
          callback();
          resolve();
        } else {
          console.log('Syncing Postgres database')
          sequelize.sync() // This creates the table for any model if it doesn't exist (and does nothing if it already exists)
          .then (() => {
            console.log('Sync completed');
            callback();
            resolve();
          })
          .catch(error => {
            console.log('Error syncing Postgres database!', error);
            reject(error);
          });
        }
      })
      .catch(error => {
        console.error('Unable to initialize the Postgres database:', error);
        reject(error);
      });
    })
  };

  return (callback) => {
    return new Promise((resolve, reject) => {
      initializeDatabase(callback)
      .catch(error => {
        console.log('Error in initializing Postgres database!!!', error);
        reject(error);
      })
      .then(() => {
        console.log('Building Postgres model...');
        return models(sequelize, Sequelize);
      })
      .catch(error => {
        console.log('Error in initializing Postgres model!!!', error);
        reject(error);
      })
      .then(model => {
        console.log('Postgres model built!');
        resolve({
          envOrConfig: envOrConfig,
          sequelize: sequelize,
          initializeDatabase: initializeDatabase,
          resetDatabase: resetDatabase,
          closeDatabase: closeDatabase,
          model: model,
          methods: controller(model)
        });
      })
      .catch(error => {
        console.log('Error in initializing Postgres database, model, or methods', error);
        reject(error);
      });
    });
  };
}