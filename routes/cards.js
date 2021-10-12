const card = require('express').Router();
const { getCards, createCard, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');

card.get('/cards', getCards);
card.post('/cards', createCard);
card.delete('/cards/:cardId', deleteCard);
card.put('/cards/:_id/likes', likeCard);
card.delete('/cards/:_id/likes', dislikeCard);

module.exports = card;