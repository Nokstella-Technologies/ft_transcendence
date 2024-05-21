import React, { useRef, useEffect, useState, useCallback } from 'react';
import Music from "../../assets/sounds/music.m4a"
import './index.css';
import SoundControl from '../../components/soundControl';
import Padlle from './paddle';
import Cookies from 'js-cookie';
import Ball from './ball';
import IA from './IA';


const PADDLE_HEIGHT = 40;
const PADDLE_WIDTH = 5;
function Game() {
    const canvasRef = useRef(null);
    const [score, setScore] = useState({player1: 0, player2: 0});
    const [gameOver, setGameOver] = useState(false);
    const type = Cookies.get('type');
    const ball = useRef(null);
    const paddle1 = useRef(null);
    const paddle2 = useRef(null);
    const ia = useRef(null);

    const verifyScore = useCallback((player) => {
        setScore(prevScore => player === 'player1' ? prevScore.player1 + 1 : prevScore.player2 + 1);
    }, [setScore]);
    
    const handleKeyDown = (e) => {
        e.preventDefault();
        if (paddle1.current) paddle1.current.handleKeyDown(e);
        if (paddle2.current) paddle2.current.handleKeyDown(e);
    };

    const handleKeyUp = (e) => {
        e.preventDefault();
        if (paddle1.current) paddle1.current.handleKeyUp(e);
        if (paddle2.current) paddle2.current.handleKeyUp(e);
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
          window.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useEffect(() => {
        ball.current = Ball(canvasRef, "#fff");
        paddle1.current = Padlle(canvasRef, 'w', 's', 0 , "#fff");
        paddle2.current = type === undefined ? 
            Padlle(canvasRef, 'iaUp', 'iaDown',  canvasRef.current.width - PADDLE_WIDTH , "#fff") :
            Padlle(canvasRef,'ArrowUp', 'ArrowDown',  canvasRef.current.width - PADDLE_WIDTH ,"#fff");

        ia.current = IA(canvasRef, ball.current, paddle2.current, paddle1.current);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            paddle1.current.render(0, canvas.height - PADDLE_HEIGHT);
            paddle2.current.render(canvas.width - PADDLE_WIDTH, canvas.height - PADDLE_HEIGHT);
            ball.current.render();
            ball.current.checkCollisions(paddle1.current, paddle2.current, verifyScore);
            paddle1.current.movePaddle();
            paddle2.current.movePaddle();
            ball.current.move();

            if (type === undefined) {
                ia.current.move();
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render()

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
        
        }, [verifyScore, type])
      
    return (
        <>
            <div>
                <h1>Player1 :{`${score.player1}`}</h1>
                <h1>Player2 :{`${score.player2}`}</h1>
            </div>
            <SoundControl audioSrc={Music}/>
            <div className="ping-pong-container" >
                <canvas className='canvas_container' ref={canvasRef}></canvas>
            </div>
        </>
    );
}

export default Game;