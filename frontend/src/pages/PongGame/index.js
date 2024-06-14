    import Component from "../../../react/Component.js";
    import SoundControl from "../../components/soundControl/index.js";
import gameProvider from "../../provider/gameProvider.js";
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
            const { player1, player2} = gameProvider.get();
            return `
            <div id="sound-control-container"></div>
            <div class="container-pageGame">
                <h1>${player1.username} VS ${player2.username}</h1>
                <h1>${this.scoreP1()} - ${this.scoreP2()}</h1>
                ${this.gameOver() ? this.GameOver() : this.renderGame()}
            </div>
            `;
        }
        

        mount() {
            const {game, player1} = gameProvider.get();
            if (game === undefined) { 
                return navigateTo('/home')
            } else {
                this.setScoreP1(game.score_player1);
                this.setScoreP2(game.score_player2);
                this.setGameOver(game.status === "active" ? false : true)
            }
            const soundControl = new SoundControl('#sound-control-container', 'assets/sounds/music.m4a');
            soundControl.reRender();

            const score = (player) => {
                if (player === "player1") {
                    this.setScoreP1(this.scoreP1() + 1);
                } else {
                    this.setScoreP2(this.scoreP2() + 1);
                }

            };

            if (!this.gameOver() && this.game == null) {
                this.game = new Game('#game-container', "player2", score, this.gameOver, player1.appearance[0])
                this.game.reRender();
            } else if (this.gameOver()){
                document.querySelector('.btn').addEventListener('click', () => { 
                    if (this.scoreP1() !== 0) this.setScoreP1(0);
                    if (this.scoreP2() !== 0) this.setScoreP2(0);
                    this.setGameOver(false);
                });
            } else {
                this.game.reRender();
            }

            this.useEffect(() => {
                if (this.scoreP1() === 5 || this.scoreP2() === 5) {
                    this.setGameOver(true);
                }
            }, [this.scoreP1(), this.scoreP2()]);
        }
    }

export default PageGame;
