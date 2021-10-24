const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const CastError = require('../errors/CastError');
const ValidationError = require('../errors/ValidationError');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.deleteCard = (req, res) => {
  const id = req.params.cardId;
  Card.findByIdAndRemove(id)
    .orFail(() => new NotFoundError({ message: 'Нет пользователя с таким id' }))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new CastError({ message: `Переданы некорректные данные: ${err}` });
      } else if (err.message === 'NotFound') {
        throw new NotFoundError({ message: `Карточка с указанным _id не найдена: ${err}` });
      }
    })
    .catch(next);
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError({ message: `Переданы некорректные данные при создании карточки: ${err}` });
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .orFail(() => new NotFoundError({ message: 'Нет пользователя с таким id' }))
    .then((likes) => res.send({ data: likes }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new CastError({ message: `Переданы некорректные данные для постановки/снятии лайка: ${err}` });
      } else if (err.message === 'NotFound') {
        throw new NotFoundError({ message: `Передан несуществующий _id карточки: ${err}` });
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true })
    .orFail(() => new NotFoundError({ message: 'Нет пользователя с таким id' }))
    .then((likes) => res.send({ data: likes }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new CastError({ message: `Переданы некорректные данные для постановки/снятии лайка: ${err}` });
      } else if (err.message === 'NotFound') {
        throw new NotFoundError({ message: `Передан несуществующий _id карточки: ${err}` });
      }
    })
    .catch(next);
};
