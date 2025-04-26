import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Add Link from react-router-dom
import axios from "axios";
import {
  Container,
  Table,
  Form,
  Button,
  Card,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";

function Home() {
  const [coins, setCoins] = useState([]);
  const [globalStats, setGlobalStats] = useState({});
  const [portfolio, setPortfolio] = useState([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("market_cap_rank");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState({
    market: false,
    global: false,
    portfolio: false,
  });
  const [error, setError] = useState({
    market: null,
    global: null,
    portfolio: null,
  });

  const fetchWithRetry = async (
    url,
    setData,
    setLoadingKey,
    setErrorKey,
    maxRetries = 3
  ) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      setLoadingKey(true);
      setErrorKey(null);
      try {
        const response = await axios.get(url);
        setData(response.data);
        return;
      } catch (err) {
        if (err.response?.status === 429 && attempt < maxRetries) {
          console.log(`Rate limit hit, retrying (${attempt}/${maxRetries})...`);
          await new Promise((resolve) => setTimeout(resolve, 2000 * attempt)); // Exponential backoff
        } else {
          setErrorKey(
            err.response?.data?.msg ||
              `Failed after ${attempt} attempts: ${err.message}`
          );
          return;
        }
      } finally {
        setLoadingKey(false);
      }
    }
  };

  // Fetch data with retry
  useEffect(() => {
    fetchWithRetry(
      `http://localhost:5000/api/crypto/prices?page=${page}&per_page=20`,
      setCoins,
      (v) => setLoading({ ...loading, market: v }),
      (v) => setError({ ...error, market: v })
    );
    fetchWithRetry(
      "http://localhost:5000/api/crypto/global",
      setGlobalStats,
      (v) => setLoading({ ...loading, global: v }),
      (v) => setError({ ...error, global: v })
    );
    // const token = localStorage.getItem('token');
    // if (token) {
    //   fetchWithRetry(
    //     'http://localhost:5000/api/portfolio',
    //     setPortfolio,
    //     (v) => setLoading({ ...loading, portfolio: v }),
    //     (v) => setError({ ...error, portfolio: v }),
    //     2 // Fewer retries for portfolio
    //   );
    // }
  }, [page]);

  // Filter and sort coins
  const filteredCoins = coins
    .filter(
      (coin) =>
        coin.name?.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const fieldA = a[sortField] || 0;
      const fieldB = b[sortField] || 0;
      return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
    });

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <Container className="my-5">
      {/* Market Overview */}
      <h2 className="text-center mb-4">Market Overview</h2>
      {loading.global ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : error.global ? (
        <Alert variant="danger">{error.global}</Alert>
      ) : (
        <Row className="mb-5">
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Total Market Cap</Card.Title>
                <Card.Text>
                  $
                  {globalStats.total_market_cap?.usd?.toLocaleString() || "N/A"}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>24h Volume</Card.Title>
                <Card.Text>
                  ${globalStats.total_volume?.usd?.toLocaleString() || "N/A"}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Active Cryptos</Card.Title>
                <Card.Text>
                  {globalStats.active_cryptocurrencies?.toLocaleString() ||
                    "N/A"}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Portfolio Snapshot */}
      {/* <h2 className="text-center mb-4">Your Portfolio</h2>
      <Card className="mb-5">
        <Card.Body>
          {loading.portfolio ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : error.portfolio ? (
            <Alert variant="danger">{error.portfolio}</Alert>
          ) : portfolio.length > 0 ? (
            <div>
              <p>Total Value: (Calculate based on coin prices)</p>
              <ul>
                {portfolio.map((item, index) => (
                  <li key={index}>
                    {item.coinId}: {item.amount} units
                  </li>
                ))}
              </ul>
              <Button variant="primary" href="/portfolio">
                View Full Portfolio
              </Button>
            </div>
          ) : (
            <p>No portfolio data. Add coins to start tracking!</p>
          )}
        </Card.Body>
      </Card> */}

      {/* Marketplace */}
      <h2 className="text-center mb-4">Cryptocurrency Marketplace</h2>
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search coins (e.g., Bitcoin, BTC)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Form.Group>
      {loading.market ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : error.market ? (
        <Alert variant="danger">{error.market}</Alert>
      ) : (
        <>
          <Table responsive striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th
                  onClick={() => handleSort("market_cap_rank")}
                  style={{ cursor: "pointer" }}
                >
                  Rank{" "}
                  {sortField === "market_cap_rank" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th>Coin</th>
                <th
                  onClick={() => handleSort("current_price")}
                  style={{ cursor: "pointer" }}
                >
                  Price (USD){" "}
                  {sortField === "current_price" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("price_change_percentage_24h")}
                  style={{ cursor: "pointer" }}
                >
                  24h Change{" "}
                  {sortField === "price_change_percentage_24h" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("market_cap")}
                  style={{ cursor: "pointer" }}
                >
                  Market Cap{" "}
                  {sortField === "market_cap" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("total_volume")}
                  style={{ cursor: "pointer" }}
                >
                  Volume (24h){" "}
                  {sortField === "total_volume" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCoins.map((coin) => (
                <tr key={coin.id}>
                  <td>{coin.market_cap_rank || "N/A"}</td>
                  <td>
                    <Link
                      to={`/coin-details/${coin.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <img
                        src={coin.image}
                        alt={coin.name}
                        width="24"
                        className="me-2"
                      />
                      {coin.name} ({coin.symbol?.toUpperCase() || "N/A"})
                    </Link>
                  </td>
                  <td>${coin.current_price?.toLocaleString() || "N/A"}</td>
                  <td
                    className={
                      coin.price_change_percentage_24h >= 0
                        ? "text-success"
                        : "text-danger"
                    }
                  >
                    {coin.price_change_percentage_24h?.toFixed(2) || "N/A"}%
                  </td>
                  <td>${coin.market_cap?.toLocaleString() || "N/A"}</td>
                  <td>${coin.total_volume?.toLocaleString() || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-between mt-3">
            <Button
              variant="outline-primary"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Button variant="outline-primary" onClick={() => setPage(page + 1)}>
              Next
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}

export default Home;
