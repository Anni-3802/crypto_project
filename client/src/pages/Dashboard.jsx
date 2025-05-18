import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboard } from '../api/auth';
import { UserAuth } from '../context/UserAuth';

const Dashboard = () => {
  const {isUserLoggedIn} = useContext(UserAuth);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUserLoggedIn()) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const res = await getDashboard();
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
        navigate('/');
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {user ? (
        <p>Welcome, {user.name} ({user.email})</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
