const faker = require('faker');

const {
  randomInt,
  randomRating,
  randomUserImage,
  randomRoomImage,
  randomPlace,
  randomCity,
} = require('./randomizers');

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

module.exports = {
  formatDate,
  generateDateArray,
  generateUser,
  generateRoom,
  generateImage,
  generateReservationRules,
  generateDate,
  generateReview,
  fileNameGenerator,
};
