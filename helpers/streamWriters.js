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

// working version
// const streamWriterGenerator = (generator, options) => {
//   return (writeStream) => {
//     const readStream = stringify(options);
//     readStream.pipe(writeStream);
//     return (...params) => {
//       return new Promise ((resolve, reject) => readStream.write(generator(...params), resolve));
//     }
//   }
// };

const streamWriterGenerator = (generator, options) => {
  return (writeStream) => {
    const readStream = stringify(options);
    readStream.pipe(writeStream);
    return [readStream, (...params) => {
      output = [];
      output.push(new Promise ((resolve, reject) => output.push(readStream.write(generator(...params)), resolve)));
      return output;
    }]
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
