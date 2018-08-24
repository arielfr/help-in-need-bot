const logger = require('winston-this')('locations-service');
const MongoDB = require('../database/MongoDB');

/**
 * This class is going to store the users locations
 */
class Locations {
  constructor() {
    this.locations = [];
  }

  static get COLLECTION_NAME () {
    return 'locations';
  }

  static get EARTH_RADIUS_IN_MILES () {
    return 3959;
  }

  static get MIN_RADIUS_METERS() {
    return 50;
  }

  static get SEARCH_RADIUS_METERS() {
    return 1000;
  }

  /**
   * Miles to Meters Converter
   * @param meters
   * @returns {number}
   */
  metersToMiles(meters) {
    return meters * 0.000621371;
  }

  /**
   * Get a MongoDB query for searching within a geo location point
   * @param lat
   * @param long
   * @param distance
   * @returns {{$geoWithin: {$centerSphere: *[]}}}
   */
  getGeoWithinQuery({ lat, long, distance }) {
    return {
      $geoWithin : {
        $centerSphere : [
          [
            lat,
            long
          ],
          (this.metersToMiles(distance) / Locations.EARTH_RADIUS_IN_MILES)
        ]
      }
    }
  }

  /**
   * Check if the location was already reported
   * @param lat
   * @param long
   * @returns {Promise<any>}
   */
  isAlreadyReported({ lat, long }) {
    return new Promise((resolve, reject) => {
      MongoDB.connect().then(({ client, db }) => {
        const collection = db.collection(Locations.COLLECTION_NAME);

        collection.findOne({
          loc: this.getGeoWithinQuery({ lat, long, distance: Locations.MIN_RADIUS_METERS }),
        }).then((res) => {
          if (res === null) {
            return resolve(false)
          }

          // Increment priority on results
          return collection.updateMany({
              loc: this.getGeoWithinQuery({ lat, long, distance: Locations.MIN_RADIUS_METERS }),
            },
            {
              $inc: {
                priority: 1,
              }
            }
          ).then(() => {
            MongoDB.close(client);

            resolve(true);
          });
        }).catch(err => {
          logger.error(`An error ocurr checking is th elocation is already reported: ${err}`);

          MongoDB.close(client);
          resolve(false);
        });
      });
    });
  }

  /**
   * Add location to the database if is not reported
   * @param lat
   * @param long
   */
  addLocation(userData, { lat, long }) {
    this.isAlreadyReported({ lat, long }).then((isReported) => {
      if (isReported) {
        return logger.info(`The person was already reported inside a min radius of ${Locations.MIN_RADIUS_METERS}`);
      }

      logger.info(`Adding the location: Lat = ${lat} / Long = ${long}`);

      MongoDB.connect().then(({ client, db }) => {
        const collection = db.collection(Locations.COLLECTION_NAME);

        const data = {
          loc: {
            type: 'Point',
            coordinates: [lat, long]
          },
          priority: 1,
          time_added: new Date(),
          user: {},
        };

        if (userData) {
          data.user = {
            id: userData.id,
            first_name: userData.first_name,
            last_name: userData.last_name,
            profile_pic: userData.profile_pic,
          };
        }

        collection.insertOne(data).then(() => {
          MongoDB.close(client);
        }).catch((err) => {
          logger.error(`An error ocurr adding location: ${err}`);

          MongoDB.close(client);
        });
      });
    });
  }

  /**
   * Retrieve all the near locations with a limit
   * @param lat
   * @param long
   * @param limit
   * @returns {Promise<any>}
   */
  getNearLocations({ lat, long }, limit = 5) {
    return new Promise((resolve) => {
      MongoDB.connect().then(({ client, db }) => {
        const collection = db.collection(Locations.COLLECTION_NAME);

        collection.find({
          loc: this.getGeoWithinQuery({ lat, long, distance: Locations.SEARCH_RADIUS_METERS }),
        }).limit(limit).toArray((err, res) => {
          MongoDB.close(client);

          if (err) {
            logger.error(`An error ocurr looking for the locations near: Lat = ${lat} / Long = ${long}`);
            return resolve([]);
          }

          logger.info(`Getting the locations near: Lat = ${lat} / Long = ${long}. Found ${res.length}`);

          const found = res.map((l) => ({
            lat: l.loc.coordinates[0],
            long: l.loc.coordinates[1],
            priority: l.priority,
          }));

          resolve(found);
        })
      });
    });
  }

  /**
   * Get all the locations
   * @param limit
   * @returns {Promise<any>}
   */
  getGmapsLocations(limit = 100) {
    return new Promise((resolve) => {
      MongoDB.connect().then(({ client, db }) => {
        const collection = db.collection(Locations.COLLECTION_NAME);

        collection.find({}).limit(limit).toArray((err, res) => {
          MongoDB.close(client);

          if (err) {
            logger.error(`An error ocurr looking for gMaps locations: Lat = ${lat} / Long = ${long}`);
            return resolve([]);
          }

          logger.info(`Getting gMaps locations ${res.length}/${limit}`);

          const found = res.map((l) => ({
            lat: l.loc.coordinates[0],
            lng: l.loc.coordinates[1],
            user: {
              first_name: l.user.first_name,
              profile_pic: l.user.profile_pic,
            }
          }));

          resolve(found);
        })
      });
    });
  }

  /**
   * Expire entries from Yesterday
   * @returns {Promise<any>}
   */
  expireYesterday() {
    return new Promise((resolve, reject) => {
      MongoDB.connect().then(({ client, db }) => {
        const collection = db.collection(Locations.COLLECTION_NAME);
        const now = new Date();

        collection.deleteMany({
          time_added:{
            $lte: now.getDate() - 1,
          }
        }).then(() => {
          MongoDB.close(client);

          resolve(true);
        }).catch((err) => {
          MongoDB.close(client);

          resolve(err);
        });
      });
    });
  }

  /**
   * Delete All Locations
   * @returns {Promise<any>}
   */
  deleteAll() {
    return new Promise((resolve, reject) => {
      MongoDB.connect().then(({ client, db }) => {
        const collection = db.collection(Locations.COLLECTION_NAME);
        const now = new Date();

        collection.drop().then(() => {
          MongoDB.close(client);

          resolve(true);
        }).catch((err) => {
          MongoDB.close(client);

          resolve(err);
        });
      });
    });
  }

  /**
   * Get total elements in the collection
   * @returns {Promise<any>}
   */
  getTotal() {
    return new Promise((resolve, reject) => {
      MongoDB.connect().then(({ client, db }) => {
        const collection = db.collection(Locations.COLLECTION_NAME);

        collection.countDocuments().then((total) => {
          MongoDB.close(client);

          resolve(total);
        }).catch((err) => {
          MongoDB.close(client);

          resolve(0);
        });
      });
    });
  }
}

module.exports = new Locations();
