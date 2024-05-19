import React from 'react';
import './Container.css';

const Container = ({ title, children }) => {
  return (
    <div className="container">
      <h1>{title}</h1>
      {children}
    </div>
  );
};

export default Container;
