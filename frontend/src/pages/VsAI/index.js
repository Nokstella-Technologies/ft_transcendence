
import Component from '../../../react/Component.js';
import BackgroundAnimation from '../../components/backgroundAnimation/backgroundAnimation.js';
import Container from '../../components/containers/index.js';
import TopBar from "../../components/topBar/topBar.js"
import authProvider from "../../provider/authProvider.js";
import userProvider from "../../provider/userProvider.js";
import MainVsAI from "../../components/mainVsAI/index.js"

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
        title: "Single Player",
        className: "vsai-container",
        children : `
        ${Container({
          title: "Player 01",
          className: "vsai-container-p1",
          children : `<div id="player1"></div>`
        })},
        ${Container({
          title: "IA",
          className: "vsai-container-p2",
          children : `<div id="playerAI"></div>`
        })}`
      })}
      </div>`;

  }

  async mount() {
      const topBar = new TopBar('#top_bar', false);
      topBar.reRender();

      const {_, token} = authProvider.get()


      const {apperance, user} = userProvider.get();
      const player1 = new MainVsAI('#player1', apperance, true)
      player1.reRender();
      const playerAI = new MainVsAI('#playerAI', apperance, false)
      playerAI.reRender();
  }
}

export default VsAI;