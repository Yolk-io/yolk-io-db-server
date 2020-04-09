const faker = require('faker');

const randomInt = (max, min = 0) => {
  return Math.floor(Math.random() * (max - min)) + min;
} 

const randomUserImage = () => {
  const images = [
    "https://yolk-io-images.s3-us-west-1.amazonaws.com/avatars/377.png",
    "https://yolk-io-images.s3-us-west-1.amazonaws.com/avatars/378.png",
    "https://yolk-io-images.s3-us-west-1.amazonaws.com/avatars/379.png",
    "https://yolk-io-images.s3-us-west-1.amazonaws.com/avatars/380.png",
    "https://yolk-io-images.s3-us-west-1.amazonaws.com/avatars/381.png",
    "https://yolk-io-images.s3-us-west-1.amazonaws.com/avatars/382.png",
    "https://yolk-io-images.s3-us-west-1.amazonaws.com/avatars/383.png",
    "https://yolk-io-images.s3-us-west-1.amazonaws.com/avatars/384.png",
    "https://yolk-io-images.s3-us-west-1.amazonaws.com/avatars/385.png",
    "https://yolk-io-images.s3-us-west-1.amazonaws.com/avatars/386.png"
  ];
  return images[randomInt(10)];
};

const randomRoomImage = () => {
  const images = [
    'https://yolk-io-images1.s3-us-west-1.amazonaws.com/rooms/1.jpg',
    'https://yolk-io-images1.s3-us-west-1.amazonaws.com/rooms/2.jpg',
    'https://yolk-io-images1.s3-us-west-1.amazonaws.com/rooms/3.jpg',
    'https://yolk-io-images1.s3-us-west-1.amazonaws.com/rooms/4.jpg',
    'https://yolk-io-images1.s3-us-west-1.amazonaws.com/rooms/5.jpg',
    'https://yolk-io-images1.s3-us-west-1.amazonaws.com/rooms/6.jpg',
    'https://yolk-io-images1.s3-us-west-1.amazonaws.com/rooms/7.jpg',
    'https://yolk-io-images1.s3-us-west-1.amazonaws.com/rooms/8.jpg',
    'https://yolk-io-images1.s3-us-west-1.amazonaws.com/rooms/9.jpg',
    'https://yolk-io-images1.s3-us-west-1.amazonaws.com/rooms/10.jpg',
  ];
  return images[randomInt(10)];
};

const generateUser = (id) => {
  const isHost = !Boolean(id % 2);
  const superHost = Boolean(isHost && !(id % 3));
  return {
    id,
    username: `${faker.name.firstName()} ${faker.name.lastName()}`,
    is_super_host: superHost,
    profile_image_url: `${randomUserImage()}`,
  };
};

const dataGenerator = (primaryRecordCount) => {
  var roomID = 1;
  const loopSize = 250000;
  var loops = 1;
  var userID =1;
  var imageID = 1;
  var reviewID = 1;
  var dateID = 1;

  while (roomID < primaryRecordCount) {
    for (let i = 0; i < loopSize; i += 1) {
      const user = generateUser(userID);
      if (!Boolean(userID %2)) {
        const randomRoom = randomInt(9, 1);
        for (let j = 0; j < randomRoom; j += 1) {
          const room = generateRoom(roomID, userID);
          roomID += 1;
          //write room to CSV
        }
      }
      userID += 1;
      //write user to CSV
    }
    console.log(`Finished loop ${loops}: ${userID} users, ${roomID} rooms`)
  }
  console.log(`Done! Finished ${loops} loops: ${userID} users, ${roomID} rooms`);
};