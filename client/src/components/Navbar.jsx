import { Link } from 'react-router-dom';
import { isLoggedIn, removeToken } from '../utils/auth';

const Navbar = () => {
  const handleLogout = () => {
    removeToken();
    window.location.href = '/';
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-4">
   <h4><Link className="navbar-brand" to="/">CryptoMart</Link></h4>
      <ul className="navbar-nav flex-row">
        {!isLoggedIn() ? (
          <>
            
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/signup">Signup</Link>
            </li>
          </>
        ) : (
         
          <li className="nav-item mx-2">
            <Link to="/watchlist" className='me-2'>Watchlist</Link>
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
