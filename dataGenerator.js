const faker = require('faker');

const randomInt = (max, min = 0) => {
  return Math.floor(Math.random() * (max - min)) + min;
} 

const randomUserImage = () => {
  const images = [
    'url1', 'url2', 'url3', 'url4', 'url5', 'url6', 'url7', 'url8', 'url9', 'url10'
  ]
  return images[randomInt(10)];
}

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