// generate a random integer [min, max)
const randomInt = (max, min = 0) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

// generate a random rating (ratings tend to skew high)
const randomRating = () => {
  return Math.floor((1 - Math.pow((Math.random()), 2)) * 5) + 1;
};

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

module.exports = {
  randomInt,
  randomRating,
  randomUserImage,
  randomRoomImage,
  randomPlace,
  randomCity,
}