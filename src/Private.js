import React, { useEffect, useState, useContext } from 'react';
import AuthContext from './AuthContext';

export default function Private() {
  const [message, setMessage] = useState('');
  const auth = useContext(AuthContext);

  useEffect(() => {
    fetch('/private', {
      headers: {
        Authorization: `Bearer ${auth.getAccessToken()}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(response => setMessage(response.message))
      .catch(error => setMessage(error.message))
  });

  return (
    <div>
      {message}
    </div>
  );
}
