import React, { useEffect, useState, useContext } from 'react';
import AuthContext from './AuthContext';

export default function Profile() {
  const [profile, setProfile] = useState({});
  const [error, setError] = useState();
  const auth = useContext(AuthContext);

  useEffect(() => {
    auth.getProfile((profile, error) => {
      setProfile(profile);
      setError(error);
    });
  });

  return (
    <>
      <small>{error}</small>
      <h1>
        Profile
      </h1>
      <p>{profile.nickname}</p>
      <img src={profile.picture} alt="profile" style={{ maxWidth: 50, maxHeight: 50 }} />
      <pre>
        {JSON.stringify(profile)}
      </pre>
    </>
  );

}