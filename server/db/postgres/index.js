const { Sequelize } = require('sequelize');

const controller = require('./controllers');
const models = require('./models');
const { seedDatabase } = require('./seed.js');

module.exports = (envOrConfigIn) => {
  // Establish config file for connection
  // TODO: The next two lines can maybe be factored out & shared from elsewhere?
  const envOrConfig = envOrConfigIn || process.env.NODE_ENV || 'test'; //'development';
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

  const initializeDatabase = (callback) => {
    return new Promise((resolve, reject) => {
      console.log('Initializing Postgres database');
      connectDatabase()
      .then(sequelize => {
        return sequelize.authenticate();
      })
      .then(result => {
        callback && callback();
        resolve();
      })
      .catch(error => {
        console.error('Unable to initialize the Postgres database:', error);
        reject(error);
      });
    })
  };

  return (callback) => {
    return new Promise((resolve, reject) => {
      console.log('Postgres initialization');
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
          Sequelize: Sequelize,
          sequelize: sequelize,
          initializeDatabase: initializeDatabase,
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