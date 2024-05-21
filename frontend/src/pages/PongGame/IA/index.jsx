import Padlle from "../paddle";

const PADDLE_HEIGHT = 40;

const IA = (ball, paddle) => {
  return {
    move: (canvas) => {
      if (ball.ball.y > paddle.paddle.y  + PADDLE_HEIGHT / 2 ) {
        if (ball.ball.dy < 0) {
          paddle.handleKeyUp({ key: 'iaDown' });
          paddle.handleKeyDown({ key: 'iaUp' });
        } else {
          paddle.handleKeyUp({ key: 'iaUp' });
          paddle.handleKeyDown({ key: 'iaDown' });
        }

      } else if (ball.ball.y < paddle.paddle.y + PADDLE_HEIGHT / 2) {
        if (ball.ball.dy > 0) {
          paddle.handleKeyUp({ key: 'iaDown' });
          paddle.handleKeyDown({ key: 'iaUp' });
        } else {
          paddle.handleKeyUp({ key: 'iaUp' });
          paddle.handleKeyDown({ key: 'iaDown' });
        }
      }
    }
  };
};


export default IA;