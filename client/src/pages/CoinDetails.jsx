import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/auth';

const CoinDetails = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);

  const addToWatchlist = () => {
    api.post(`/watchlist/${id}`, {}).then(() => alert("Added to watchlist")).catch(err => alert(err.response.data.message));
  };

  useEffect(() => {
    api.get(`/crypto/${id}`).then(res => setCoin(res.data));
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
