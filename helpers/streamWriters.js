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


// const generatePromisifiedStringifier = (generator, options) => {
//   return (...params) => (
//     new Promise ((resolve, reject) => {
//       stringify([generator(...params)], options, (err, data) => (
//         err ? reject (err) : resolve (data)
//       ));
//     })
//   );
// };


// function writeStream(stream, stringifier) => {
//   return (params) => {

//   }
// }

const streamWriterGenerator = (generator, options) => {
  return (writeStream) => {
    const readStream = stringify(options);
    readStream.pipe(writeStream);
    return (...params) => {
      readStream.write([generator(...params)]);
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
}
// module.exports.userPipeGenerator = streamWriterGenerator(generateUser, userColumns);


// module.exports.userStreamWriter = (writeStream) => {
//   const readStream = stringify(userColumns);
//   readStream.pipe(writeStream);
//   return (userID) => {
//     readStream.write([generateUser(userID)])
//   };
// }

// module.exports.writeUser = (params, stream) => {
//   generatePromisifiedStringifier(generateUser, userColumns)(params)
//   .then((data) => {if (!stream.write(data))});
// };



/* module.exports.writeUser = (stream, userID) => {
  stringify([generateUser(userID)], userColumns, async (err, data) => {
    if (err) {
      return console.log(err);
    }
    if (!stream.write(data)) {
      await new Promise (resolve => {
        return stream.once('drain', resolve);
      });
    }
  });
}; */

// module.exports.writeRoom = (stream, roomID, userID) => {
//   stringify([generateRoom(roomID, userID)], roomColumns, async (err, data) => {
//     if (err) {
//       return console.log(err);
//     }
//     if (!stream.write(data)) {
//       await new Promise (resolve => {
//         return stream.once('drain', resolve);
//       });
//     }
//   });
// };

// module.exports.writeImage = (stream, imageID, roomID, yolkVerified) => {
//   stringify([generateImage(imageID, roomID, yolkVerified)], imageColumns, async (err, data) => {
//     if (err) {
//       return console.log(err);
//     }
//     if (!stream.write(data)) {
//       await new Promise (resolve => {
//         return stream.once('drain', resolve);
//       });
//     }
//   });
// };

// module.exports.writeRule = (stream, roomID, basePrice) => {
//   stringify([generateReservationRules(roomID, basePrice)], reservationRulesColumns, async (err, data) => {
//     if (err) {
//       return console.log(err);
//     }
//     if (!stream.write(data)) {
//       await new Promise (resolve => {
//         return stream.once('drain', resolve);
//       });
//     }
//   });
// };

// module.exports.writeDate = (stream, roomID, date, price) => {
//   stringify([generateDate(roomID, date, price)], dateColumns, async (err, data) => {
//     if (err) {
//       return console.log(err);
//     }
//     if (!stream.write(data)) {
//       await new Promise (resolve => {
//         return stream.once('drain', resolve);
//       });
//     }
//   });
// };

// module.exports.writeReview = (stream, reviewID, roomID, guestID) => {
//   stringify([generateReview(reviewID, roomID, guestID)], reviewColumns, async (err, data) => {
//     if (err) {
//       return console.log(err);
//     }
//     if (!stream.write(data)) {
//       await new Promise (resolve => {
//         return stream.once('drain', resolve);
//       });
//     }
//   });
// };