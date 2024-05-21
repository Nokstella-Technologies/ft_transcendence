
const PADDLE_HEIGHT = 40;
const BALL_RADIUS = 5;
const PADDLE_SPEED = 1;
const PADDLE_WIDTH = 5;

const Padlle = (canvasRef, up, down, backgroundColor) => {
  const paddle = { x: 0, y: 50, keys: { up: false, down: false } };

  const handleKeyDown = (e) => {
    if (e.key === up) paddle.keys.up = true;
    if (e.key === down) paddle.keys.down = true;
  };
 
  const handleKeyUp = (e) => {
    if (e.key === up) paddle.keys.up = false;
    if (e.key === down) paddle.keys.down = false;
  };

  const movePaddle = () => {
    const cv = canvasRef.current;
    if (paddle.keys.up) {
      paddle.y = Math.min(paddle.y + PADDLE_SPEED, cv.height - PADDLE_HEIGHT);
    }
    if (paddle.keys.down && paddle.y > 0) {
      paddle.y = Math.max(paddle.y - PADDLE_SPEED, 0);
    }
  };

  const render = (x, y) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = backgroundColor; 
    ctx.fillRect(paddle.x + x, y - paddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);
  }

  return  {
    paddle,
    render,
    handleKeyUp,
    handleKeyDown,
    movePaddle,

}
}
export default Padlle;