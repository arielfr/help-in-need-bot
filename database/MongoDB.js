const config = require('config');
const { MongoClient } = require('mongodb');

class MongoDB {
  constructor(){
    const { user, password, host, port, database } = config.get('mongo');
    this.mongoServer = `mongodb://${(user && password) ? `${user}:${password}@` : ''}${host}:${port}/${database}`;
  }

  connect() {
    return new Promise((resolve, reject) => {
      MongoClient.connect(this.mongoServer, {
        useNewUrlParser: true
      }, (err, client) => {
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
