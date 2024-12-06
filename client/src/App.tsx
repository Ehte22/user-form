import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import UserForm from './pages/UserForm'
import Navbar from './components/Navbar'
import UserList from './pages/UserList'
import Register from './pages/Register'
import Login from './pages/Login'
import Protected from './components/Protected'


const App = () => {
  return <>
    <BrowserRouter>

      <Routes>
        <Route path='/' element={<><Navbar /> <Outlet /></>}>
          <Route index element={<Protected compo={<UserList />} />} />
          <Route path='user-form' element={<Protected compo={<UserForm />} />} />
          <Route path='edit/:id' element={<Protected compo={<UserForm />} />} />
        </Route>

        <Route path='sign-up' element={<Register />} />
        <Route path='sign-in' element={<Login />} />
      </Routes>
    </BrowserRouter >
  </>
}

export default App