import { Link } from "react-router-dom"
import { login } from "../routes/RoutesLink";

export const HomepageCard = ({ cardtitle = null, cardlink = null, islogined = false }) => {
  let img = '/img/demoimage/shivimg.webp';

  return (
    <div className="card">
      <img src={img} className="card-img" alt="card-img" />
      <div className="card-body">
        <h5 className="card-title text-center">{cardtitle}</h5>
        <div className="d-flex justify-content-center">
          {islogined ? (
            <Link to={cardlink} className="btn btn-primary">{cardtitle}</Link>
          ) : (
            <Link to={login} className="btn btn-primary">Login to view details</Link>
          )}
        </div>
      </div>
    </div>
  )
}