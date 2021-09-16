const db = require('../models');

const {
  Characteristic,
  Product,
  ReviewMetadata } = db;

// Add characteristics (185 MB)
//    generates all products, metadata, characteristics

const fileName = 'characteristics.csv';
module.exports.fileName = fileName;

// { id: '1', product_id: '1', name: 'Fit' }
module.exports.transformAndLoad = (json, lineNumber) => {
  console.log('Characteristic ETL', json);
  return new Promise((resolve, reject) => {
    getMetadataId(json.product_id)
    .then(metadataId => {
      console.log('getMetadataId complete', metadataId);
      const characteristicId = parseInt(json.id);
      Characteristic.findOrCreate({
        where: { characteristic_id: characteristicId },
        defaults: {
          characteristic_id: characteristicId,
          name: json.name,
          review_metadata_id: metadataId
        }
      })
      .then(result => {
        const characteristic = result[0].get();
        console.log('Characteristic.findOrCreate: ', characteristic.id);
        resolve(characteristic);
      });
    })
    .catch(error => {
      console.log(`Failed to add file ${fileName} to Postgres database at line #${lineNumber}`, error);
      reject(error);
    });
  });
};

const getMetadataId = (product_id) => {
  console.log('getMetadataId: product_id:', product_id);
  return new Promise((resolve, reject) => {
    const productId = parseInt(product_id);
    Product.findOrCreate({
      where: { product_id: productId },
      defaults: { product_id: productId }
    })
    .then(rows => {
      const product = rows[0].get();
      const created = rows[1];
      if (created) {
        ReviewMetadata.findOrCreate({
          where: { product_id: product.id },
          defaults: { product_id: product.id }
        })
        .then(rows => {
          const metadata = rows[0]?.get();
          if (metadata) {
            console.log('ReviewMetadata.findOrCreate: ', metadata.id);
            resolve(metadata.id);
          } else {
            console.log(`Failed to add metadata corresponding to product external ID ${product_id}`);
            reject();
          }
        })
        .catch(error => {
          console.log(`Failed to add metadata corresponding to product external ID ${product_id}`, error);
          reject(error);
        });
      } else {
        const findMetaDataId = (resolve, reject, limit = 0) => {
          ReviewMetadata.findOne({ where: { product_id: product.id } })
          .then(row => {
            const metadata = row?.get();
            if (metadata) {
              console.log('ReviewMetadata.findOne: ', metadata.id);
              resolve(metadata.id);
            } else {
              console.log(`ReviewMetadata.findOne failed to find metadata for product ID ${product.id}`);
              // Try again if allowed, but delay slightly as otherwise we have a race condition
              if (limit > 0) {
                console.log(`Waiting 50 ms and trying again...`);
                setTimeout(() => findMetaDataId(resolve, reject, limit--), 50);
              } else {
                reject();
              }
            }
          })
          .catch(error => {
            console.log(`Failed to find metadata for product external ID ${product_id}`, error);
            reject(error);
          });
        }

        findMetaDataId(resolve, reject, 4);
      }
    })
    .catch(error => {
      console.log('Failed to get metadata ID!', error)
      reject(error);
    });
  });
};