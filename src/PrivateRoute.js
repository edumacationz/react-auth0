import { Route } from 'react-router-dom';

import AuthContext from './AuthContext';
import PropTypes from 'prop-types';
import React from 'react';

const { useContext } = React;

function PrivateRoute({ component: Component, scopes, ...rest }) {
  const auth = useContext(AuthContext);

  return (
    <Route
      {...rest}

      render={props => {
        if (!auth.isAuthenticated) {
          return auth.login();
        }

        if (scopes.length && !auth.userHasScopes(scopes)) {
          return (
            <h1>
              Unauthorized - You need the following scopes to view this page: {" "}
              {scopes.join(",")}.
            </h1>
          )
        }

        return <Component {...props} />
      }}
    />
  )
}

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  scopes: PropTypes.array
};

PrivateRoute.defaultProps = {
  scopes: []
};

export default PrivateRoute;