const { Router } = require('express');
const Bid = require('../models/Auction');

const { ensureAuth } = require('../middleware/ensureAuth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Bid
      .findOneAndUpdate({ user: req.body.user, auction: req.body.auction }, req.body, { new: true, upsert:true })
      .then(bid => res.send(bid))
      .catch(next);
  });
