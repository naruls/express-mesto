const User = require('../models/user');
const express = require('express');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) =>
      res.send({ data: users }))
    .catch((err) => {
      res.status(500).send({ message: `Ошибка сервера: ${err}` });
    })
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.params._id)
    .then((user) => {
      if (!user) {
          console.log('нет такого пользователя')
      }
      res.send({ data: user });
    })
    .catch((err) => {
      res.status(500).send({ message: `Ошибка сервера: ${err}` });
    })
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user =>
      res.send({ data: user }))
    .catch(err =>
      res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id,
  { name, about },
  { new: true })
    .catch((err) => {
      res.status(400 ).send({ message: 'Переданы некорректные данные' });
    })
    .then((user) =>
      res.send({ data: user }))
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id,
  { avatar },
  { new: true })
    .catch((err) => {
      res.status(400 ).send({ message: 'Переданы некорректные данные' });
    })
    .then((user) =>
      res.send({ data: user }))
};
