import { useContext, useEffect, useState } from 'react';
import { api } from '../api/auth';
import { HomepageCard } from '../components/CardsComponents';
import { AuthContext } from '../utils/AuthContext';

const Home = () => {
  const [coins, setCoins] = useState([]);
  const { isLogined } = useContext(AuthContext)

  useEffect(() => {
    api.get("/crypto/top").then((res) => { setCoins(res.data.slice(0, 4)) });
  }, []);

  return (
    <>
      <div className='container-fluid'>
        <section id='banner-section'>
          <div>
            <h2 className='headingText'>Welcome To start A New jounery With WEb3 </h2>
          </div>

        </section>
        <section id="top-coins">
          <h2 className='mb-2 headingText'>Top Coins</h2>
          <div className='row'>
            {coins.length > 0 && coins.map(coin => (
              <div className='col-3 mb-2' key={coin.id} >
                {isLogined ? <HomepageCard cardtitle={coin.name} cardlink={`/coin/${coin.id}`} islogined={true} /> : <HomepageCard cardtitle={coin.name} />}
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  );
};

export default Home;
