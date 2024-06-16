    import Component from "../../../react/Component.js";
    import SoundControl from "../../components/soundControl/index.js";
import authProvider from "../../provider/authProvider.js";
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
            this.scoreP2 = scoreP2;
            this.gameOver = gameOver;
            this.setScoreP1 = setScoreP1;
            this.setScoreP2 = setScoreP2;
            this.setGameOver = setGameOver;
           
            this.soundControl = new SoundControl('#sound-control-container', 'assets/sounds/music.m4a');
            this.game = new Game('#game-container')
        }
        
        GameOver() {
            const { game, player1, player2} = gameProvider.get();
            return `
            <h1>Game Over</h1>
            ${this.scoreP1() === 5 ? `<h1>${player1.username} Win</h1>` : `<h1>${player2.username} Win</h1>`}
            <button type="button" class="btn btn-dark btn-block" style="margin-top: 10px;">
            ${game.type == 'tournament' ? "Continuar Torneio" : "Voltar" }</button>
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
            const {token} = authProvider.get();
            if (game === undefined) { 
                return navigateTo('/home')
            } 
            this.setScoreP1(game.score_player1)
            this.setScoreP2(game.score_player2)
            this.setGameOver(game.status === "active" ? false : true)
            this.soundControl.reRender();
            const score = (player) => {
                game.score_player1 = player === "player1" ? game.score_player1 + 1 : game.score_player1;
                game.score_player2 = player === "player2" ? game.score_player2 + 1 : game.score_player2;
                if (game.score_player1 === 5 || game.score_player2 === 5) {
                    game.end = true;
                    game.winner = game.score_player1 === 5 ? game.player1_id : game.player2_id;
                }
                try {
                    gameProvider.setScore(token, player);
                }catch (err) {
                    console.error(err);
                }
                this.reRender();
            };
            if (!this.gameOver()) {
                this.game.newRender("player2", score, this.gameOver, player1.appearance[0]);
            } else {
                document.querySelector('.btn').addEventListener('click', () => { 
                    game.type == 'tournament' ? navigateTo('/tournament') : navigateTo('/home');
                });
            }
        }
    }

export default PageGame;
