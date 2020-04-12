const fs = require('fs');
const stringify = require('csv-stringify');
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

const fileNameGenerator = (type, loopcount, dir = './.seed') => {
  return `${dir}/${type}${loopcount}.csv`;
};

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
  
  // configure columns for csv-stringify
  const userColumns = {
    columns: [
      {key: 'id'},
      {key: 'username'},
      {key: 'is_super_host'},
      {key: 'profile_image_url'}
    ]    
  };

  const roomColumns = {
    columns: [
      {key: 'id'},
      {key: 'host_id'},
      {key: 'room_name'},
      {key: 'description'},
      {key: 'type_of_place'},
      {key: 'city'},
    ]    
  };
  
  const imageColumns = {
    columns: [
      {key: 'id'},
      {key: 'room_id'},
      {key: 'url'},
      {key: 'comment'},
      {key: 'yolk_verified'}
    ]    
  };

  const reservationRulesColumns = {
    columns: [
      {key: 'room_id'},
      {key: 'guest_limit'},
      {key: 'base_price'}
    ]    
  };

  const dateColumns = {
    columns: [
      {key: 'room_id'},
      {key: 'date'},
      {key: 'is_rented'},
      {key: 'check_in'},
      {key: 'check_out'},
      {key: 'price'}
    ]    
  };

  const reviewColumns = {
    columns: [
      {key: 'id'},
      {key: 'room_id'},
      {key: 'guest_id'},
      {key: 'rating'},
      {key: 'comment'},
      {key: 'host_reply'}
    ]    
  };

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
      stringify([generateUser(userID)], userColumns, async (err, data) => {
        if (err) {
          return console.log(err);
        }
        if (!writeUsersStream.write(data)) {
          await new Promise (resolve => {
            return writeUsersStream.once('drain', resolve);
          });
        }
      });

      // randomly determine if a user is a host
      if (Boolean(randomInt(2) === 0)) {
        // and if so, assign them a random number of rooms
        const roomsHosted = randomInt(9, 1);
        for (let j = 0; j < roomsHosted; j += 1) {
          // write rooms to csv
          stringify([generateRoom(roomID, userID)], roomColumns, async (err, data) => {
            if (err) {
              return console.log(err);
            }
            if (!writeRoomsStream.write(data)) {
              await new Promise (resolve => {
                return writeRoomsStream.once('drain', resolve);
              });
            }
          });
          // randomly assign Yolk.io verification status and number of images
          const yolkVerified = Boolean(randomInt(2) === 1);
          const randomImages = randomInt(5);
          // write images to csv
          for (let k = 0; k < randomImages; k += 1) {
            stringify([generateImage(imageID, roomID, yolkVerified)], imageColumns, async (err, data) => {
              if (err) {
                return console.log(err);
              }
              if (!writeImagesStream.write(data)) {
                await new Promise (resolve => {
                  return writeImagesStream.once('drain', resolve);
                });
              }
            });
            imageID += 1;
          }
          // write reservation rules to csv
            // separately because the base_price is referenced below
          const rules = generateReservationRules(roomID);
          stringify([rules], reservationRulesColumns, async (err, data) => {
            if (err) {
              return console.log(err);
            }
            if (!writeRulesStream.write(data)) {
              await new Promise (resolve => {
                return writeRulesStream.once('drain', resolve);
              });
            }
          });
          
          // write dates to csv
          for (let k = 0; k < dateArray.length; k += 1) {
            stringify([generateDate(roomID, dateArray[k], rules.base_price)], dateColumns, async (err, data) => {
              if (err) {
                return console.log(err);
              }
              if (!writeDatesStream.write(data)) {
                await new Promise (resolve => {
                  return writeDatesStream.once('drain', resolve);
                });
              }
            });
          }
          //after all room-specific operations are done, increment roomID
          roomID += 1;
        }
      }
      //after all user-specific operations are done, increment userID
      userID += 1;
    }
    
    // close file streams

    
    writeUsersStream.end();
    writeRoomsStream.end();
    writeImagesStream.end();
    writeRulesStream.end();
    writeDatesStream.end();

    

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
      stringify([generateReview(reviewID, randomRoomID, randomGuest)], reviewColumns, async (err, data) => {
        if (err) {
          return console.log(err);
        }
        if (!writeReviewsStream.write(data)) {
          await new Promise (resolve => {
            return writeReviewsStream.once('drain', resolve);
          });
        }
      });
      reviewID += 1;
    }
    // close file stream
    writeReviewsStream.end();

    console.log(`Finished secondary loop ${loops}: generated ${reviewID - 1} reviews: ${new Date() - startTime} ms`);
    loops += 1;
  }
  console.log(`Secondary Records Done! Finished ${loops -1} loops and generated ${reviewID - 1} reviews: ${new Date() - startTime} ms`);
};

dataGenerator(50000);

module.exports = dataGenerator;