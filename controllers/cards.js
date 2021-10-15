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
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Переданы некорректные данные: ${err}` });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: `Карточка с указанным _id не найдена: ${err}` });
      }
      res.status(500).send({ message: `Ошибка по умолчанию: ${err}` });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Переданы некорректные данные при создании карточки: ${err}` });
        return;
      }
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .orFail(new Error('NotFound'))
    .then((likes) => res.send({ data: likes }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Переданы некорректные данные для постановки/снятии лайка: ${err}` });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: `Передан несуществующий _id карточки: ${err}` });
      }
      res.status(500).send({ message: `Ошибка по умолчанию: ${err}` });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true })
    .orFail(new Error('NotFound'))
    .then((likes) => res.send({ data: likes }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Переданы некорректные данные для постановки/снятии лайка: ${err}` });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: `Передан несуществующий _id карточки: ${err}` });
      }
      res.status(500).send({ message: `Ошибка по умолчанию: ${err}` });
    });
};
