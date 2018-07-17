const logger = require('winston-this')('locations-service');
const geolib = require('geolib');

class Locations {
  constructor() {
    this.locations = [];
    this.minRadius = 100;
  }

  isAlreadyReported({ lat, long }) {
    let isReported = false;

    for (let i = 0; i < this.locations.length; i++) {
      const currLocation = this.locations[0];

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
    // const officePosition = new Position(-34.5277426, -58.4687091);

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
   * Returns the distance from the origin point to the destination point
   * @param originLatitude
   * @param originLongitude
   * @param destinationLatitude
   * @param destinationLongitude
   * @returns {number}
   */
  getDistanceFromPoint(originLatitude, originLongitude, destinationLatitude, destinationLongitude) {
    return geolib.getDistance(
      {
        latitude: originLatitude,
        longitude: originLongitude,
      },
      {
        latitude: destinationLatitude,
        longitude: destinationLongitude,
      },
    );
  }
}

module.exports = new Locations();
