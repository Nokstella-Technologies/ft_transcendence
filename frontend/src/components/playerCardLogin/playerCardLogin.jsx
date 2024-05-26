import React, { useState } from 'react';
import Popup from '../popup/popup';
import './playerCardLogin.css';

const PlayerCardLogin = ({ id, player, isCurrentUser, onLogin }) => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();
    // Lógica de login aqui
    onLogin(id);
    setShowLoginPopup(false);
  };

  return (
    <div class="player-card">
      {player ? (
        <>
          <img src={player.avatar} alt={`Player ${id}`} />
          <p>{player.name} {isCurrentUser && '(Você)'}</p>
        </>
      ) : (
        <div class="add-player" onClick={() => setShowLoginPopup(true)}>
          <img src="https://img.icons8.com/ios-filled/40/00ffea/plus-math.png" alt={`Logar Player ${id}`} />
          <p>Logar Player {id}</p>
        </div>
      )}
      <Popup
        title={`Logar Player ${id}`}
        show={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        content={
          <form class="login-form" onSubmit={handleLogin}>
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Senha" required />
            <button type="submit">Login</button>
            <button type="button" class="google-login">Login com Google</button>
            <button type="button" class="a42-login">Login com 42</button>
            <button type="button" class="close-button" onClick={() => setShowLoginPopup(false)}>Cancelar</button>
          </form>
        }
      />
    </div>
  );
};

export default PlayerCardLogin;
