import React, { useState } from 'react';
import Popup from '../popup/popup';
import './TwoFactorAuth.css';

const TwoFactorAuth = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleToggle = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div class="a2fa-container-login">
      <label class="switch">
        <input type="checkbox" onChange={handleToggle} />
        <span class="slider"></span>
      </label>
      <label>Autenticação de 2 Fatores</label>
      <Popup
        title="Autenticação de 2 Fatores"
        content={<p>Insira o código enviado para seu e-mail ou celular.</p>}
        show={showPopup}
        onClose={handleToggle}
      />
    </div>
  );
};

export default TwoFactorAuth;
