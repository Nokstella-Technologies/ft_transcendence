import React from 'react';
import './index.css';

const Container = ({ title, className, children }) => {
  return (
    <div className={"container " + className}>
      <h1>{title}</h1>
      {children}
    </div>
  );
};

export default Container;
