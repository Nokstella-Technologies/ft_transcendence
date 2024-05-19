import React from 'react';
import './popup.css';

const Popup = ({ title, content, show, onClose }) => {
  if (!show) return null;

  return (
    <div className="popup">
      <h2>{title}</h2>
      {content}
      <button onClick={onClose}>Cancelar</button>
    </div>
  );
};

export default Popup;
