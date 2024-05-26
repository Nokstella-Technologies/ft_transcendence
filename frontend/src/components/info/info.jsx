import React from 'react';
import './info.css';

const Info = ({ onClick }) => {
  return (
    <div class="info-icon" onClick={onClick}>
      <img src="https://img.icons8.com/ios-glyphs/30/00ffea/info.png" alt="Info" />
    </div>
  );
};

export default Info;
