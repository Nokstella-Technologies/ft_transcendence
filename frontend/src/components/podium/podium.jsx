import React from 'react';
import HomeButton from '../homeButton/homeButton';
import Confetti from '../confetti/confetti';
import './podium.css';

const Podium = ({ winners }) => {
  return (
    <div class="podium-container">
      <div class="top-bar">
        <HomeButton onClick={() => window.location.href = 'home.html'} />
      </div>
      <div class="congrats">Parabéns aos Vencedores!</div>
      <div class="podium">
        <div class="place second">
          <img src={winners.second.avatar} alt="Segundo Lugar" />
          <p>{winners.second.name}</p>
        </div>
        <div class="place first">
          <img src={winners.first.avatar} alt="Primeiro Lugar" />
          <p>{winners.first.name}</p>
        </div>
        <div class="place third">
          <img src={winners.third.avatar} alt="Terceiro Lugar" />
          <p>{winners.third.name}</p>
        </div>
      </div>
      <div class="buttons">
        <button onClick={() => console.log('Novo Torneio')}>Novo Torneio</button>
        <button onClick={() => window.location.href = 'home.html'}>Home</button>
      </div>
      <Confetti />
    </div>
  );
};

export default Podium;
