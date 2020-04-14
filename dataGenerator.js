//generators
const {
  generateDateArray,
} = require('./helpers/generators');

const {
  saveFile,
  userPipeGenerator,
  roomPipeGenerator,
  imagePipeGenerator,
  datePipeGenerator,
  reviewPipeGenerator,
  rulesPipeGenerator,
} = require('./helpers/streamWriters');

//randomizers
const {
  randomInt, // random int (max, min]
} = require('./helpers/randomizers');

const dataGenerator = (primaryRecordCount) => {
  const loopSize = 5000;
  
  const startTime = new Date();
  const dateArray = generateDateArray(); //next 93 days
  
  let loops = 1;
  let userID = 1;
  let roomID = 1;
  let imageID = 1;
  let reviewID = 1;

  
  for (; roomID < primaryRecordCount; loops += 1) {
    const writeUser = userPipeGenerator(saveFile('users', loops));
    const writeRoom = roomPipeGenerator(saveFile('rooms', loops));
    const writeImage = imagePipeGenerator(saveFile('images', loops));
    const writeDate = datePipeGenerator(saveFile('dates', loops));
    const writeRules = rulesPipeGenerator(saveFile('rules', loops));
    
    for (let i = 0; i < loopSize; i += 1, userID += 1) {
      writeUser(userID);

      if (Boolean(randomInt(2) === 0)) { //user is a host
        const roomsHosted = randomInt(9, 1);
        for (let j = 0; j < roomsHosted; j += 1, roomID += 1) {
          
          writeRoom(roomID, userID);
          
          const yolkVerified = Boolean(randomInt(2) === 1);
          const imageCount = randomInt(5);

          for (let k = 0; k < imageCount; k += 1, imageID += 1) {
            writeImage(imageID, roomID, yolkVerified);
          }

          const basePrice = randomInt(300, 20);
          writeRules(roomID, basePrice);
          
          for (let k = 0; k < dateArray.length; k += 1) {
            writeDate(roomID, dateArray[k], basePrice);
          }
        }
      }
    }
    
    console.log(`Finished primary loop ${loops}: ${userID - 1} users, ${roomID - 1} rooms: ${new Date() - startTime} ms`);
  }
  console.log(`Primary Records Done! Finished ${loops -1} loops: ${userID - 1} users, ${roomID - 1} rooms: ${new Date() - startTime} ms`);
  
  // generate reviews
  // choose relative number of reviews here
  const avgReviewsPerRoom = 5;
  // restart loop count for file naming purposes
  loops = 1;

  // generate at least (avg * rooms) reviews
  while (reviewID < roomID * avgReviewsPerRoom) {
    // open file stream
    const writeReview = reviewPipeGenerator(saveFile('reviews', loops));
    for (let i = 0; i < loopSize; i += 1, reviewID += 1) {
      const randomRoomID = randomInt(roomID + 1, 1);
      const randomGuest = randomInt(userID + 1, 1);
      writeReview(reviewID, randomRoomID, randomGuest);
    }

    console.log(`Finished secondary loop ${loops}: generated ${reviewID - 1} reviews: ${new Date() - startTime} ms`);
    loops += 1;
  }
  console.log(`Secondary Records Done! Finished ${loops -1} loops and generated ${reviewID - 1} reviews: ${new Date() - startTime} ms`);
  console.log(`Final results: ${roomID - 1} rooms, ${userID -1} users, ${reviewID - 1} reviews: ${new Date() - startTime} ms`);
};

dataGenerator(1000000);

module.exports = dataGenerator;