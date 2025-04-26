import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/auth';
import { AuthContext } from '../utils/AuthContext';

const Home = () => {
  const [coins, setCoins] = useState([]);
  const { isLogined } = useContext(AuthContext)

  useEffect(() => {
    api.get("/crypto/top").then((res) => { setCoins(res.data) });
  }, []);


  return (
    <div>
      <h2>Top Coins</h2>
      <ul>
        {coins.map(coin => (
          <li key={coin.id}>
            {isLogined ? <Link to={`/coin/${coin.id}`}>{coin.name}</Link> :
              <span>{coin.name} (Login to view details)</span>}
          </li>
         
        ))}
      </ul>
    </div>
  );
};

export default Home;
