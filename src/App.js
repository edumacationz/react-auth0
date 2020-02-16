import React, { useState, useMemo, useEffect } from 'react';
import { Route } from 'react-router-dom';

import Home from './Home';
import Profile from './Profile';
import Nav from './Nav';
import Auth from './Auth/Auth';
import Callback from './Callback';
import Public from './Public';
import Private from './Private';
import Courses from './Courses';
import PrivateRoute from './PrivateRoute';
import AuthContext from './AuthContext';


function App(props) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [auth] = useState(useMemo(() => new Auth(props.history), []));
  const [tokenRenewal, setTokenRenewal] = useState(false);

  useEffect(() => {
    if (!tokenRenewal) {
      auth.renewToken(() => setTokenRenewal(true));
    }
  });

  return (tokenRenewal ?
    <AuthContext.Provider value={auth}>
      <Nav />
      <div className="body">
        <Route path="/" exact render={props => <Home {...props} />} />
        <Route path="/callback" render={props => <Callback hasLoggedIn={setTokenRenewal} {...props} />} />
        <Route path="/public" component={Public} />
        <PrivateRoute path="/profile" component={Profile} />
        <PrivateRoute path="/private" component={Private} />
        <PrivateRoute path="/courses" scopes={['read:courses']} component={Courses} />
      </div>
    </AuthContext.Provider>
    : <div>Loading...</div>
  );
}

export default App;
