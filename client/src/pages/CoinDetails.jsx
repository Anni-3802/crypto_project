import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Container, Spinner, Alert, Button } from "react-bootstrap";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CoinDetails = () => {
  const { id } = useParams();
  const [coinData, setCoinData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const fetchCoinDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching coin details for ID: ${id}`);
      const response = await axios.get(`/api/crypto/coin-details/${id}`, {
        headers: {
          "Cache-Control": "no-cache",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Assume JWT token is in localStorage
        },
      });
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
      console.log("Received coinData:", response.data);
      setCoinData(response.data);
    } catch (error) {
      console.error("Fetch error:", error.message, error.response?.data);
      setError(error.response?.data?.msg || "Failed to fetch coin details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const checkWatchlistStatus = useCallback(async () => {
    try {
      const response = await axios.get(`/api/watchlist/check/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setIsInWatchlist(response.data.isInWatchlist);
    } catch (error) {
      console.error("Check watchlist error:", error.message);
    }
  }, [id]);

  const toggleWatchlist = async () => {
    try {
      if (isInWatchlist) {
        await axios.delete(`/api/watchlist/remove/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setIsInWatchlist(false);
      } else {
        await axios.post(
          `/api/watchlist/add`,
          { coinId: id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIsInWatchlist(true);
      }
      console.log(
        `Coin ${id} ${isInWatchlist ? "removed from" : "added to"} watchlist`
      );
    } catch (error) {
      console.error("Toggle watchlist error:", error.message);
      setError("Failed to update watchlist");
    }
  };

  useEffect(() => {
    fetchCoinDetails();
    checkWatchlistStatus();
  }, [fetchCoinDetails, checkWatchlistStatus]);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Link to="/" className="btn btn-primary mb-3">
          Back to Market
        </Link>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!coinData) {
    return (
      <Container className="my-5">
        <Link to="/" className="btn btn-primary mb-3">
          Back to Market
        </Link>
        <Alert variant="warning">No data available for this coin.</Alert>
      </Container>
    );
  }

  // Defensive check for market_chart.prices
  const chartData = {
    labels:
      coinData.market_chart?.prices?.map((item) =>
        new Date(item[0]).toLocaleDateString()
      ) || [],
    datasets: [
      {
        label: "Price (USD)",
        data: coinData.market_chart?.prices?.map((item) => item[1]) || [],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `${coinData.name || "Unknown"} Price Chart (Last 30 Days)`,
      },
    },
  };

  return (
    <Container className="my-5 text-center">
      <Link to="/" className="btn btn-primary mb-3">
        Back to Market
      </Link>
      <Button
        variant={isInWatchlist ? "warning" : "outline-warning"}
        className="mb-3 ms-2"
        onClick={toggleWatchlist}
      >
        {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
      </Button>
      <h1 className="mb-4">{coinData.name || "Unknown"} Details</h1>
      <p className="lead">Symbol: {coinData.symbol?.toUpperCase() || "N/A"}</p>
      <p>
        Current Price:{" "}
        <strong>
          ${coinData.market_data?.current_price?.usd?.toLocaleString() || "N/A"}
        </strong>
      </p>
      <p>
        Market Cap:{" "}
        <strong>
          ${coinData.market_data?.market_cap?.usd?.toLocaleString() || "N/A"}
        </strong>
      </p>
      <p>
        24h High:{" "}
        <strong>
          ${coinData.market_data?.high_24h?.usd?.toLocaleString() || "N/A"}
        </strong>
      </p>
      <p>
        24h Low:{" "}
        <strong>
          ${coinData.market_data?.low_24h?.usd?.toLocaleString() || "N/A"}
        </strong>
      </p>
      {coinData.market_chart?.prices?.length > 0 ? (
        <div style={{ width: "80%", margin: "20px auto" }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : (
        <Alert variant="warning" className="mt-3">
          Price chart data is not available for this coin.
        </Alert>
      )}
    </Container>
  );
};

export default CoinDetails;
