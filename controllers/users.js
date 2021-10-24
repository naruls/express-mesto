const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const CastError = require('../errors/CastError');
const ValidationError = require('../errors/ValidationError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.params._id)
    .orFail(() => new NotFoundError({ message: 'Нет пользователя с таким id' }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new CastError({ message: `Некорректный id: ${err}` });
      } else if (err.message === 'NotFound') {
        throw new NotFoundError({ message: `Пользователь по указанному _id не найден: ${err}` });
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then(hash =>
      User.create({ name
        about,
        avatar,
        email,
        password: hash,
      }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError({ message: `Переданы некорректные данные при создании пользователя: ${err}` });
        return;
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id,
    { name, about },
    { new: true })
    .orFail(() => new NotFoundError({ message: 'Нет пользователя с таким id' }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError({ message: `Переданы некорректные данные при обновлении профиля: ${err}` });
      } else if (err.name === 'CastError') {
        throw new CastError({ message: `Переданы некорректные данные при обновлении профиля: ${err}` });
      } else if (err.message === 'NotFound') {
        throw new NotFoundError({ message: `Пользователь с указанным _id не найден: ${err}` });
      }
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id,
    { avatar },
    { new: true })
    .orFail(() => new NotFoundError({ message: 'Нет пользователя с таким id' }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError({ message: `Переданы некорректные данные при обновлении профиля: ${err}` });
      } else if (err.name === 'CastError') {
        throw new CastError({ message: `Переданы некорректные данные при обновлении профиля: ${err}` });
      } else if (err.message === 'NotFound') {
        throw new NotFoundError({ message: `Пользователь с указанным _id не найден: ${err}` });
      }
    })
    .catch(next);
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: 'Авторизация прошла успешно' });
    })
    .catch(next);
};
