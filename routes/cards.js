const card = require('express').Router();
const validator = require('../middlewares/validator');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

card.get('/cards', getCards);
card.post('/cards', validator, createCard);
card.delete('/cards/:cardId', deleteCard);
card.put('/cards/:_id/likes', likeCard);
card.delete('/cards/:_id/likes', dislikeCard);

module.exports = card;
