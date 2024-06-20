
import Component from "../../../react/Component.js";
import Footer from "../../components/footer/index.js";
import ProfileContainer from "../../components/profileContainer/index.js";
import TopBar from "../../components/topBar/topBar.js"

class Profile extends Component {
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
      ${Footer()} 
    `
  }

  mount () {
    const topBar = new TopBar('#top_bar', true);
    topBar.reRender();
    const profile = new ProfileContainer('#content_profile');
    profile.reRender();
  }
}


export default Profile;