import React, { useState } from 'react';
import './themeSelector.css';
import Popup from '../popup/popup';

const themes = [
  { name: 'original', color: '#000' },
  { name: 'model1', color: '#282828' },
  { name: 'model2', color: '#0e0e0e' }
];

const ThemeSelector = ({ onThemeChange }) => {
  const [selectedTheme, setSelectedTheme] = useState('model1');
  const [showPopup, setShowPopup] = useState(false);

  const handleThemeChange = (theme) => {
    if (theme === 'customize') {
      setShowPopup(true);
    } else {
      setSelectedTheme(theme);
      onThemeChange(theme);
    }
  };

  const handlePopupSave = (customTheme) => {
    setSelectedTheme('customize');
    onThemeChange('customize', customTheme);
    setShowPopup(false);
  };

  const customContent = (
    <div>
      <div class="message">Escolha a cor da raquete:</div>
      <div class="color-picker">
        <div style={{ background: '#fff' }} onClick={() => setPaddleColor('#fff')}></div>
        <div style={{ background: '#ff69b4' }} onClick={() => setPaddleColor('#ff69b4')}></div>
        <div style={{ background: '#00ff00' }} onClick={() => setPaddleColor('#00ff00')}></div>
        <div style={{ background: '#ff4500' }} onClick={() => setPaddleColor('#ff4500')}></div>
        <div style={{ background: '#1e90ff' }} onClick={() => setPaddleColor('#1e90ff')}></div>
      </div>
      <div class="message">Escolha a cor da bola:</div>
      <div class="color-picker">
        <div style={{ background: '#fff' }} onClick={() => setBallColor('#fff')}></div>
        <div style={{ background: '#ff69b4' }} onClick={() => setBallColor('#ff69b4')}></div>
        <div style={{ background: '#00ff00' }} onClick={() => setBallColor('#00ff00')}></div>
        <div style={{ background: '#ff4500' }} onClick={() => setBallColor('#ff4500')}></div>
        <div style={{ background: '#1e90ff' }} onClick={() => setBallColor('#1e90ff')}></div>
      </div>
      <div class="message">Escolha a cor do background:</div>
      <div class="color-picker">
        <div style={{ background: '#000' }} onClick={() => setBackgroundColor('#000')}></div>
        <div style={{ background: '#ff69b4' }} onClick={() => setBackgroundColor('#ff69b4')}></div>
        <div style={{ background: '#00ff00' }} onClick={() => setBackgroundColor('#00ff00')}></div>
        <div style={{ background: '#ff4500' }} onClick={() => setBackgroundColor('#ff4500')}></div>
        <div style={{ background: '#1e90ff' }} onClick={() => setBackgroundColor('#1e90ff')}></div>
      </div>
      <button onClick={handlePopupSave}>Salvar</button>
    </div>
  );

  return (
    <>
      <div class="theme-selector">
        {themes.map(theme => (
          <div
            key={theme.name}
            class={`theme ${theme.name} ${selectedTheme === theme.name ? 'selected' : ''}`}
            onClick={() => handleThemeChange(theme.name)}
          >
            <canvas id={`${theme.name}Canvas`} width="100" height="100"></canvas>
          </div>
        ))}
        <div class="theme customize" onClick={() => handleThemeChange('customize')}>
          <img src="https://img.icons8.com/ios-filled/50/00ffea/settings.png" alt="Customizar" />
        </div>
      </div>
      <Popup title="Customizar Jogo" content={customContent} show={showPopup} onClose={() => setShowPopup(false)} />
    </>
  );
};

export default ThemeSelector;
