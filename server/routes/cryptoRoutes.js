const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/top', async (req, res) => {
  try {
    const { data } = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      { params: { vs_currency: 'usd', order: 'market_cap_desc', per_page: 10 } }
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { data } = await axios.get(`https://api.coingecko.com/api/v3/coins/${req.params.id}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Coin not found' });
  }
});

module.exports = router;