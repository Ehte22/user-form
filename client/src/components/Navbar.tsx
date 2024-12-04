import { Link } from "react-router-dom"

const Navbar = () => {
  return <>
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
      <div className="container">
        <a className="navbar-brand" href="#">Navbar</a>
        <button className="navbar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="#collapsibleNavId" aria-controls="collapsibleNavId"
          aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="collapsibleNavId">
          <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
            <li className="nav-item active">
              <Link to="/" className="text-decoration-none ms-2 text-light">Home</Link>
              <Link to="/user-form" className="text-decoration-none ms-2 text-light">Form</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </>
}

export default Navbar