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
      latitude: gps.GPSLatitude,
      latitudeRef: gps.GPSLatitudeRef,
      longitude: gps.GPSLongitude,
      longitudeRef: gps.GPSLongitudeRef,
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
      latitude: dec[0],
      longitude: dec[1],
    };
  }
}

module.exports = LocationUtil;
