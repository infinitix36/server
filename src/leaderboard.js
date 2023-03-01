import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await axios.get('/api/leaderboard');
        setContributors(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchContributors();
  }, []);

  return (
    <div>
      <h1>Leaderboard</h1>
      <ol>
        {contributors.map((contributor, index) => (
          <li key={index}>
            {contributor.login} - {contributor.commits} commits
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Leaderboard;
