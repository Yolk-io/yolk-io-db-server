const prompts = require('prompts');
const pg = require('pg');
const express = require('express');

(async () => {
  const login = await prompts([
    {
    type: 'text',
    name: 'username',
    message: 'Username: '
  },
  {
    type: 'text',
    name: 'password',
    message: 'Password: '
  }
]);

const app = express();
const port = 8080;
app.listen(port, () => {console.log(`Now listening on port ${port}`)});
app.use('/', (req, res) => res.send('Hello World!'));
console.log(login);
})();
