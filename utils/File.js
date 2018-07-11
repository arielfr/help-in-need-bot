const fs = require('fs');
const download = require('download');
const ExifImage = require('exif').ExifImage;

class FilesUtil {
  /**
   * Download file from url
   * @param url
   * @param dest
   * @returns {Promise.<TResult>}
   */
  static downloadFile(url, dest) {
    return Promise.resolve().then(() => {
      return download(url).then(data => {
        fs.writeFileSync(dest, data);
        return true;
      }).catch(err => {
        return Promise.reject(`An error ocurr trying to download the file: ${err}`);
      });
    });
  }

  /**
   * Read file synchronous
   * @param location
   * @returns {Promise.<TResult>}
   */
  static read(location) {
    return Promise.resolve().then(() => {
      try {
        return fs.readFileSync(location, 'utf8');
      } catch (err) {
        return Promise.reject(`An error ocurr reading file: ${err}`);
      }
    });
  }

  /**
   * Read file as buffer
   * @param location
   * @returns {Promise<void>}
   */
  static readToBuffer(location) {
    return Promise.resolve().then(() => {
      try {
        return fs.readFileSync(location);
      } catch (err) {
        return Promise.reject(`An error ocurr reading file: ${err}`);
      }
    });
  }

  static readExif(location) {
    return new Promise((resolve, reject) => {
      this.readToBuffer(location).then(image => {
        ExifImage(image, (err, response) => {
          if (err) reject(err);

          resolve(response);
        });
      }).catch((err) => {
        reject(err);
      });
    })

  }

  /**
   * Create dir synchronous
   * @param dirPath
   * @returns {Promise.<TResult>}
   */
  static createDir(dirPath) {
    return Promise.resolve().then(() => {
      try {
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath);
        }

        return true;
      } catch (err) {
        return Promise.reject(`An error ocurr creating directory: ${err}`);
      }
    });
  }

  /**
   * Check if file exists
   * @param filePath
   * @returns {Promise.<TResult>}
   */
  static fileExists(filePath) {
    return Promise.resolve().then(() => {
      return fs.existsSync(filePath);
    });
  }

  /**
   * Create a createReadStream
   * @param filePath
   */
  static createReadStream(filePath) {
    return fs.createReadStream(filePath);
  }

  /**
   * Write file synchronous
   * @param filePath
   * @param content
   * @returns {*}
   */
  static writeFile(filePath, content) {
    return fs.writeFileSync(filePath, content);
  }
}

module.exports = FilesUtil;
