import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { isLoggedIn } from '../utils/auth';

const Home = () => {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/crypto/top').then(res => setCoins(res.data));
  }, []);

  return (
    <div>
      <h2>Top Coins</h2>
      <ul>
        {coins.map(coin => (
          <li key={coin.id}>
            {isLoggedIn ? <Link to={`/coin/${coin.id}`}>{coin.name}</Link>:
            alert("Please Login !!!") }
            
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
