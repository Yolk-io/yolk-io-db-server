const fs = require('fs');
const stringify = require('csv-stringify');

//randomizers
const randomInt = require('./helpers/randomizers').randomInt;

//generators
const {
  generateDateArray,
  generateReservationRules,
  fileNameGenerator,
} = require('./helpers/generators');

const {
  writeUser,
  writeRoom,
  writeImage,
  writeRule,
  writeDate,
  writeReview,
} = require('./helpers/streamWriters');

const dataGenerator = (primaryRecordCount) => {
  // keep start time in memory for time reporting
  const startTime = new Date();
  // modify the relative file size of each file write
  const loopSize = 100;
  // generate an array of the next 93 dates
  const dateArray = generateDateArray();
  // start IDs for identified objects at 1
  let loops = 1;
  let userID = 1;
  let roomID = 1;
  let imageID = 1;
  let reviewID = 1;

  // generate at least as many rooms as requested
  while (roomID < primaryRecordCount) {
    
    // open file streams
    const writeUsersStream = fs.createWriteStream(fileNameGenerator('users', loops));
    const writeRoomsStream = fs.createWriteStream(fileNameGenerator('rooms', loops));
    const writeImagesStream = fs.createWriteStream(fileNameGenerator('images', loops));
    const writeRulesStream = fs.createWriteStream(fileNameGenerator('rules', loops));
    const writeDatesStream = fs.createWriteStream(fileNameGenerator('dates', loops));

    // generate exactly as many users per loop as the loop size
    for (let i = 0; i < loopSize; i += 1) {
      // write user to csv
      writeUser(writeUsersStream, userID);

      // randomly determine if a user is a host
      if (Boolean(randomInt(2) === 0)) {
        // and if so, assign them a random number of rooms
        const roomsHosted = randomInt(9, 1);
        for (let j = 0; j < roomsHosted; j += 1) {
          // write rooms to csv
          writeRoom(writeRoomsStream, roomID, userID);
          // randomly assign Yolk.io verification status and number of images
          const yolkVerified = Boolean(randomInt(2) === 1);
          const randomImages = randomInt(5);
          // write images to csv
          for (let k = 0; k < randomImages; k += 1) {
            writeImage(writeImagesStream, imageID, roomID, yolkVerified);
            imageID += 1;
          }
          // write reservation rules to csv
            // separately because the base_price is referenced below
          const rules = generateReservationRules(roomID);
          writeRule(writeRulesStream, rules);
          
          // write dates to csv
          for (let k = 0; k < dateArray.length; k += 1) {
            writeDate(writeDatesStream, roomID, dateArray[k], rules.base_price);
          }
          //after all room-specific operations are done, increment roomID
          roomID += 1;
        }
      }
      //after all user-specific operations are done, increment userID
      userID += 1;
    }
    
    // close file streams
    /* 
    writeUsersStream.end();
    writeRoomsStream.end();
    writeImagesStream.end();
    writeRulesStream.end();
    writeDatesStream.end();
     */

    

    console.log(`Finished primary loop ${loops}: ${userID - 1} users, ${roomID - 1} rooms: ${new Date() - startTime} ms`)
    loops += 1;
  }
  console.log(`Primary Records Done! Finished ${loops -1} loops: ${userID - 1} users, ${roomID - 1} rooms: ${new Date() - startTime} ms`);
  
  // generate reviews
  // choose relative number of reviews here
  const avgReviewsPerRoom = 2;
  // restart loop count for file naming purposes
  loops = 1;

  // generate at least (avg * rooms) reviews
  while (reviewID < roomID * avgReviewsPerRoom) {
    // open file stream
    const writeReviewsStream = fs.createWriteStream(fileNameGenerator('reviews', loops));
    for (let i = 0; i < loopSize; i += 1) {
      const randomRoomID = randomInt(roomID + 1, 1);
      const randomGuest = randomInt(userID + 1, 1);
      //write review to CSV
      writeReview(writeReviewsStream, reviewID, randomRoomID, randomGuest);
      reviewID += 1;
    }
    // close file stream
    // writeReviewsStream.end();

    console.log(`Finished secondary loop ${loops}: generated ${reviewID - 1} reviews: ${new Date() - startTime} ms`);
    loops += 1;
  }
  console.log(`Secondary Records Done! Finished ${loops -1} loops and generated ${reviewID - 1} reviews: ${new Date() - startTime} ms`);
};

dataGenerator(100);

module.exports = dataGenerator;