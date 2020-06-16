const { Router } = require('express');
const Auction = require('../models/Auction');

module.exports = Router()
  .post('/', (req, res, next) => {
    Auction
      .create(req.body)
      .then(auction => res.send(auction))
      .catch(next);
  })
  
  .get('/', (req, res, next) => {
    Auction
      .find(req.query)
      .populate('user', {
        _id: true
      })
      .then(auctions => res.send(auctions))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Auction
      .findById(req.params.id)
      .populate('user', { email: true })
      .populate('bids', { price: true })
      .then(auction => res.send(auction))
      .catch(next);
  });
