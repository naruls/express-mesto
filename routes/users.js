const user = require('express').Router();
const { getUsers, getCurrentUser, createUser, updateUser, updateAvatar } = require('../controllers/users');

user.get('/users', getUsers);
user.get('/users/:_id', getCurrentUser);
user.post('/users', createUser);
user.patch('/users/me', updateUser);
user.patch('/users/me/avatar', updateAvatar);

module.exports = user;