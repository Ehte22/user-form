import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import UserForm from './pages/UserForm'
import Navbar from './components/Navbar'
import UserList from './pages/UserList'


const App = () => {
  return <>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<> <Outlet /></>} />
        <Route index element={<UserList />} />
        <Route path='user-form' element={<UserForm />} />
      </Routes>
    </BrowserRouter >
  </>
}

export default App