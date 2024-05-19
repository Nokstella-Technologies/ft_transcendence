import React from 'react';
import './link.css';

const Link = ({ href, children }) => {
  return (
    <a href={href} className="custom-link">
      {children}
    </a>
  );
};

export default Link;
