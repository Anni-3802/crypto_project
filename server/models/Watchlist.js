const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coinId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Watchlist', watchlistSchema);