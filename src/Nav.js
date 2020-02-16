import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import AuthContext from './AuthContext';

export default function Nav() {
  const { login, logout, isAuthenticated, userHasScopes } = useContext(AuthContext);

  return (
    <nav>
      <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/profile'>Profile</Link></li>
        <li><Link to='/public'>Public</Link></li>
        {isAuthenticated && <li><Link to='/private'>Private</Link></li>}
        {isAuthenticated
          && userHasScopes(['read:courses'])
          && <li><Link to='/courses'>Courses</Link></li>}
        <li>
          <button onClick={isAuthenticated ? logout : login}>
            {isAuthenticated ? 'Logout' : 'Login'}
          </button>
        </li>
      </ul>
    </nav>
  );
}
