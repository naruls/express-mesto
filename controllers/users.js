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
    .catch((err) => {
      if (err.massege === 'NotFound') {
        res.status(404).send({ message: `Пользователь не найден: ${err}` });
      }
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Некорректный id: ${err}` });
        return;
      }
      res.status(500).send({ message: `Ошибка сервера: ${err}` });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Ошибка валидации: ${err}` });
        return;
      }
      res.status(500).send({ message: `Ошибка сервера: ${err}` });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id,
    { name, about },
    { new: true })
    .orFail(new Error('NotFound'))
    .catch((err) => {
      if (err.massege === 'NotFound') {
        res.status(404).send({ message: `Пользователь не найден: ${err}` });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Ошибка валидации: ${err}` });
        return;
      }
      res.status(400).send({ message: `Переданы некорректные данные: ${err}` });
    })
    .then((user) => res.send({ data: user }));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id,
    { avatar },
    { new: true })
    .orFail(new Error('NotFound'))
    .catch((err) => {
      if (err.massege === 'NotFound') {
        res.status(404).send({ message: `Пользователь не найден: ${err}` });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Ошибка валидации: ${err}` });
        return;
      }
      res.status(400).send({ message: `Переданы некорректные данные: ${err}` });
    })
    .then((user) => res.send({ data: user }));
};
