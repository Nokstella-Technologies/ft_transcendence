import {useRef } from 'react';

const BALL_RADIUS = 5;
const BALL_SPEED = 2;
const PADDLE_HEIGHT = 40;
const PADDLE_WIDTH = 5;

const Ball = (canvasRef,  backgroundColor) => {
  const ball = {
    x: canvasRef.current.width / 2,
    y: 50,
    dx: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
    dy: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1)
  };

  const resetBall = () => {
    ball.x = canvasRef.current.width / 2;
    ball.y = canvasRef.current.height / 2;
    ball.dx = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
  };

  const move = () => {
    ball.x += ball.dx;
    ball.y += ball.dy;
  };

  const checkCollisions = (paddle1, paddle2, updateScore) => {
    const canvas = canvasRef.current;

    // Colisão com as paredes superior e inferior
    if (ball.y - BALL_RADIUS < 0 || ball.y + BALL_RADIUS > canvas.height) {
      ball.dy = -ball.dy;
    }

    // Colisão com a parede esquerda
    if (ball.x  <  0) {
      updateScore('player2');
      resetBall();
    }

    // Colisão com a parede direita
    if (ball.x + BALL_RADIUS > canvas.width) {
      updateScore('player1');
      resetBall();
    }

  
      // Colisão com o paddle1
      if (
        ball.x < PADDLE_WIDTH - 2 &&
        ball.y >= paddle1.paddle.y && // Checa a colisão no eixo y
        ball.y <= paddle1.paddle.y + PADDLE_HEIGHT
      ) {
        ball.dx = -ball.dx;
        ball.x = PADDLE_WIDTH + BALL_RADIUS; // Ajuste a posição da bola para evitar múltiplas colisões
      }
      
  
      // Colisão com o paddle2
      if (
        ball.x + BALL_RADIUS > canvas.width - PADDLE_WIDTH &&
        ball.y >= paddle2.paddle.y && // Checa a colisão no eixo y
        ball.y <= paddle2.paddle.y + PADDLE_HEIGHT
      ) {
        ball.dx = -ball.dx;
        ball.x = canvas.width - PADDLE_WIDTH - BALL_RADIUS; /// Ajuste a posição da bola para evitar múltiplas colisões
      }
    };

  const render =  () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = backgroundColor; 
    ctx.fillRect(ball.x, ball.y, BALL_RADIUS, BALL_RADIUS);
  }
  return  {
    ball,
    render,
    move,
    checkCollisions,
    render,
  }
}
export default Ball;