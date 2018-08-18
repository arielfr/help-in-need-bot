const logger = require('winston-this')('locations-service');
const geolib = require('geolib');

/**
 * This class is going to store the users locations
 */
class Locations {
  constructor() {
    this.locations = [];
    this.minRadius = 50;
    this.searchRadius = 1000;
  }

  /**
   * Check if the location was already reported
   * @param lat
   * @param long
   * @returns {boolean}
   */
  isAlreadyReported({ lat, long }) {
    let isReported = false;

    for (let i = 0; i < this.locations.length; i++) {
      const currLocation = this.locations[i];

      // This means that the person is already reported
      if (this.isInsideRadius(lat, long, currLocation.lat, currLocation.long, this.minRadius)) {
        // Give more priority to that person
        currLocation.priority = currLocation.priority + 1;
        isReported = true;
        break;
      }
    }

    return isReported;
  }

  /**
   * Add location
   * @param lat
   * @param long
   */
  addLocation({ lat, long }) {
    if (!this.isAlreadyReported({ lat, long })) {
      logger.info(`Adding the location: Lat = ${lat} / Long = ${long}`);

      // If the person is not already added add it to the locations
      this.locations.push({
        lat,
        long,
        priority: 0,
      });
    } else {
      logger.info(`The person was already reported inside a min radius of ${this.minRadius}`);
    }
  };

  /**
   * Retrieve all the near locations
   * @param lat
   * @param long
   * @returns {Array}
   */
  getNearLocations({ lat, long }) {
    let nearLocations = [];

    for (let i = 0; i < this.locations.length; i++) {
      const currLocation = this.locations[i];

      // This means that the person is already reported
      if (this.isInsideRadius(lat, long, currLocation.lat, currLocation.long, this.searchRadius)) {
        // Add near location
        if (nearLocations.length < 5) {
          nearLocations.push({
            lat: currLocation.lat,
            long: currLocation.long,
            priority: currLocation.priority,
          });
        } else {
          break;
        }
      }
    }

    nearLocations.sort((curr, next) => next.priority - curr.priority);

    return nearLocations;
  }

  /**
   * Check if position is inside a radius from the center position
   * @param latitude
   * @param longitude
   * @param centerLatitude
   * @param centerLongitude
   * @param distance
   * @returns {boolean}
   */
  isInsideRadius(latitude, longitude, centerLatitude, centerLongitude, distance) {
    return geolib.isPointInCircle(
      {
        latitude,
        longitude,
      },
      {
        latitude: centerLatitude,
        longitude: centerLongitude,
      },
      distance
    );
  }

  /**
   * Get all the locations
   * @returns {Array}
   */
  getGmapsLocations() {
    return this.locations.map((l) => ({
      lat: l.lat,
      lng: l.long,
    }));
  }
}

module.exports = new Locations();
