import React from 'react';
import HomeButton from '../homeButton/homeButton';
import Confetti from '../confetti/confetti';
import './podium.css';

const Podium = ({ winners }) => {
  return (
    <div className="podium-container">
      <div className="top-bar">
        <HomeButton onClick={() => window.location.href = 'home.html'} />
      </div>
      <div className="congrats">Parabéns aos Vencedores!</div>
      <div className="podium">
        <div className="place second">
          <img src={winners.second.avatar} alt="Segundo Lugar" />
          <p>{winners.second.name}</p>
        </div>
        <div className="place first">
          <img src={winners.first.avatar} alt="Primeiro Lugar" />
          <p>{winners.first.name}</p>
        </div>
        <div className="place third">
          <img src={winners.third.avatar} alt="Terceiro Lugar" />
          <p>{winners.third.name}</p>
        </div>
      </div>
      <div className="buttons">
        <button onClick={() => console.log('Novo Torneio')}>Novo Torneio</button>
        <button onClick={() => window.location.href = 'home.html'}>Home</button>
      </div>
      <Confetti />
    </div>
  );
};

export default Podium;
