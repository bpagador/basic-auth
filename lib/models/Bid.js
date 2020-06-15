const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
    required: true
  },

  price: {
    type: Number, 
    required: true
  },

  quantity: {
    type: Number, 
    required: true
  },

  isAccepted: {
    type: Boolean, 
    required: true
  },
});

module.exports = mongoose.model ('Bid', schema);
