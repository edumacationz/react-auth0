import React, { useEffect, useState } from 'react';

export default function Public() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/public')
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
