import React from 'react'
import { Link } from 'react-router-dom'
import {AuthContext} from '../context/AuthContext';


const AuthNavbar = () => {
  
  return (
    <div className='navbar'>
        <div className='Logo'>
            <h3>GreenStride</h3>
        </div>

        <div className='NavItems'>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
        </div>
    </div>
  )
}

export default AuthNavbar