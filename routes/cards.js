const card = require('express').Router();
const { Card, Id } = require('../middlewares/validator');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

card.get('/cards', getCards);
card.post('/cards', Card, createCard);
card.delete('/cards/:cardId', Id, deleteCard);
card.put('/cards/:_id/likes', Id, likeCard);
card.delete('/cards/:_id/likes', Id, dislikeCard);

module.exports = card;
