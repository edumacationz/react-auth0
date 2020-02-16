import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from './AuthContext';

export default function Home() {
  const auth = useContext(AuthContext);

  return (
    <div>
      <h1>Home</h1>
      {auth.isAuthenticated ?
        <Link to='/profile'>View Profile</Link>
        : <button onClick={auth.login}>Log In</button>}
    </div>
  );
}