const express = require('express');
const axios = require('axios');
const router = express.Router();
const redis = require('redis');

let redisClient;
try {
  redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  });
  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  redisClient.connect();
} catch (error) {
  console.log('Failed to initialize Redis client:', error.message);
  redisClient = null;
}
//cryptopanic api
router.get('/news', async (req, res) => {
  const cacheKey = 'news_cache';
  try {
    let cached;
    if (redisClient) {
      cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log('Serving news from cache');
        return res.json({ news: JSON.parse(cached) });
      }
    }

    const apiKey = process.env.CRYPTOPANIC_API_KEY;
    if (!apiKey) {
      throw new Error('CryptoPanic API key not set');
    }

    const response = await axios.get('https://cryptopanic.com/api/v1/posts/', {
      params: {
        auth_token: apiKey,
        public: true,
      },
    });

    const newsData = response.data.results.slice(0, 10).map(article => ({
      title: article.title,
      description: article.metadata?.description || '',
      url: article.url,
      published_on: article.published_at,
      source: article.source?.title || 'CryptoPanic',
    }));

    if (redisClient) {
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(newsData));
    }
    res.json({ news: newsData });
  } catch (error) {
    console.error('Error fetching news:', error.message);
    if (error.response?.status === 429) {
      return res.status(429).json({ msg: 'Too many requests. Please try again later.' });
    }
    res.status(500).json({ msg: 'Failed to fetch news', error: error.message });
  }
});

module.exports = router;