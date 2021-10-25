const user = require('express').Router();
const validator = require('../middlewares/validator');
const {
  getUsers,
  getCurrentUser,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

user.get('/users', getUsers);
user.get('/users/:_id', validator, getCurrentUser);
user.get('/users/me', getUser);
user.patch('/users/me', updateUser);
user.patch('/users/me/avatar', updateAvatar);

module.exports = user;
