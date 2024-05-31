import React from 'react';
import './link.css';

const Link = ({ href, children }) => {
  return (
    <a href={href} class="custom-link">
      {children}
    </a>
  );
};

export default Link;
