import Component from '../../../../react/Component.js';
import Ball from '../ball/index.js';
import Padlle from '../paddle/index.js';
import IA from '../IA/index.js';
import { newPowerUp } from '../powerUp/index.js';
import { randomBetween } from "../../../utils/random.js";

export const vr = {  
    BALL_RADIUS: 10,
    BALL_SPEED: 5,
    PADDLE_HEIGHT: 100,
    PADDLE_WIDTH: 8,
    PADDLE_SPEED: 4.5,
};

class Game extends Component {
    constructor(to, type, score, gameOver) {
        super(to);
        const [startGame, setGameStart] = this.useState(false);
        this.startGame = startGame;
        this.setGameStart = setGameStart;
        this.type = type;
        this.score = score;
        this.gameOver = gameOver;
        this.canvasRef = null;
        this.timeouts = [];
        this.ball = null;
        this.paddle1 = null;
        this.paddle2 = null;
        this.powerUpsRef = [];
        this.ia = null;
        this.animationFrameId = null;
    }

    verifyScore(player) {
        this.powerUpsRef = [];
        this.setGameStart(false);
        this.score(player);
    }

    handleKeyDown(e) {
        e.preventDefault();
        if (this.paddle1) this.paddle1.handleKeyDown(e);
        if (this.paddle2) this.paddle2.handleKeyDown(e);
    }

    handleKeyUp(e) {
        e.preventDefault();
        if (this.paddle1) this.paddle1.handleKeyUp(e);
        if (this.paddle2) this.paddle2.handleKeyUp(e);
    }

    start(e) {
        e.preventDefault();
        if (e.key === 'Enter') this.setGameStart(true);
    }

    drawCenterLineAndCircle(ctx, canvasWidth, canvasHeight) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvasWidth / 2, 0);
        ctx.lineTo(canvasWidth / 2, canvasHeight);
        ctx.stroke();
        ctx.closePath();
    }

    initCanvas() {
        this.canvasRef = document.querySelector('canvas');
        this.canvasRef.width = this.canvasRef.clientWidth;
        this.canvasRef.height = this.canvasRef.clientHeight;
    }

    initGameObjects() {
        this.ball = Ball(this.canvasRef, "#fff");
        this.paddle1 = Padlle(this.canvasRef, 'w', 's', 0, "#fff");
        this.paddle2 = this.type === undefined ? 
            Padlle(this.canvasRef, 'iaUp', 'iaDown', this.canvasRef.width - vr.PADDLE_WIDTH, "#fff") :
            Padlle(this.canvasRef, 'ArrowUp', 'ArrowDown', this.canvasRef.width - vr.PADDLE_WIDTH, "#fff");
        this.ia = IA(this.canvasRef, this.ball, this.paddle2, this.paddle1);
    }

    initEventListeners() {
        if (this.startGame() && !this.gameOver()) {
            window.addEventListener('keydown', this.handleKeyDown.bind(this));
            window.addEventListener('keyup', this.handleKeyUp.bind(this));
        } else {
            window.addEventListener('keydown', this.start.bind(this));
        }
    }

    removeEventListeners() {
        window.removeEventListener('keydown', this.handleKeyDown.bind(this));
        window.removeEventListener('keyup', this.handleKeyUp.bind(this));
        window.removeEventListener('keydown', this.start.bind(this));
    }

    renderObjects(ctx) {
        this.drawCenterLineAndCircle(ctx, this.canvasRef.width, this.canvasRef.height);
        this.paddle1.render(0, this.canvasRef.height - vr.PADDLE_HEIGHT);
        this.paddle2.render(this.canvasRef.width - vr.PADDLE_WIDTH, this.canvasRef.height - vr.PADDLE_HEIGHT);
        this.ball.render();
    }

    renderFrame() {
        const ctx = this.canvasRef.getContext('2d');
        ctx.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height);
        this.renderObjects(ctx);
        if (this.startGame() && !this.gameOver()) {
            this.ball.move();
            this.powerUpsRef.forEach((powerUp, index) => {
                powerUp.render();
                if (powerUp.checkCollision(this.paddle1, this.ball, this.paddle2)) {
                    console.log("take power up");
                    this.powerUpsRef.splice(index, 1);
                }
                if (powerUp.move()) {
                    this.powerUpsRef.splice(index, 1);
                }
            });
            this.ball.checkCollisions(this.paddle1, this.paddle2, this.verifyScore.bind(this));
            this.paddle1.movePaddle();
            this.paddle2.movePaddle();
            if (this.type === undefined) {
                this.ia.move(this.powerUpsRef);
            }
        }
        this.animationFrameId = requestAnimationFrame(this.renderFrame.bind(this));
    }

    init() {
        this.initCanvas();
        this.initGameObjects();
        this.initEventListeners();
        this.renderFrame();

        this.useEffect(() => {
            if (this.startGame() && !this.gameOver()) {
                const spawnPowerUp = () => {
                    console.log("Spawning new PowerUp");
                    const powerup = newPowerUp(this.canvasRef);
                    this.powerUpsRef.push(powerup);
                    const timeoutId = setTimeout(spawnPowerUp, randomBetween(5000, 10000)); // Spawn a cada 5-10 segundos
                    this.timeouts.push(timeoutId);
                };
                spawnPowerUp();
                return () => {
                    console.log("Cleaning up timeouts");
                    this.timeouts.forEach(clearTimeout);
                    this.timeouts = [];
                };
            }
        }, [this.startGame, this.gameOver, this.powerUpsRef, this.canvasRef]);
    }

    render() {
        return `
            <canvas class="canvas_container"></canvas>
        `;
    }

    destroy() {
        super.destroy();
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.removeEventListeners();
    }

    mount() {
        this.init();
    }
}

export default Game;
