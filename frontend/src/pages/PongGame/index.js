    import Component from "../../../react/Component.js";
    import SoundControl from "../../components/soundControl/index.js";
    import Game from './game/index.js';

    class PageGame extends Component {
        constructor(to) {
            super(to);
            this.init();
        }
        
        init() {
            const [scoreP1, setScoreP1] = this.useState(0);
            const [scoreP2, setScoreP2] = this.useState(0);
            const [gameOver, setGameOver] = this.useState(false);
            this.scoreP1 = scoreP1;
            this.setScoreP1 = setScoreP1;
            this.scoreP2 = scoreP2;
            this.setScoreP2 = setScoreP2;
            this.gameOver = gameOver;
            this.setGameOver = setGameOver;
        }
        
        GameOver() {
            return `
            <h1>Game Over</h1>
            ${this.scoreP1() === 5 ? `<h1>Player1 Win</h1>` : `<h1>Player2 Win</h1>`}
            <button type="button" class="btn btn-dark btn-block" style="margin-top: 10px;">Restart</button>
            `;
        }
        
        renderGame() {
            return `<div id="game-container" class="ping-pong-container"></div>`;
        }
        
        render() {
            return `
            <div id="sound-control-container"></div>
            <div class="container-pageGame">
                <h1>Player1 VS Player2</h1>
                <h1>${this.scoreP1()} - ${this.scoreP2()}</h1>
                ${this.gameOver() ? this.GameOver() : this.renderGame()}
            </div>
            `;
        }
        
        mount() {
            const soundControl = new SoundControl('#sound-control-container', 'assets/sounds/music.m4a');
            soundControl.reRender();
            
            const score = (player) => {
                if (player === "player1") {
                    this.setScoreP1(this.scoreP1() + 1);
                } else {
                    this.setScoreP2(this.scoreP2() + 1);
                }

            };

            if (!this.gameOver()) {
                this.game = new Game('#game-container', undefined, score, this.gameOver);
                this.game.reRender();
            } else {
                document.querySelector('.btn').addEventListener('click', () => { 
                    if (this.game) {
                        this.game.destroy();
                        this.game = null;
                    }
                    this.setScoreP1(0);
                    this.setScoreP2(0);
                    this.setGameOver(false);
                    this.reRender();
                });
            }

            this.useEffect(() => {
                if (this.scoreP1() === 5 || this.scoreP2() === 5) {
                    this.setGameOver(true);
                }
            }, [this.scoreP1(), this.scoreP2()]);
        }
    }

    export default PageGame;
