const express = require("express");
const axios = require("axios");
const router = express.Router();

// Import the protect middleware function from the exported object
const { protect } = require("../middleware/authmiddleware");
// console.log('protect middleware loaded:', typeof protect);

// Mock in-memory store (replace with MongoDB or Redis in production)
let watchlists = {};

router.get("/", protect, async (req, res) => {
  const userId = req.user?.id || "default-user"; // Fallback if auth fails
  watchlists[userId] = watchlists[userId] || [];

  try {
    const coinIds = watchlists[userId];
    if (coinIds.length === 0) {
      return res.json({ watchlist: [] });
    }

    // Fetch current data for each coin in the watchlist from CoinGecko
    const coinDataPromises = coinIds.map((id) =>
      axios
        .get(
          `${process.env.COINGECKO_API}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
        )
        .then((response) => response.data)
        .catch((err) => {
          console.error(`Failed to fetch data for coin ${id}:`, err.message);
          return null;
        })
    );

    const coinData = (await Promise.all(coinDataPromises)).filter(
      (data) => data !== null
    );
    res.json({ watchlist: coinData });
  } catch (error) {
    console.error("Error fetching watchlist:", error.message);
    res
      .status(500)
      .json({ msg: "Failed to fetch watchlist", error: error.message });
  }
});

router.get("/check/:id", protect, (req, res) => {
  const userId = req.user?.id || "default-user";
  watchlists[userId] = watchlists[userId] || [];
  const isInWatchlist = watchlists[userId].includes(req.params.id);
  res.json({ isInWatchlist });
});

router.post("/add", protect, (req, res) => {
  const userId = req.user?.id || "default-user";
  const { coinId } = req.body;
  watchlists[userId] = watchlists[userId] || [];
  if (!watchlists[userId].includes(coinId)) {
    watchlists[userId].push(coinId);
    res.json({ msg: "Added to watchlist" });
  } else {
    res.status(400).json({ msg: "Already in watchlist" });
  }
});

router.delete("/remove/:id", protect, (req, res) => {
  const userId = req.user?.id || "default-user";
  watchlists[userId] = watchlists[userId] || [];
  const index = watchlists[userId].indexOf(req.params.id);
  if (index !== -1) {
    watchlists[userId].splice(index, 1);
    res.json({ msg: "Removed from watchlist" });
  } else {
    res.status(400).json({ msg: "Not in watchlist" });
  }
});

module.exports = router;
