//randomizers
const randomInt = require('./helpers/randomizers').randomInt;

//generators
const {
  generateDateArray,
  fileNameGenerator,
} = require('./helpers/generators');

const {
  saveFile,
  writeUser,
  writeRoom,
  writeImage,
  writeRule,
  writeDate,
  writeReview,
} = require('./helpers/streamWriters');

const dataGenerator = (primaryRecordCount) => {
  const loopSize = 1;
  
  const startTime = new Date();
  const dateArray = generateDateArray(); //next 93 days
  
  let loops = 1;
  let userID = 1;
  let roomID = 1;
  let imageID = 1;
  let reviewID = 1;

  
  while (/* roomID */userID < primaryRecordCount) {
    
  
    const writeUsersStream = saveFile('users', loops);
    const userStream = writeUser(writeUsersStream);
    /* 
    const writeRoomsStream = fs.createWriteStream(fileNameGenerator('rooms', loops));
    const writeImagesStream = fs.createWriteStream(fileNameGenerator('images', loops));
    const writeRulesStream = fs.createWriteStream(fileNameGenerator('rules', loops));
    const writeDatesStream = fs.createWriteStream(fileNameGenerator('dates', loops));
 */
    for (let i = 0; i < loopSize; i += 1) {
      writeUser(userID);
/* 
      if (Boolean(randomInt(2) === 0)) {//user is a host
        const roomsHosted = randomInt(9, 1);
        for (let j = 0; j < roomsHosted; j += 1) {
          
          writeRoom(writeRoomsStream, roomID, userID);
          
          const yolkVerified = Boolean(randomInt(2) === 1);
          const randomImages = randomInt(5);

          for (let k = 0; k < randomImages; k += 1) {
            writeImage(writeImagesStream, imageID, roomID, yolkVerified);
            imageID += 1;
          }

          const basePrice = randomInt(300, 20);
          writeRule(writeRulesStream, roomID, basePrice);
          
          for (let k = 0; k < dateArray.length; k += 1) {
            writeDate(writeDatesStream, roomID, dateArray[k], basePrice);
          }
          roomID += 1;
        }
      }
      */
      userID += 1;
    }
    
    // writeUsersStream.end();
    /* 
    writeRoomsStream.end();
    writeImagesStream.end();
    writeRulesStream.end();
    writeDatesStream.end();
     */

    

    console.log(`Finished primary loop ${loops}: ${userID - 1} users, ${roomID - 1} rooms: ${new Date() - startTime} ms`)
    loops += 1;
  }
  console.log(`Primary Records Done! Finished ${loops -1} loops: ${userID - 1} users, ${roomID - 1} rooms: ${new Date() - startTime} ms`);
 /*  
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
  */
};

dataGenerator(5);

module.exports = dataGenerator;