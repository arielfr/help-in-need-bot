const FilesUtil = require('./utils/files');

FilesUtil.readExif('./IMG_1766.JPG').then(image => {
  const gpsLocation = image.gps;
  console.log(gpsLocation);
});
