import React, { useState } from 'react';
import './index.css';

const SoundControl = ({ audioSrc }) => {
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleSound = () => {
    const audioElement = document.getElementById('background-music');
    if (isPlaying) {
      audioElement.play();
    } else {
      audioElement.pause();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="sound-icon" onClick={toggleSound}>
      <img src={isPlaying ? 'https://img.icons8.com/ios-glyphs/30/00ffea/musical-notes.png' : 'https://img.icons8.com/ios-glyphs/30/00ffea/mute.png'} alt="Sound Icon" />
      <audio id="background-music" loop autoPlay>
        <source src={audioSrc} type="audio/mpeg" />
        Seu navegador não suporta o elemento de áudio.
      </audio>
    </div>
  );
};

export default SoundControl;
