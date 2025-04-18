// src/pages/Watchlist.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    axios.get('http://localhost:5000/api/watchlist', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => setWatchlist(res.data));
  }, []);

  return (
    <div>
      <h2>Your Watchlist</h2>
      <ul>
        {watchlist.map(item => (
          <li key={item.coinId}>{item.coinId}</li>
        ))}
      </ul>
    </div>
  );
};

export default Watchlist;
