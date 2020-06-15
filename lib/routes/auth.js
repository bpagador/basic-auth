const { Router } = require('express');
const User = require('../models/User');
//technically User routes 

module.exports = Router()
  .post('/signup', (req, res, next) => {
    User
      .create(req.body)
      .then(user => res.send(user))
      .catch(next);
  });
