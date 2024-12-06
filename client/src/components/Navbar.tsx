import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { RootState } from "../redux/store"
import { useSignOutMutation } from "../redux/apis/auth.api"
import { useEffect } from "react"
import { toast } from "../services/toast"

const Navbar = () => {
  const { auth } = useSelector((state: RootState) => state.auth)
  const [signOut, { data, isSuccess }] = useSignOutMutation()

  useEffect(() => {
    if (isSuccess) {
      toast.showSuccess(data.message)
    }
  }, [isSuccess, data])
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
            </li>
            <li>
              <Link to="/user-form" className="text-decoration-none ms-2 text-light">Form</Link>
            </li>
          </ul>
          {
            auth
              ? <button onClick={() => signOut()} className="btn btn-danger btn-sm ms-2">Logout</button>
              : <button className="btn btn-success btn-sm ms-2">
                <Link to="/sign-in" className="text-decoration-none text-light">Sign in</Link>
              </button>
          }
        </div>
      </div>
    </nav>
  </>
}

export default Navbar