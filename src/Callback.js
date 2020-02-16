import React, { useEffect, useContext } from 'react';
import AuthContext from './AuthContext';

export default function Callback({ location, hasLoggedIn }) {
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (/accesss_token|id_token|error/i.test(location.hash)) {
      auth.handleAuthentication(hasLoggedIn);
    } else {
      throw new Error('Invalid callback url');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      Loading....
    </div>
  );
};