const config = require('config');
const { MongoClient } = require('mongodb');

class MongoDB {
  constructor(){
    let userAndPassword = '';

    if (config.get('mongo.user') && config.get('mongo.password')) {
      userAndPassword = `${config.get('mongo.user')}:${config.get('mongo.password')}@`;
    }

    this.mongoServer = `mongodb://${userAndPassword}${config.get('mongo.host')}:${config.get('mongo.port')}/${config.get('mongo.database')}`;
  }

  connect() {
    return new Promise((resolve, reject) => {
      MongoClient.connect(this.mongoServer, (err, client) => {
        if (err) return reject(err);
        return resolve({
          client,
          db: client.db(config.get('mongo.database')),
        });
      });
    });
  }

  close(client) {
    return Promise.resolve().then(() => client.close());
  }
}

module.exports = new MongoDB();
