const express = require("express");
const axios = require("axios");
const axiosRetry = require("axios-retry").default;
const redis = require("redis");
const router = express.Router();

// Initialize Redis client
let redisClient;
let useRedis = false;

// console.log("Initializing cryptoRoutes.js...");
// console.log("REDIS_URL at module load:", process.env.REDIS_URL);

// Connect to Redis at startup
if (process.env.REDIS_URL) {
  // console.log("Redis URL being used:", process.env.REDIS_URL);
  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            // console.error("Max Redis reconnection attempts reached");
            return new Error("Redis reconnection failed");
          }
          return Math.min(retries * 1000, 5000); // Exponential backoff, max 5s
        },
      },
    });

    redisClient.on("error", (err) => {
      // console.error("Redis error:", err);
      useRedis = false;
    });
    redisClient.on("connect", () => console.log("Redis client connected"));
    redisClient.on("reconnecting", () =>
      console.log("Redis client reconnecting")
    );
    redisClient.on("ready", () => {
      console.log("Redis client ready");
      useRedis = true;
    });

    redisClient.connect().catch((err) => {
      // console.error("Initial Redis connection failed:", err.message);
      useRedis = false;
    });
  } catch (err) {
    // console.error("Failed to initialize Redis client:", err.message);
    useRedis = false;
  }
} else {
  console.warn("REDIS_URL is not defined. Caching will be disabled.");
}

// Configure axios-retry
try {
  axiosRetry(axios, {
    retries: 3,
    retryDelay: (retryCount) => axiosRetry.exponentialDelay(retryCount, 1000),
    retryCondition: (error) =>
      error.response?.status === 429 || error.response?.status === 500,
  });
} catch (err) {
  console.error("Failed to configure axios-retry:", err.message);
}

// Fetch market data
router.get("/prices", async (req, res) => {
  const { page = 1, per_page = 20 } = req.query;
  const cacheKey = `market_prices_${page}_${per_page}`;

  try {
    if (useRedis && redisClient && redisClient.isOpen) {
      try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          console.log("Serving from cache:", cacheKey);
          return res.json(JSON.parse(cached));
        }
        console.log("Cache miss for:", cacheKey);
      } catch (err) {
        console.error("Redis get failed:", err.message);
        useRedis = false;
      }
    } else {
      console.log(
        "Redis not available (disconnected or not initialized), fetching directly:",
        cacheKey
      );
    }

    console.log("Fetching from CoinGecko:", cacheKey);
    const response = await axios.get(
      `${process.env.COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${per_page}&page=${page}&sparkline=false`
    );

    if (useRedis && redisClient && redisClient.isOpen) {
      try {
        await redisClient.setEx(cacheKey, 60, JSON.stringify(response.data));
        console.log("Cached response in Redis:", cacheKey);
      } catch (err) {
        console.error("Redis setEx failed:", err.message);
        useRedis = false;
      }
    } else {
      console.log("Redis not available for caching:", cacheKey);
    }

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching market data:",
      error.message,
      error.response?.status
    );
    res.status(error.response?.status || 500).json({
      msg: "Error fetching market data",
      error: error.message,
      status: error.response?.status,
    });
  }
});

// Fetch global market stats
router.get("/global", async (req, res) => {
  const cacheKey = "global_stats";

  try {
    if (useRedis && redisClient && redisClient.isOpen) {
      try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          console.log("Serving from cache:", cacheKey);
          return res.json(JSON.parse(cached));
        }
        console.log("Cache miss for:", cacheKey);
      } catch (err) {
        console.error("Redis get failed:", err.message);
        useRedis = false;
      }
    } else {
      console.log(
        "Redis not available (disconnected or not initialized), fetching directly:",
        cacheKey
      );
    }

    console.log("Fetching from CoinGecko:", cacheKey);
    const response = await axios.get(`${process.env.COINGECKO_API}/global`);

    if (useRedis && redisClient && redisClient.isOpen) {
      try {
        await redisClient.setEx(
          cacheKey,
          60,
          JSON.stringify(response.data.data)
        );
        console.log("Cached response in Redis:", cacheKey);
      } catch (err) {
        console.error("Redis setEx failed:", err.message);
        useRedis = false;
      }
    } else {
      console.log("Redis not available for caching:", cacheKey);
    }

    res.json(response.data.data);
  } catch (error) {
    console.error(
      "Error fetching global stats:",
      error.message,
      error.response?.status
    );
    res.status(error.response?.status || 500).json({
      msg: "Error fetching global stats",
      error: error.message,
      status: error.response?.status,
    });
  }
});

// Fetch coin details
router.get("/coin-details/:id", async (req, res) => {
  const { id } = req.params;
  const cacheKey = `coin_details_${id}`;

  // Ensure JSON response
  res.setHeader("Content-Type", "application/json");

  try {
    if (useRedis && redisClient && redisClient.isOpen) {
      try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          console.log("Serving from cache:", cacheKey);
          return res.json(JSON.parse(cached));
        }
        console.log("Cache miss for:", cacheKey);
      } catch (err) {
        console.error("Redis get failed:", err.message);
        useRedis = false;
      }
    } else {
      console.log(
        "Redis not available (disconnected or not initialized), fetching directly:",
        cacheKey
      );
    }

    console.log("Fetching coin details from CoinGecko for ID:", id);
    console.log("CoinGecko API base URL:", process.env.COINGECKO_API);

    // Validate COINGECKO_API environment variable
    if (!process.env.COINGECKO_API) {
      console.error("COINGECKO_API environment variable is not set");
      return res.status(500).json({
        msg: "Server configuration error",
        error: "COINGECKO_API environment variable is not set",
      });
    }

    const [coinResponse, historyResponse] = await Promise.all([
      axios
        .get(
          `${process.env.COINGECKO_API}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
        )
        .catch((err) => {
          console.error(
            `Failed to fetch coin data for ${id}:`,
            err.message,
            err.response?.status
          );
          throw err;
        }),
      axios
        .get(
          `${process.env.COINGECKO_API}/coins/${id}/market_chart?vs_currency=usd&days=30`
        )
        .catch((err) => {
          console.error(
            `Failed to fetch market chart for ${id}:`,
            err.message,
            err.response?.status
          );
          return { data: { prices: [] } };
        }),
    ]);

    console.log("CoinResponse data:", coinResponse.data);
    console.log("HistoryResponse data:", historyResponse.data);

    // Validate coinResponse data
    if (!coinResponse.data || !coinResponse.data.name) {
      console.error("Invalid coin data received from CoinGecko");
      return res.status(500).json({
        msg: "Invalid coin data received from CoinGecko",
        error: "No valid data returned",
      });
    }

    const coinData = {
      ...coinResponse.data,
      market_chart: {
        prices: historyResponse.data?.prices || [],
      },
    };

    if (useRedis && redisClient && redisClient.isOpen) {
      try {
        await redisClient.setEx(cacheKey, 600, JSON.stringify(coinData));
        console.log("Cached response in Redis:", cacheKey);
      } catch (err) {
        console.error("Redis setEx failed:", err.message);
        useRedis = false;
      }
    } else {
      console.log("Redis not available for caching:", cacheKey);
    }

    res.json(coinData);
  } catch (error) {
    console.error(
      "Error fetching coin details:",
      error.message,
      error.response?.status
    );
    res.status(error.response?.status || 500).json({
      msg: "Error fetching coin details",
      error: error.message,
      status: error.response?.status,
    });
  }
});


module.exports = router;
