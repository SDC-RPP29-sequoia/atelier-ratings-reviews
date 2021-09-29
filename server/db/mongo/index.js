const mongoose = require('mongoose');

const controller = require('./controllers');
const models = require('./models');

module.exports = (envOrConfigIn) => {
  // Begin construction of object to export
  // const db = {};
  // db.Sequelize = Sequelize;

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

  const closeDatabase = () => {
    return new Promise((resolve, reject) => {
      mongoose.connection.close()
      .then(() => {
        console.log('Mongo database connection closed');
        resolve();
      })
      .catch(error => {
        console.log('Error closing mongo database connection!', error);
        reject(error);
      });
    });
  };

  const resetDatabase = (callback) => {
    if (envOrConfig === 'development' || envOrConfig === 'test') {
      model.eraseDatabaseData()
      .then (() => {
        if (envOrConfig === 'test') {
          return seedDatabase();
        } else {
          return;
        }
      })
      .then (() => callback())
      .catch (error => console.log('Unable to reset Mongo database', error));
    }
  };

  const initializeDatabase = (callback, eraseDatabaseOnSync = false) => {
    return new Promise((resolve, reject) => {
      console.log('Initializing Mongo database');
      const config = getConfig(envOrConfig);
      const mongoSettings = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      };

      console.log(`Connecting to Mongo at ${config.url}`);
      mongoose.connect(config.url, mongoSettings )
      .catch (error => {
        console.error('Unable to connect to the Mongo database:', error);
        reject(error);
      })
      .then (() => {
        console.log('Connection to Mongo has been established successfully.');
        if (eraseDatabaseOnSync || envOrConfig === 'test') {
          resetDatabase(callback);
        } else {
          callback();
        }
        resolve();
      })
      .catch (error => {
        console.error('Unable to initialize the Mongo database:', error);
        reject(error);
      });
    })
  };

  return (callback) => {
    return new Promise((resolve, reject) => {
      initializeDatabase(callback)
      .then(() => {
        return models(mongoose);
      })
      .then(model => {
        resolve({
          envOrConfig: envOrConfig,
          mongoose: mongoose,
          initializeDatabase: initializeDatabase,
          resetDatabase: resetDatabase,
          closeDatabase: closeDatabase,
          model: model,
          methods: controller(model)
        });
      })
      .catch(error => {
        console.log('Error in initializing Mongo database, model, or methods', error);
        reject(error);
      });
    });
  };
}