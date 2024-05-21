import { vr } from "..";

const Padlle = (canvasRef, up, down, x, backgroundColor) => {
  const paddle = { x: x, y: 50, keys: { up: false, down: false } };

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
    if (paddle.keys.up && paddle.y > 0 ) {
      paddle.y = Math.min(paddle.y - vr.PADDLE_SPEED, cv.height - vr.PADDLE_HEIGHT);
    }
    if (paddle.keys.down && paddle.y < cv.height - vr.PADDLE_HEIGHT) {
      paddle.y = Math.max(paddle.y + vr.PADDLE_SPEED, 0);
    }
  };

  const render = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = backgroundColor; 
    ctx.fillRect(paddle.x, paddle.y, vr.PADDLE_WIDTH, vr.PADDLE_HEIGHT);
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