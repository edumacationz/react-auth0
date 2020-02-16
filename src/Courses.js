import React, { useEffect, useState, useContext } from 'react';
import AuthContext from './AuthContext';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const auth = useContext(AuthContext);

  useEffect(() => {
    fetch('/courses', {
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
      .then(response => setCourses(response.courses))
      .catch(error => setErrorMessage(error.message));

    fetch('/admin', {
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
      .then(response => console.log(response))
      .catch(error => setErrorMessage(error.message))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <p>{errorMessage}</p>

      <ul>
        {courses.map(course => <li key={course.id}>{course.title}</li>)}
      </ul>
    </div>
  );
}
