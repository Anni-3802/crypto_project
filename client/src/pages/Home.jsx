import { useContext, useEffect, useState } from 'react';
import { api } from '../api/auth';
import { HomepageCard } from '../components/CardsComponents';
import { AuthContext } from '../utils/AuthContext';

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
}

export default Home;
