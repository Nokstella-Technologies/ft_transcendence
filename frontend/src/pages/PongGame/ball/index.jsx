import { vr } from "../game";
import { randomBetween } from "../../../utils/random";

const Ball = (canvasRef,  backgroundColor) => {
  const ball = {
    x: canvasRef.current.width / 2,
    y: canvasRef.current.height / 2,
    radius: vr.BALL_RADIUS,
    speed: vr.BALL_SPEED,
    dx: vr.BALL_SPEED * (Math.random() > 0.5 ? randomBetween(0.5, 1) : -randomBetween(0.5, 1)),
    dy: vr.BALL_SPEED * (Math.random() > 0.5 ? randomBetween(0.5, 1) : -randomBetween(0.5, 1)),
  }

  const resetBall = () => {
    ball.x = canvasRef.current.width / 2;
    ball.y = canvasRef.current.height / 2;
    ball.dx = ball.speed * (Math.random() > 0.5 ? randomBetween(0.5, 1) : -randomBetween(0.5, 1))
    ball.dy = ball.speed * (Math.random() > 0.5 ? randomBetween(0.5, 1) : -randomBetween(0.5, 1))
  }

  const move = () => {
    ball.x += ball.dx;
    ball.y += ball.dy;
  };


  const checkCollisions = (paddle1, paddle2, updateScore) => {
    const canvas = canvasRef.current;

    // Colisão com as paredes superior e inferior
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
      ball.dy = -ball.dy;
    }

    // Colisão com a parede esquerda
    if (ball.x  <  0) {
      updateScore('player2');
      resetBall();
      paddle1.resetPaddle();
      paddle2.resetPaddle();
    }

    // Colisão com a parede direita
    if (ball.x + ball.radius > canvas.width) {
      updateScore('player1');
      resetBall();
      paddle1.resetPaddle();
      paddle2.resetPaddle();
    }

    
  
      // Colisão com o paddle1
      if (
        ball.x < paddle1.paddle.width &&
        ball.y >= paddle1.paddle.y + 1 && // Checa a colisão no eixo y
        ball.y <= paddle1.paddle.y + paddle1.paddle.height + 1
      ) {
        ball.dy =   ball.speed * (ball.dy < 0 ? randomBetween(0.5, 1) : -randomBetween(0.5, 1))
        ball.dx = -ball.dx;
        ball.x = paddle1.paddle.width + 2; // Ajuste a posição da bola para evitar múltiplas colisões
      }
      
  
      // Colisão com o paddle2
      if (
        ball.x + ball.radius > canvas.width - paddle2.paddle.width &&
        ball.y >= paddle2.paddle.y + 1 && // Checa a colisão no eixo y
        ball.y <= paddle2.paddle.y +  paddle2.paddle.height + 1
      ) {
        ball.dy = ball.speed * (ball.dy < 0  ? randomBetween(0.5, 1) : -randomBetween(0.5, 1))
        ball.dx = -ball.dx;
        ball.x = canvas.width - paddle2.paddle.width - ball.radius; /// Ajuste a posição da bola para evitar múltiplas colisões
      }
    };

  const render =  () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = backgroundColor; 
    ctx.fillRect(ball.x, ball.y, ball.radius, ball.radius);
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