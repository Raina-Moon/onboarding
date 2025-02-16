
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
import ProfileEdit from './pages/ProfileEdit';

const App = () => {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<><Header /><Home /></>}></Route>
        <Route path='login' element={<Login/>}></Route>
        <Route path='signup' element={<Signup/>}></Route>
        <Route path="profile" element={<><Header /><Profile /></>} />
        <Route path="profile-edit" element={<><Header /><ProfileEdit /></>} />
      </Routes>
    </Router>
  )
}

export default App