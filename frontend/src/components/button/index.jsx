import React from 'react';
import './index.css';

const Button = ({ onClick, children, className, type = "button" }) => {
  
  return (
    <button type={type} className={`custom-button ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
