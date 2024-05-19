import React, { useState } from 'react';
import './soundControl.css';

const SoundControl = ({ audioSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleSound = () => {
    const audioElement = document.getElementById('background-music');
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="sound-icon" onClick={toggleSound}>
      <img src={isPlaying ? 'https://img.icons8.com/ios-glyphs/30/00ffea/mute.png' : 'https://img.icons8.com/ios-glyphs/30/00ffea/musical-notes.png'} alt="Sound Icon" />
      <audio id="background-music" loop>
        <source src={audioSrc} type="audio/mpeg" />
        Seu navegador não suporta o elemento de áudio.
      </audio>
    </div>
  );
};

export default SoundControl;
