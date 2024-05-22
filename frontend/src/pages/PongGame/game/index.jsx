import React, { useEffect, useRef, useCallback, useState } from 'react';
import Ball from '../ball';
import Padlle from '../paddle';
import IA from '../IA';
import './index.css';
import PowerUp from '../powerUp';
import { randomBetween } from "../../../utils/random";
export const vr =  {  
    BALL_RADIUS: 5,
    BALL_SPEED: 2,
    PADDLE_HEIGHT : 20,
    PADDLE_WIDTH: 5,
    PADDLE_SPEED: 1.5,
}

const Game =  ({type, setScoreP1, setScoreP2, gameOver}) => {
    const canvasRef = useRef(null);
    const timeouts = useRef([]);
    const ball = useRef(null);
    const paddle1 = useRef(null);
    const [startGame, setGameStart] = useState(false);
    const paddle2 = useRef(null);
    const [powerUps, setPowerUps] = useState([]);
    const ia = useRef(null);

    const verifyScore = useCallback((player) => {
        setScoreP1((prev) => player === 'player1' ? prev + 1 : prev);
        setScoreP2((prev) => player === 'player2' ? prev + 1 : prev);
        setPowerUps([]);
        setGameStart(false);
    }, [setScoreP1, setScoreP2, setPowerUps, setGameStart]);
    
    const handleKeyDown = (e) => {
        e.preventDefault();
        if (paddle1.current) paddle1.current.handleKeyDown(e);
        if (paddle2.current) paddle2.current.handleKeyDown(e);  
    };

    const start = (e) => {
        e.preventDefault();
        if (e.key === 'Enter') setGameStart(true);
    }

    const handleKeyUp = (e) => {
        e.preventDefault();
        if (paddle1.current) paddle1.current.handleKeyUp(e);
        if (paddle2.current) paddle2.current.handleKeyUp(e);
    };

    function drawCenterLineAndCircle(ctx, canvasWidth, canvasHeight) {
        // Desenhar a linha central
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvasWidth / 2, 0);
        ctx.lineTo(canvasWidth / 2, canvasHeight);
        ctx.stroke();
        ctx.closePath();
      }

    useEffect(() => {
        if (!gameOver && startGame) {
               window.addEventListener('keydown', handleKeyDown);
                window.addEventListener('keyup', handleKeyUp);
            return () => {
                window.removeEventListener('keydown', handleKeyDown);
                window.removeEventListener('keyup', handleKeyUp);
            };
        } else  {
            window.addEventListener('keydown', start);
            return () => {
                window.removeEventListener('keydown', start);
            };
        }
    }, [gameOver, startGame, handleKeyDown, handleKeyUp, start]);

    useEffect(() => {
        ball.current = Ball(canvasRef, "#fff");
        paddle1.current = Padlle(canvasRef, 'w', 's', 0 , "#fff");
        paddle2.current = type === undefined ? 
        Padlle(canvasRef, 'iaUp', 'iaDown',  canvasRef.current.width - vr.PADDLE_WIDTH , "#fff") :
        Padlle(canvasRef,'ArrowUp', 'ArrowDown',  canvasRef.current.width - vr.PADDLE_WIDTH ,"#fff");
        ia.current = IA(canvasRef, ball.current, paddle2.current, paddle1.current);
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
              
        const renderObject = () => {
            drawCenterLineAndCircle(ctx, canvas.width, canvas.height);
            paddle1.current.render(0, canvas.height - vr.PADDLE_HEIGHT);
            paddle2.current.render(canvas.width - vr.PADDLE_WIDTH, canvas.height - vr.PADDLE_HEIGHT);
            ball.current.render();
        }
        
        
        if (!gameOver && startGame) {
            const render = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                renderObject();
                ball.current.move();
                ball.current.checkCollisions(paddle1.current, paddle2.current, verifyScore);
                paddle1.current.movePaddle();
                paddle2.current.movePaddle();
                if (type === undefined) {
                    ia.current.move();
                }
                powerUps.forEach((powerUp, index) => {
                    powerUp.render();
                    if (powerUp.checkCollision(paddle1.current, paddle2.current)) {
                        console.log("take power up")
                        setPowerUps((prev) => prev.filter((_, i) => i !== index));
                    }
                    if (powerUp.move()) {
                        setPowerUps((prev) => prev.filter((_, i) => i !== index));
                    }
                });
                
                
                animationFrameId = requestAnimationFrame(render);
            };
            render();
            return () => {
                cancelAnimationFrame(animationFrameId);
            };
        } else if (!startGame && !gameOver) {
            const render = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                renderObject();
            }

            animationFrameId = requestAnimationFrame(render);
            render();
            return () => {
                cancelAnimationFrame(animationFrameId);
            };
        }
    }, [verifyScore, type, gameOver, powerUps, startGame]);



    useEffect(() => {
        if (!gameOver && startGame) {
            const spawnPowerUp = () => {
                console.log("Spawning new PowerUp");
                setPowerUps((prevPowerUps) => [
                    ...prevPowerUps,
                    PowerUp(canvasRef, '#ff0')
                ]);
                const timeoutId = setTimeout(spawnPowerUp, Math.floor(randomBetween(5000, 10000))); // Spawn a cada 5-10 segundos
                timeouts.current.push(timeoutId);
            };

            // Inicializar geração de power-ups
            spawnPowerUp();

            return () => {
                timeouts.current.forEach(clearTimeout);
                timeouts.current = [];
            };
        }
    }, [gameOver, startGame]);
    
    return (
            <div className="ping-pong-container" >
                <canvas className='canvas_container' ref={canvasRef}></canvas>
            </div>
    );
}

export default Game;
