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
          {inputType === 'password' ? <FaEye size={25} color='rgba(0,255,234, 0.8)' /> : <FaEyeSlash size={25}  color='rgba(0,255,234, 0.8)'/>}
        </div>
      )}
    </div>
  );
};

export default Input;
