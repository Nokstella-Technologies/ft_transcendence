import React from 'react';
import './backgroundAnimation.css';

const BackgroundAnimation = () => {
  return (
    <div className="pong-animation">
      <div className="pong-paddle pong-paddle-left"></div>
      <div className="pong-paddle pong-paddle-right"></div>
    </div>
  );
};

export default BackgroundAnimation;
