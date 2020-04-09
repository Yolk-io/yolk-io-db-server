const faker = require('faker');

// generate a random integer [min, max)
const randomInt = (max, min = 0) => {
  return Math.floor(Math.random() * (max - min)) + min;
} 

// generate a random rating (ratings tend to skew high)
const randomRating = () => {
  return Math.floor((1 - Math.pow((Math.random()), 2)) * 5) + 1;
}

// convert a date to YYYY-MM-DD format
const formatDate = (date) => {
  const YYYY = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2,'0');
  const DD = String(date.getDate()).padStart(2,'0');

  return `${YYYY}-${MM}-${DD}`;
}

// generate dates in YYYY-MM-DD format for 93 days
const generateDateArray = () => {
  let date = new Date();
  const output = [];
  for (let i = 0; i < 93; i += 1) {
    date.setDate(date.getDate() + 1);
    output.push(formatDate(date));
  }
  return output;
}

// choose a profile image for a user from 10 preselected options
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
  return images[randomInt(images.length)];
};

// choose a room image for a room from 10 preselected options
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
  return images[randomInt(images.length)];
};

// place_type enum for rooms
const randomPlace = () => {
  const places = [
    'Entire Place',
    'Hotel Room',
    'Private Room',
    'Shared Room',
  ];
  return places[randomInt(places.length)]
};

// city enum for rooms
const randomCity = () => {
  const cities = [
    'Baltimore', 
    'Seattle', 
    'New York', 
    'Boston', 
    'Portland', 
    'Los Angeles', 
    'San Francisco', 
    'Houston', 
    'Philadelphia', 
    'Charleston',
  ];
  return cities[randomInt(cities.length)];
}

const generateUser = (id) => {
  const isHost = Boolean(id % 2 === 0);
  const superHost = Boolean(isHost && (id % 3 === 0));
  return {
    id,
    username: `${faker.name.firstName()} ${faker.name.lastName()}`,
    is_super_host: superHost,
    profile_image_url: `${randomUserImage()}`,
  };
};

const generateRoom = (id, host_id) => {
  const place = randomPlace();
  const name = `${faker.fake(`{{commerce.productAdjective}} {{lorem.word}}`)} ${place}`;
  return {
    id,
    host_id,
    room_name: name,
    description: faker.fake('{{lorem.sentences}}\n{{lorem.sentences}}'),
    type_of_place: place,
    city: randomCity(),
  };
}

const generateImage = (id, room_id, yolk_verified) => {
  const url = randomRoomImage();
  return {
    id,
    room_id,
    url,
    comment: faker.lorem.sentence(),
    yolk_verified,
  };
};

const generateReservationRules = (room_id) => {
  const guestLimit = randomInt(16, 1);
  const basePrice = randomInt(300, 20);
  return {
    room_id,
    guest_limit: guestLimit,
    base_price: basePrice,
  };
};

const generateDate = (room_id, date, basePrice) => {
  const customPrice = (Boolean(randomInt(8) === 5) ? basePrice + 30 : basePrice);
  return {
    room_id,
    date,
    is_rented: false,
    check_in: true,
    check_out: true,
    price: customPrice
  };
}

const generateReview = (id, room_id, guest_id) => {
  const rating = randomRating();
  const comment = faker.lorem.sentences(randomInt(6, 1));
  const host_reply = (rating < 5 ? faker.lorem.sentences(5 - rating) : null);
  return {
    id,
    room_id,
    guest_id,
    rating,
    comment,
    host_reply
  };
};

const dataGenerator = (primaryRecordCount) => {
  const startTime = new Date();
  var roomID = 1;
  const loopSize = 10000;
  var loops = 1;
  var userID =1;
  var imageID = 1;
  var reviewID = 1;
  const dateArray = generateDateArray();

  //TEST CSV
  var csv = [];

  for (; roomID < primaryRecordCount; ) {
    for (let i = 0; i < loopSize; i += 1) {
      const user = generateUser(userID);
      if (Boolean(userID %2 === 0)) {
        const roomsHosted = randomInt(9, 1);
        for (let j = 0; j < roomsHosted; j += 1) {
          const room = generateRoom(roomID, userID);
          //write room to CSV
          csv.push(room);
          const yolkVerified = Boolean(randomInt(2) === 1);
          const randomImages = randomInt(5);
          for (let k = 0; k < randomImages; k += 1) {
            const image = generateImage(imageID, roomID, yolkVerified);
            imageID += 1;
            //write image to CSV
            csv.push(image);
          }
          const reservationRules = generateReservationRules(roomID)
          //write reservation rules to CSV
          for (let k = 0; k < dateArray.length; k += 1) {
            const date = generateDate(roomID, dateArray[k], reservationRules.base_price);
            //write date to CSV
            csv.push(date);
          }
          //after all room-specific operations are done, increment roomID
          roomID += 1;
        }
      }
      //after all user-specific operations are done, increment userID
      userID += 1;
      //write user to CSV
      csv.push(user);
    }
    console.log(`Finished primary loop ${loops}: ${userID - 1} users, ${roomID - 1} rooms: ${new Date() - startTime} ms`)
    loops += 1;
  }
  console.log(`Primary Records Done! Finished ${loops -1} loops: ${userID - 1} users, ${roomID - 1} rooms: ${new Date() - startTime} ms`);
  // generate reviews
  // create a new iterator
  const avgReviewsPerRoom = 10;
  loops = 1;
  while (reviewID < roomID * avgReviewsPerRoom) {
    for (let i = 0; i < loopSize; i += 1) {
      const randomGuest = randomInt(userID + 1, 1);
      const randomRoomID = randomInt(roomID + 1, 1);
      const roomReview = generateReview(reviewID, randomRoomID, randomGuest);
      //write review to CSV
      csv.push(roomReview);
      reviewID += 1;
    }
    console.log(`Finished secondary loop ${loops}: generated ${reviewID - 1} reviews: ${new Date() - startTime} ms`);
    loops += 1;
  }
  console.log(`Secondary Records Done! Finished ${loops -1} loops and generated ${reviewID - 1} reviews: ${new Date() - startTime} ms`)
  return csv;
};

dataGenerator(100000);
// console.log(dataGenerator(10));

module.exports = dataGenerator;