const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: `Ошибка сервера: ${err}` }));
};

module.exports.deleteCard = (req, res) => {
  const id = req.params.cardId;
  Card.findByIdAndRemove(id)
    .orFail(new Error('NotFound'))
    .catch((err) => {
      if (err.massege === 'NotFound') {
        res.status(404).send({ message: `Пользователь не найден: ${err}` });
      }
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Некорректный id: ${err}` });
        return;
      }
      res.status(500).send({ message: `Ошибка сервера: ${err}` });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Ошибка валидации: ${err}` });
        return;
      }
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .orFail(new Error('NotFound'))
    .catch((err) => {
      if (err.massege === 'NotFound') {
        res.status(404).send({ message: `Пользователь не найден: ${err}` });
      }
    })
    .then((likes) => res.send({ data: likes }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Некорректный id: ${err}` });
        return;
      }
      res.status(500).send({ message: `Ошибка сервера: ${err}` });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true })
    .orFail(new Error('NotFound'))
    .catch((err) => {
      if (err.massege === 'NotFound') {
        res.status(404).send({ message: `Пользователь не найден: ${err}` });
      }
    })
    .then((likes) => res.send({ data: likes }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Некорректный id: ${err}` });
        return;
      }
      res.status(500).send({ message: `Ошибка сервера: ${err}` });
    });
};
