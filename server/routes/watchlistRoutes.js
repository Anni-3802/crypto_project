const express = require('express');
const Watchlist = require('../models/Watchlist');
const { protect } = require('../middleware/authmiddleware');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const list = await Watchlist.find({ userId: req.user.id });
  res.json(list);
});

router.post('/:id', protect, async (req, res) => {
  const exists = await Watchlist.findOne({ userId: req.user.id, coinId: req.params.id });
  if (exists) return res.status(400).json({ message: 'Already in watchlist' });
  const added = await Watchlist.create({ userId: req.user.id, coinId: req.params.id });
  res.json(added);
});

router.delete('/:id', protect, async (req, res) => {
  await Watchlist.findOneAndDelete({ userId: req.user.id, coinId: req.params.id });
  res.json({ message: 'Removed from watchlist' });
});

module.exports = router;
