import React from 'react';
import './homeButton.css';

const HomeButton = ({ onClick }) => {
  return (
    <div class="home-button" onClick={onClick}>
      ← Home
    </div>
  );
};

export default HomeButton;
