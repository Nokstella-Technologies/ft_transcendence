import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './input.css';

const Input = ({ type, placeholder }) => {
  const [inputType, setInputType] = useState(type);

  const togglePasswordVisibility = () => {
    setInputType(inputType === 'password' ? 'text' : 'password');
  };

  return (
    <div className="input-field">
      <input type={inputType} placeholder={placeholder} required />
      {type === 'password' && (
        <div className="toggle-visibility" onClick={togglePasswordVisibility}>
          {inputType === 'password' ? <FaEye /> : <FaEyeSlash />}
        </div>
      )}
    </div>
  );
};

export default Input;
