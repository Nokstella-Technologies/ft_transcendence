import React, { useEffect, useRef, useCallback, useState } from 'react';
import Ball from '../ball';
import Padlle from '../paddle';
import IA from '../IA';
import './index.css';
import PowerUp from '../powerUp';

export var vr =  {  
    BALL_RADIUS: 5,
    BALL_SPEED: 2.5,
    PADDLE_HEIGHT : 20,
    PADDLE_WIDTH: 5,
    PADDLE_SPEED: 2,
}

const Game =  ({type, setScoreP1, setScoreP2, gameOver}) => {
    const canvasRef = useRef(null);
    const timeouts = useRef([]);
    const ball = useRef(null);
    const powerUp = useRef(null);
    const paddle1 = useRef(null);
    const paddle2 = useRef(null);
    const [powerUps, setPowerUps] = useState([]);
    const ia = useRef(null);

    const verifyScore = useCallback((player) => {
        setScoreP1((prev) => player === 'player1' ? prev + 1 : prev);
        setScoreP2((prev) => player === 'player2' ? prev + 1 : prev);
    }, [setScoreP1, setScoreP2]);
    
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
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
          window.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useEffect(() => {
        if (!gameOver) {

            ball.current = Ball(canvasRef, "#fff");
            paddle1.current = Padlle(canvasRef, 'w', 's', 0 , "#fff");
            paddle2.current = type === undefined ? 
            Padlle(canvasRef, 'iaUp', 'iaDown',  canvasRef.current.width - vr.PADDLE_WIDTH , "#fff") :
            Padlle(canvasRef,'ArrowUp', 'ArrowDown',  canvasRef.current.width - vr.PADDLE_WIDTH ,"#fff");
            powerUp.current = PowerUp(canvasRef, "#fff");
            ia.current = IA(canvasRef, ball.current, paddle2.current, paddle1.current);
            
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            let animationFrameId;
            
            const render = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawCenterLineAndCircle(ctx, canvas.width, canvas.height);
                paddle1.current.render(0, canvas.height - vr.PADDLE_HEIGHT);
                paddle2.current.render(canvas.width - vr.PADDLE_WIDTH, canvas.height - vr.PADDLE_HEIGHT);
                ball.current.render();
                ball.current.move();
                ball.current.checkCollisions(paddle1.current, paddle2.current, verifyScore);
                paddle1.current.movePaddle();
                paddle2.current.movePaddle();
                // powerUps.forEach((powerUp, index) => {
                //     powerUp.render();
                //     if (powerUp.checkCollision( paddle1.current, paddle2.current)) {
                //         console.log("take power up")
                //         setPowerUps((prev) => prev.filter((_, i) => i !== index));
                //     }
                //     if (powerUp.move()) {
                //         setPowerUps((prev) => prev.filter((_, i) => i !== index));
                //     }
                // });
                
                if (type === undefined) {
                    ia.current.move();
                }
                
                animationFrameId = requestAnimationFrame(render);
            };
            
            render();
            
            return () => {
                cancelAnimationFrame(animationFrameId);
            };
        } 
    }, [verifyScore, type, gameOver, powerUps]);



    // useEffect(() => {
    //     if (!gameOver) {
    //         const spawnPowerUp = () => {
    //             setPowerUps((prevPowerUps) => [
    //                 ...prevPowerUps,
    //                 PowerUp(canvasRef, '#ff0')
    //             ]);
    //             const timeoutId = setTimeout(spawnPowerUp, Math.random() * 5000 + 5000); // Spawn a cada 5-10 segundos
    //             timeouts.current.push(timeoutId);
    //         };

    //         // Inicializar geração de power-ups
    //         spawnPowerUp();

    //         return () => {
    //             timeouts.current.forEach(clearTimeout);
    //             timeouts.current = [];
    //         };
    //     }
    // }, [gameOver]);
    
    return (
            <div className="ping-pong-container" >
                <canvas className='canvas_container' ref={canvasRef}></canvas>
            </div>
    );
}

export default Game;
