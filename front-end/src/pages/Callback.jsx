import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract the access token from the URL fragment
    const hash = window.location.hash;
    const accessToken = new URLSearchParams(hash.substring(1)).get('access_token');
    if (accessToken) {
      // Store the access token in localStorage
      localStorage.setItem('spotify_access_token', accessToken);
      // Redirect to the account page
      navigate('/account');
    } else {
      // Redirect to the login page if no access token is found
      navigate('/login');
    }
  }, [navigate]);

  return <div>Loading...</div>;
}