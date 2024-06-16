import Component from "../../../react/Component.js";
import Container from "../../components/containers/index.js";
import TopBar from "../../components/topBar/topBar.js";
import Footer from "../../components/footer/index.js";
import StartTournament from "./startTournament.js";
import userProvider from "../../provider/userProvider.js";
import authProvider from "../../provider/authProvider.js";

class Tournament extends Component {
    constructor(to) {
        super(to);
        this.init();
    
    }
    init() { 
       

    }
  
    render () {
      return `
        <nav id="top_bar" class="navbar navbar-expand navbar-custom"> </nav>
        <div class="page">
        </div>
        ${Footer()}
      `
    }
  
    async mount () {
        const {token} = authProvider.get();
        await userProvider.getUser(token).catch((err) => {
            console.log(err)
            authProvider.logout();
            return navigateTo('/')
        }); 
        const topBar = new TopBar('#top_bar', false);
        topBar.reRender();
        const startTournament = new StartTournament('.page');
        startTournament.reRender();
    }
  }
  
export default Tournament;