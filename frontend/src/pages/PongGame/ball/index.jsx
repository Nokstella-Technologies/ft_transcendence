
import { vr } from "..";

const Ball = (canvasRef,  backgroundColor) => {
  const ball = {
    x: canvasRef.current.width / 2,
    y: canvasRef.current.height / 2,
    dx: vr.BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
    dy: vr.BALL_SPEED * (Math.random() > 0.5 ? 1 : -1)
  };

  const resetBall = () => {
    ball.x = canvasRef.current.width / 2;
    ball.y = canvasRef.current.height / 2;
    ball.dx = vr.BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = vr.BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
  };

  const move = () => {
    ball.x += ball.dx;
    ball.y += ball.dy;
  };

  const checkCollisions = (paddle1, paddle2, updateScore) => {
    const canvas = canvasRef.current;

    // Colisão com as paredes superior e inferior
    if (ball.y - vr.BALL_RADIUS < 0 || ball.y + vr.BALL_RADIUS > canvas.height) {
      ball.dy = -ball.dy;
    }

    // Colisão com a parede esquerda
    if (ball.x  <  0) {
      updateScore('player2');
      resetBall();
    }

    // Colisão com a parede direita
    if (ball.x + vr.BALL_RADIUS > canvas.width) {
      updateScore('player1');
      resetBall();
    }

  
      // Colisão com o paddle1
      if (
        ball.x < vr.PADDLE_WIDTH - 2 &&
        ball.y >= paddle1.paddle.y && // Checa a colisão no eixo y
        ball.y <= paddle1.paddle.y + vr.PADDLE_HEIGHT
      ) {
        ball.dx = -ball.dx;
        ball.x = vr.PADDLE_WIDTH + vr.BALL_RADIUS; // Ajuste a posição da bola para evitar múltiplas colisões
      }
      
  
      // Colisão com o paddle2
      if (
        ball.x + vr.BALL_RADIUS > canvas.width - vr.PADDLE_WIDTH &&
        ball.y >= paddle2.paddle.y && // Checa a colisão no eixo y
        ball.y <= paddle2.paddle.y + vr.PADDLE_HEIGHT
      ) {
        ball.dx = -ball.dx;
        ball.x = canvas.width - vr.PADDLE_WIDTH - vr.BALL_RADIUS; /// Ajuste a posição da bola para evitar múltiplas colisões
      }
    };

  const render =  () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = backgroundColor; 
    ctx.fillRect(ball.x, ball.y, vr.BALL_RADIUS, vr.BALL_RADIUS);
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