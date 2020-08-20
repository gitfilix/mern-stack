import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../context/auth-context'

import './NavLinks.css'


const NavLinks = props => {
  const auth = useContext(AuthContext)

  return <ul className='nav-links'>
    <li>
      <NavLink to='/' exact>All users</NavLink>
    </li>
    {auth.isLoggedIn && (
    <li>
      <NavLink to='/u1/places'>my Places</NavLink>
    </li>
    )}
    {auth.isLoggedIn && (
    <li>
      <NavLink to='/places/new'>Add a Place</NavLink>
    </li>
    )}
    {!auth.isLoggedIn && (
    <li>
      <NavLink to='/auth'>Authenticate</NavLink>
    </li>
    )}
    {auth.isLoggedIn && (
      <li>
        <button onClick={auth.logout}>Logout</button>
      </li>
    )}
  </ul>
}

export default NavLinks