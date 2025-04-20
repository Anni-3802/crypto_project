import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { dashboard, login, signup, watchlist } from '../routes/RoutesLink';
import { AuthContext } from '../utils/AuthContext';

const Navbar = () => {
  const { isLogined, logout } = useContext(AuthContext)
  
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">CRYPTOMART</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link active" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#">Learning</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={dashboard}>Dashboard</Link>
            </li>
          </ul>

          <div className="ms-auto d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-2">
            {!isLogined ?
              <>
                <Link to={login} className="btn btn-outline-primary w-auto">Login</Link>
                <Link to={signup} className="btn btn-outline-secondary w-auto">Sign Up</Link>
              </>
              :
              <>
                <Link to={watchlist} className="btn btn-outline-primary w-auto">WatchList</Link>
                <button onClick={logout} className="btn btn-outline-secondary w-auto">Log Out</button>
              </>
            }
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
