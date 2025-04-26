import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Table, Button, Spinner, Alert } from 'react-bootstrap';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWatchlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/watchlist', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assume JWT token in localStorage
        },
      });
      // console.log('Watchlist fetched:', response.data);
      setWatchlist(response.data.watchlist || []);
    } catch (error) {
      // console.error('Fetch watchlist error:', error.message, error.response?.data);
      setError(error.response?.data?.msg || 'Failed to fetch watchlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (coinId) => {
    try {
      await axios.delete(`/api/watchlist/remove/${coinId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setWatchlist(watchlist.filter((coin) => coin.id !== coinId));
      // console.log(`Coin ${coinId} removed from watchlist`);
    } catch (error) {
      // console.error('Remove watchlist error:', error.message);
      setError('Failed to remove coin from watchlist');
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

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
        <Link to="/" className="btn btn-primary mb-3">Back to Market</Link>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Link to="/" className="btn btn-primary mb-3">Back to Market</Link>
      <h1 className="mb-4">My Watchlist</h1>
      {watchlist.length === 0 ? (
        <Alert variant="info">Your watchlist is empty. Add some coins from the market!</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Coin</th>
              <th>Symbol</th>
              <th>Current Price (USD)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {watchlist.map((coin) => (
              <tr key={coin.id}>
                <td>
                  <Link to={`/coin-details/${coin.id}`}>{coin.name || 'Unknown'}</Link>
                </td>
                <td>{coin.symbol?.toUpperCase() || 'N/A'}</td>
                <td>${coin.market_data?.current_price?.usd?.toLocaleString() || 'N/A'}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeFromWatchlist(coin.id)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Watchlist;