import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/UserAuth';
import { login, news, signup, watchlist } from '../routes/Routelink';

const Navbar = () => {
  const { isUserLoggedIn, logout } = useContext(UserAuth);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    alert("logged out successfully");
    navigate('/');
  };

  return (
    <nav className="navbar navbar-dark bg-dark position-fixed top-0 start-0 w-100 px-4" style={{ zIndex: 1030 }}>
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link className="navbar-brand" to="/">CryptoApp</Link>
        <div className="d-flex align-items-center">
          {isUserLoggedIn ? (
            <>
              <Link className="nav-link text-white me-2" to={watchlist}>Watchlist</Link>
              <Link className="nav-link text-white me-2" to={news}>News</Link>
              <button className="btn btn-danger ms-2" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="btn btn-primary text-white me-2" to={login}>Login</Link>
              <Link className="btn btn-primary text-white me-2" to={signup}>Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
