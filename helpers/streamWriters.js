const stringify = require('csv-stringify');

//generators
const {
  generateUser,
  generateRoom,
  generateImage,
  generateDate,
  generateReview,
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

module.exports.writeUser = (stream, userID) => {
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
};

module.exports.writeRoom = (stream, roomID, userID) => {
  stringify([generateRoom(roomID, userID)], roomColumns, async (err, data) => {
    if (err) {
      return console.log(err);
    }
    if (!stream.write(data)) {
      await new Promise (resolve => {
        return stream.once('drain', resolve);
      });
    }
  });
};

module.exports.writeImage = (stream, imageID, roomID, yolkVerified) => {
  stringify([generateImage(imageID, roomID, yolkVerified)], imageColumns, async (err, data) => {
    if (err) {
      return console.log(err);
    }
    if (!stream.write(data)) {
      await new Promise (resolve => {
        return stream.once('drain', resolve);
      });
    }
  });
};

module.exports.writeRule = (stream, rules) => {
  stringify([rules], reservationRulesColumns, async (err, data) => {
    if (err) {
      return console.log(err);
    }
    if (!stream.write(data)) {
      await new Promise (resolve => {
        return stream.once('drain', resolve);
      });
    }
  });
};

module.exports.writeDate = (stream, roomID, date, price) => {
  stringify([generateDate(roomID, date, price)], dateColumns, async (err, data) => {
    if (err) {
      return console.log(err);
    }
    if (!stream.write(data)) {
      await new Promise (resolve => {
        return stream.once('drain', resolve);
      });
    }
  });
};

module.exports.writeReview = (stream, reviewID, roomID, guestID) => {
  stringify([generateReview(reviewID, roomID, guestID)], reviewColumns, async (err, data) => {
    if (err) {
      return console.log(err);
    }
    if (!stream.write(data)) {
      await new Promise (resolve => {
        return stream.once('drain', resolve);
      });
    }
  });
};