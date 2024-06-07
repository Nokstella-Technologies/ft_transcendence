import Component from "../../../react/Component.js";
import ProfileContainer from "../../components/profileContainer/index.js";
import TopBar from "../../components/topBar/topBar.js"

class Home extends Component {
  constructor(to) {
    super(to);
    this.init();
  }

  init() {
  
  }

  render () {
    return `
      <nav id="top_bar" class="navbar navbar-expand-lg navbar-custom"> </nav>
      <div id="content_profile"></div> 
    `
  }

  mount () {
    const topBar = new TopBar('#top_bar', [
      {username: "Amigo 1", status: "online"}, 
      {username: "Amigo 2", status: "offline"}],
      true,
      {username: "Luiz", profilePicture: "https://img.icons8.com/ios-glyphs/30/00ffea/user"}
    );
    topBar.reRender();
    const profileContainer = new ProfileContainer('#content_profile')
    profileContainer.reRender();
  
  }
}


export default Home;