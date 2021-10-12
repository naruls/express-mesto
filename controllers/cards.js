const Card = require('../models/card');
const express = require('express');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) =>
      { res.send({ data: cards })})
    .catch((err) =>
      { res.status(500).send({ message: `Ошибка сервера: ${err}` });
    })
};

module.exports.deleteCard = (req, res) => {
  const id = req.params.cardId;
  Card.findByIdAndRemove(id)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: "Карточки с таким id нет" });
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      res.status(500).send({ message: `Ошибка сервера: ${err}` });
    })
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) =>
      { res.send({ data: card })})
    .catch((err) =>
      { res.status(500).send({ message: 'Ошибка сервера' })
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params._id,
  { $addToSet: { likes: req.user._id } },
  { new: true })
  .catch((err) => {
    res.status(404).send({ message: 'Карточки с таким id нет' });
    })
  .then((likes) =>
    res.send({ data: likes }))
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params._id,
  { $pull: { likes: req.user._id } },
  { new: true })
  .catch((err) => {
    res.status(404).send({ message: 'Карточки с таким id нет' });
    })
    .then((likes) =>
      res.send({ data: likes }))
};
