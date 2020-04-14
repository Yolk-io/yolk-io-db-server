const fs = require('fs');
const stringify = require('csv-stringify');

//generators
const {
  generateUser,
  generateRoom,
  generateImage,
  generateDate,
  generateReview,
  generateReservationRules,
  fileNameGenerator,
} = require('./generators');

//csv-stringify configuration objects
const {
  userColumns,
  roomColumns,
  imageColumns,
  reservationRulesColumns,
  dateColumns,
  reviewColumns,
} = require('./tableColumns');


const saveFile = (prefix, suffix) => {
  return fs.createWriteStream(fileNameGenerator(prefix, suffix));
};

const streamWriterGenerator = (generator, options) => {
  return (writeStream) => {
    const readStream = stringify(options);
    readStream.pipe(writeStream);
    return (...params) => {
      readStream.write(generator(...params));
    }
  }
};

module.exports = {
  saveFile,
  userPipeGenerator: streamWriterGenerator(generateUser, userColumns),
  roomPipeGenerator: streamWriterGenerator(generateRoom, roomColumns),
  imagePipeGenerator: streamWriterGenerator(generateImage, imageColumns),
  datePipeGenerator: streamWriterGenerator(generateDate, dateColumns),
  reviewPipeGenerator: streamWriterGenerator(generateReview, reviewColumns),
  rulesPipeGenerator: streamWriterGenerator(generateReservationRules, reservationRulesColumns),
};
