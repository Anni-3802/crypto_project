// src/pages/CoinDetails.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const CoinDetails = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);

  const addToWatchlist = () => {
    axios.post(`http://localhost:5000/api/watchlist/${id}`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(() => alert("Added to watchlist"))
      .catch(err => alert(err.response.data.message));
  };

  useEffect(() => {
    axios.get(`http://localhost:5000/api/crypto/${id}`).then(res => setCoin(res.data));
  }, [id]);

  if (!coin) return <div>Loading...</div>;

  return (
    <div>
      <h2>{coin.name}</h2>
      <img src={coin.image.large} alt={coin.name} width={100} />
      <p>{coin.description.en.split('. ')[0]}.</p>
      <p>Market Cap: ${coin.market_data.market_cap.usd}</p>
      <p>Current Price: ${coin.market_data.current_price.usd}</p>
      <button onClick={addToWatchlist}>Add to Watchlist</button>
    </div>
  );
};

export default CoinDetails;
