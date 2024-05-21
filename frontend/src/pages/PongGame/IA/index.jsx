import { vr } from "..";

const IA = (canvas, ball, paddle, paddlePlayer) => {
 
  function predictBallPosition(canvas) {
    let predictedY = ball.ball.y;
    let predictedX = ball.ball.x;
    let dx = ball.ball.dx;
    let dy = ball.ball.dy;
    const maxSteps = 50; // Limitar o número de passos de simulação
    let steps = 0;
  
    while (predictedX < paddle.paddle.x - vr.BALL_RADIUS && steps < maxSteps) {
      predictedX += dx;
      predictedY += dy;
  
      // Refletir a bola se ela atingir as bordas superior ou inferior
      if (predictedY <= 0 || predictedY >= canvas.height) {
        dy = -dy;
      }

      if (predictedX >= canvas.width - vr.PADDLE_WIDTH - vr.BALL_RADIUS) {
        break;
      }        
      steps++;
    }
  
    return {predictedY, predictedX};
  }
  
  return {
    move: () => {
      let {predictedY, predictedX} = predictBallPosition(canvas.current);
      if (predictedX < canvas.current.width / 2 ) {
        predictedY = paddlePlayer.paddle.y;
      } 
      if (predictedY < paddle.paddle.y - vr.PADDLE_HEIGHT /  2) {
        paddle.handleKeyUp({ key: 'iaDown' });
        paddle.handleKeyDown({ key: 'iaUp' });
      } else if (predictedY > paddle.paddle.y + vr.PADDLE_HEIGHT / 2) {
        paddle.handleKeyUp({ key: 'iaUp' });
        paddle.handleKeyDown({ key: 'iaDown' });
      } else {
        paddle.handleKeyDown({ key: 'iaUp' });
        paddle.handleKeyDown({ key: 'iaDown' });
      }
    }
  };
};


export default IA;