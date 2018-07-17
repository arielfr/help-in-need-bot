const dms2dec = require('dms2dec');

class LocationUtil {
  /**
   * Get location data from exif in dms format
   * @param exif
   * @returns {{latitude: *, latitudeRef: *, longitude: *, longitudeRef: *}}
   */
  static fromExif(exif) {
    const gps = exif.gps;

    return {
      lat: gps.GPSLatitude,
      latRef: gps.GPSLatitudeRef,
      long: gps.GPSLongitude,
      longRef: gps.GPSLongitudeRef,
    };
  }

  /**
   * Get location data from exif in dec format
   * @param exif
   * @returns {{latitude: *, longitude: *}}
   */
  static fromExifDec(exif) {
    const gps = exif.gps;

    const dec = dms2dec(gps.GPSLatitude, gps.GPSLatitudeRef, gps.GPSLongitude, gps.GPSLongitudeRef);

    return {
      lat: dec[0],
      long: dec[1],
    };
  }
}

module.exports = LocationUtil;
