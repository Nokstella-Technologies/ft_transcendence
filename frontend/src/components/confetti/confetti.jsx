import React, { useEffect } from 'react';
import './confetti.css';

const Confetti = () => {
    useEffect(() => {
        function createConfettiPiece() {
            const confetti = document.getElementById('confetti');
            const piece = document.createElement('div');
            piece.classList.add('confetti-piece');
            piece.style.left = Math.random() * 100 + 'vw';
            piece.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confetti.appendChild(piece);
        }

        for (let i = 0; i < 100; i++) {
            createConfettiPiece();
        }
    }, []);

    return <div class="confetti" id="confetti"></div>;
};

export default Confetti;
