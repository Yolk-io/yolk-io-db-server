//generators
const {
  generateDateArray,
} = require('./helpers/generators');

const {
  saveFile,
  userPipeGenerator,
  roomPipeGenerator,
  imagePipeGenerator,
  rulesPipeGenerator,
  datePipeGenerator,
  reviewPipeGenerator,
} = require('./helpers/streamWriters');

//randomizers
const {
  randomInt, // random int (max, min]
} = require('./helpers/randomizers');

const dataGenerator = async (primaryRecordCount) => {
  const loopSize = 10000;
  
  const startTime = new Date();
  const dateArray = generateDateArray(); //next 93 days
  
  let loops = 1;
  let userID = 1;
  let roomID = 1;
  let imageID = 1;
  let reviewID = 1;

  
  for (; roomID < primaryRecordCount; loops += 1) {
    // use below instead for User-only tests
  // for (; userID < primaryRecordCount; loops += 1) {
    const [userReadStream, writeUser] = userPipeGenerator(saveFile('users', loops));
    const [roomReadStream, writeRoom] = roomPipeGenerator(saveFile('rooms', loops));
    const [imageReadStream, writeImage] = imagePipeGenerator(saveFile('images', loops));
    const [rulesReadStream, writeRules] = rulesPipeGenerator(saveFile('rules', loops));
    const [dateReadStream, writeDate] = datePipeGenerator(saveFile('dates', loops));

    for (let i = 0; i < loopSize; i += 1, userID += 1) {
      if(!writeUser(userID)) {
        await new Promise((resolve) => userReadStream.once('drain', resolve));
      }

      if (Boolean(randomInt(2) === 0)) { //user is a host
        const roomsHosted = randomInt(9, 1);
        for (let j = 0; j < roomsHosted; j += 1, roomID += 1) {
          
          if(!writeRoom(roomID, userID)) {
            await new Promise((resolve) => roomReadStream.once('drain', resolve));
          }
          
          const yolkVerified = Boolean(randomInt(2) === 1);
          const imageCount = randomInt(5);

          for (let k = 0; k < imageCount; k += 1, imageID += 1) {
            if(!writeImage(imageID, roomID, yolkVerified)){
              await new Promise((resolve) => imageReadStream.once('drain', resolve));
            }
          }

          const basePrice = randomInt(300, 20);
          if(!writeRules(roomID, basePrice)) {
            await new Promise((resolve) => rulesReadStream.once('drain', resolve));
          }
          
          for (let k = 0; k < dateArray.length; k += 1) {
            if(!writeDate(roomID, dateArray[k], basePrice)) {
              await new Promise((resolve) => dateReadStream.once('drain', resolve));
            }
          }
        }
      }
    }
    console.log(`Finished primary loop ${loops}: ${userID - 1} users, ${roomID - 1} rooms: ${new Date() - startTime} ms`);
  }
  console.log(`Primary Records Done! Finished ${loops -1} loops: ${userID - 1} users, ${roomID - 1} rooms: ${new Date() - startTime} ms`);
  
  // // generate reviews
  // // choose relative number of reviews here
  const avgReviewsPerRoom = 5;
  // restart loop count for file naming purposes
  loops = 1;

  // generate at least (avg * rooms) reviews
  for (; reviewID < roomID * avgReviewsPerRoom; loops += 1) {
    // open file stream
    const [reviewReadStream, writeReview] = reviewPipeGenerator(saveFile('reviews', loops));
    for (let i = 0; i < loopSize; i += 1, reviewID += 1) {
      const randomRoomID = randomInt(roomID + 1, 1);
      const randomGuest = randomInt(userID + 1, 1);
      if(!writeReview(reviewID, randomRoomID, randomGuest)) {
        await new Promise((resolve) => reviewReadStream.once('drain', resolve));
      }
    }
    console.log(`Finished secondary loop ${loops}: generated ${reviewID - 1} reviews: ${new Date() - startTime} ms`);
  }
  console.log(`Secondary Records Done! Finished ${loops -1} loops and generated ${reviewID - 1} reviews: ${new Date() - startTime} ms`);
  console.log(`Final results: ${roomID - 1} rooms, ${userID -1} users, ${reviewID - 1} reviews: ${new Date() - startTime} ms`);
};

dataGenerator(50000);

module.exports = dataGenerator;