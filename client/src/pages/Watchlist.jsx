import { useEffect, useState } from 'react';
import { api } from '../api/auth';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const WatchData = async () => {
      try {
        let res = await api.get('/watchlist')
        setWatchlist(res.data)

      } catch (error) {
        console.error('Error fetching watchlist:', error);
      }
    }
    WatchData();
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
