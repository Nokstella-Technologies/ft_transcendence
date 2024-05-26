import React, { useState } from 'react';
import ProfileLink from '../ProfileLink/profileLink';
import HomeButton from '../homeButton/homeButton';
import Info from '../info/info';
import DropdownMenu from '../dropdownMenu/dropdownMenu';
import Popup from '../popup/popup';
import BackgroundAnimation from '../backgroundAnimation/backgroundAnimation';
import './test.css';

const Test = () => {
  const [showPlayerPopup, setShowPlayerPopup] = useState(false);
  const [showIAPopup, setShowIAPopup] = useState(false);

  const difficultyOptions = [
    { value: 'easy', label: 'Fácil' },
    { value: 'medium', label: 'Médio' },
    { value: 'hard', label: 'Difícil' }
  ];

  const handleDifficultyChange = (event) => {
    console.log(`Selected difficulty: ${event.target.value}`);
  };

  return (
    <div class="test-container">
      <BackgroundAnimation />
      <div class="top-bar">
        <HomeButton onClick={() => window.location.href = 'home.html'} />
        <ProfileLink username="Usuário" profilePicture="https://via.placeholder.com/40" />
      </div>
      <div class="container">
        <div class="player" id="player1">
          <img src="https://via.placeholder.com/80" alt="Player 1" />
          <p>Player 01 (Você)</p>
          <button class="toggle-button" onClick={() => console.log('Trocar Lado')}>Trocar Lado</button>
          <Info onClick={() => setShowPlayerPopup(true)} />
        </div>
        <div class="ia">
          <img src="https://img.icons8.com/ios-glyphs/80/00ffea/artificial-intelligence.png" alt="IA" />
          <p>IA</p>
          <DropdownMenu label="Dificuldade:" options={difficultyOptions} onChange={handleDifficultyChange} />
          <Info onClick={() => setShowIAPopup(true)} />
        </div>
      </div>
      <div class="buttons">
        <button onClick={() => console.log('Start Game')}>Start Game</button>
      </div>
      <Popup
        title="Instruções"
        content={
          <div>
            <p>Para jogar, use as teclas:</p>
            <img src="https://img.icons8.com/ios-filled/50/00ffea/w-key.png" alt="Tecla W" />
            <img src="https://img.icons8.com/ios-filled/50/00ffea/s-key.png" alt="Tecla S" />
          </div>
        }
        show={showPlayerPopup}
        onClose={() => setShowPlayerPopup(false)}
      />
      <Popup
        title="Instruções"
        content={
          <div>
            <p>Para jogar, use as teclas:</p>
            <img src="https://img.icons8.com/ios-filled/50/00ffea/up-arrow.png" alt="Seta para Cima" />
            <img src="https://img.icons8.com/ios-filled/50/00ffea/down-arrow.png" alt="Seta para Baixo" />
          </div>
        }
        show={showIAPopup}
        onClose={() => setShowIAPopup(false)}
      />
    </div>
  );
};

export default Test;
