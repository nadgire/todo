import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import ResetPassword from './components/ResetPassword'
import Footer from './components/Footer'
import Dashboard from './components/Dashboard'

function isTokenExpired(token) {
  if (!token) return true;

  const payload = JSON.parse(atob(token.split('.')[1]));
  const expirationTime = payload.exp * 1000;
  return expirationTime < Date.now();
}

function App() {

  const token = localStorage.getItem('token')

  if (token && isTokenExpired(token)) {
    localStorage.removeItem('token');
    window.location.reload();
    const navigate = useNavigate();

    navigate('/')

  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={token && !isTokenExpired(token) ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={token && !isTokenExpired(token) ? <Dashboard /> : <Navigate to="/" />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
