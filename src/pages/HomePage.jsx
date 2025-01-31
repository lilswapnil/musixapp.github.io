import React, { useState } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  const handleSearch = async () => {
    try {
      // Track the search term
      await axios.post('http://localhost:5000/track_search', { search_term: searchTerm });

      // Fetch recommendations (assuming you have an endpoint for this)
      const response = await axios.post('http://localhost:5000/recommend', {
        preferences: [1, 0, 0, 1, 0]  // Example user preferences
      });
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Music Recommendations</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for music..."
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {recommendations.map((rec, index) => (
          <li key={index}>{rec}</li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;