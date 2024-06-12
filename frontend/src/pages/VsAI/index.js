
import Component from '../../../react/Component.js';
import Container from '../../components/containers/index.js';
import TopBar from "../../components/topBar/topBar.js"
import authProvider from "../../provider/authProvider.js";
import userProvider from "../../provider/userProvider.js";
import MainVsAI from "../../components/mainVsAI/index.js";
import Footer from "../../components/footer/index.js";

class VsAI extends Component {
    constructor(to) {
        super(to);
    }

    init() {
      
    }

    render() {
      return `
      <nav id="top_bar" class="navbar navbar-expand-lg navbar-custom"> </nav>
      <div id="content_home">
      ${Container({
        title: "",
        className: "vsai-container",
        children : `
        ${Container({
          title: "",
          className: "vsai-container-p1",
          children : `<div id="player1"></div>`
        })},
        ${Container({
          title: "",
          className: "vsai-container-p2",
          children : `<div id="playerAI"></div>`
        })}`
      })}
      <button id="start-game" class="btn btn-primary btn-block" style="background-color: #00e5ff; border: none;">Start Game</button>
      </div>
      ${Footer()}`;
  }

  async mount() {

    const {_, token} = authProvider.get()

    await userProvider.getUser(token).then((res) => {
    }).catch((err) => {
      console.log(err)
      authProvider.logout();
      navigateTo('/')
    });

    const topBar = new TopBar('#top_bar', false);
    topBar.reRender();

    const {apperance, user} = userProvider.get();
    const player1 = new MainVsAI('#player1', apperance, true)
    player1.reRender();
    const playerAI = new MainVsAI('#playerAI', apperance, false)
    playerAI.reRender();

    document.querySelector(".btn-trocar-lado").addEventListener("click", this.trocarLado);
  }

  trocarLado() {
    const player1 = document.getElementById("player1");
    const playerAI = document.getElementById("playerAI");

    const player1Parent = player1.parentNode;
    const playerAIParent = playerAI.parentNode;

    player1Parent.insertBefore(playerAI, player1Parent.firstChild);
    playerAIParent.insertBefore(player1, playerAIParent.firstChild);
  }
}

export default VsAI;