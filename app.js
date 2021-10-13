const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users');
const cards = require('./routes/cards');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6165b116acee0ab206a1cca0',
  };

  next();
});

app.use('/', users);

app.use('/', cards);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
