const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      res.status(500).send({ message: `Ошибка сервера: ${err}` });
    });
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.params._id)
    .orFail(new Error('NotFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Некорректный id: ${err}` });
      } else if (err.massege === 'NotFound') {
        res.status(404).send({ message: `Пользователь по указанному _id не найден: ${err}` });
      }
      res.status(500).send({ message: `Ошибка по умолчанию: ${err}` });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Переданы некорректные данные при создании пользователя: ${err}` });
        return;
      }
      res.status(500).send({ message: `Ошибка по умолчанию: ${err}` });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id,
    { name, about },
    { new: true })
    .orFail(new Error('NotFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Переданы некорректные данные при обновлении профиля: ${err}` });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: `Переданы некорректные данные при обновлении профиля: ${err}` });
      } else if (err.massege === 'NotFound') {
        res.status(404).send({ message: `Пользователь с указанным _id не найден: ${err}` });
      }
      res.status(500).send({ message: `Ошибка по умолчанию: ${err}` });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id,
    { avatar },
    { new: true })
    .orFail(new Error('NotFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Переданы некорректные данные при обновлении профиля: ${err}` });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: `Переданы некорректные данные при обновлении профиля: ${err}` });
      } else if (err.massege === 'NotFound') {
        res.status(404).send({ message: `Пользователь с указанным _id не найден: ${err}` });
      }
      res.status(500).send({ message: `Ошибка по умолчанию: ${err}` });
    });
};
