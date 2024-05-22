import { randomBetween } from '../../../utils/random';
const PowerUp = (canvasRef, color, type) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let x = randomBetween(20, canvas.width - 20);
    let y = randomBetween(100, canvas.height - 100);
    const radius = 10;
    const speed = randomBetween(1, 3);
    const angle = Math.random() * 2 * Math.PI; // Ângulo aleatório
    const dy = speed * Math.sin(angle);
    const dx = speed * Math.cos(angle);
  
    const render = () => {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2, false);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.closePath();
    };
  
    const move = () => {
        x += dx;
        y += dy;
        if ( y < 0 || y > canvas.height) {
            respawn();
        }   
        // Reposicionar se sair dos limites do canvas
        if (x < 0 || x > canvas.width ) {
            return true
        }
        return false
    };
  
    const checkCollision = (paddle1, paddle2) => {
      let dist = Math.hypot(paddle1.paddle.x - x, paddle1.paddle.y - y);
      if ( dist - radius - paddle1.paddle.width < 1) {
        return true;
      }
      dist = Math.hypot(paddle2.paddle.x - x, paddle2.paddle.y - y);
      if ( dist - radius - paddle2.paddle.width < 1) {
        return true;
      }
      return false
    };
  
    const respawn = () => {
      x = centerX;
      y = centerY;
    };
  
    return { render, move, checkCollision, respawn, x, y };
  };
  
  export default PowerUp;