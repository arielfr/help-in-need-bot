const FileUtil = require('./utils/File');
const LocationUtil = require('./utils/Location');

FileUtil.readExif('./IMG_1766.JPG').then(exif => {
  const dec = LocationUtil.fromExifDec(exif);
  console.log(`https://www.google.com.ar/maps/search/${dec.latitude},${dec.longitude}`)
});
