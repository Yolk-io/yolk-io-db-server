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

const dataGenerator = async (primaryRecordCount) => {
  const loopSize = 100000;
  
  const startTime = new Date();
  const dateArray = generateDateArray(); //next 93 days
  
  let loops = 1;
  let userID = 1;
  let roomID = 1;
  let imageID = 1;
  let reviewID = 1;

  
  // for (; roomID < primaryRecordCount; loops += 1) {
    // use below instead for User-only tests
  for (; userID < primaryRecordCount; loops += 1) {
    const userWriteStream = saveFile('users', loops);
/*     const roomWriteStream = saveFile('rooms', loops);
    const imageWriteStream = saveFile('images', loops);
    const dateWriteStream = saveFile('dates', loops);
    const rulesWriteStream = saveFile('rules', loops); */
    const [userReadStream, writeUser] = userPipeGenerator(userWriteStream);
/*     const writeRoom = roomPipeGenerator(roomWriteStream);
    const writeImage = imagePipeGenerator(imageWriteStream);
    const writeDate = datePipeGenerator(dateWriteStream);
    const writeRules = rulesPipeGenerator(rulesWriteStream); */
    for (let i = 0; i < loopSize; i += 1, userID += 1) {
      const userWriteBool = writeUser(userID);
      if(!userWriteBool) {
        await new Promise((resolve) => userReadStream.once('drain', resolve));
      }

      /* if (Boolean(randomInt(2) === 0)) { //user is a host
        const roomsHosted = randomInt(9, 1);
        for (let j = 0; j < roomsHosted; j += 1, roomID += 1) {
          
          data.push(writeRoom(roomID, userID));
          
          const yolkVerified = Boolean(randomInt(2) === 1);
          const imageCount = randomInt(5);

          for (let k = 0; k < imageCount; k += 1, imageID += 1) {
            data.push(writeImage(imageID, roomID, yolkVerified));
          }

          const basePrice = randomInt(300, 20);
          data.push(writeRules(roomID, basePrice));
          
          for (let k = 0; k < dateArray.length; k += 1) {
            data.push(writeDate(roomID, dateArray[k], basePrice));
          }
        }
      } */
    }
    console.log(`Finished primary loop ${loops}: ${userID - 1} users, ${roomID - 1} rooms: ${new Date() - startTime} ms`);
  }
  console.log(`Primary Records Done! Finished ${loops -1} loops: ${userID - 1} users, ${roomID - 1} rooms: ${new Date() - startTime} ms`);
  
  // // generate reviews
  // // choose relative number of reviews here
/*   const avgReviewsPerRoom = 5;
  // restart loop count for file naming purposes
  loops = 1;

  // generate at least (avg * rooms) reviews
  for (; reviewID < roomID * avgReviewsPerRoom; loops += 1) {
    // open file stream
    const reviewWriteStream = saveFile('reviews', loops);
    const writeReview = reviewPipeGenerator(reviewWriteStream);
    const data = [];
    for (let i = 0; i < loopSize; i += 1, reviewID += 1) {
      const randomRoomID = randomInt(roomID + 1, 1);
      const randomGuest = randomInt(userID + 1, 1);
      data.push(writeReview(reviewID, randomRoomID, randomGuest));
    }
    await Promise.all(data);
    console.log(`Finished secondary loop ${loops}: generated ${reviewID - 1} reviews: ${new Date() - startTime} ms`);
  }
  console.log(`Secondary Records Done! Finished ${loops -1} loops and generated ${reviewID - 1} reviews: ${new Date() - startTime} ms`); */
  console.log(`Final results: ${roomID - 1} rooms, ${userID -1} users, ${reviewID - 1} reviews: ${new Date() - startTime} ms`);
};

dataGenerator(10000000);

module.exports = dataGenerator;