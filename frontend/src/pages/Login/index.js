
import Component from '../../../react/Component.js';
import SoundControl from '../../components/soundControl/index.js';
import BackgroundAnimation from '../../components/backgroundAnimation/backgroundAnimation.js';
import Container from '../../components/containers/index.js';
import LoginForm from './loginForm.js';

class Login extends Component {
    constructor(to) {
        super(to);
    }

    init() {
      
    }

    render() {
      return `
      <div class="login">
      ${BackgroundAnimation()}
              <div id="sound-control-container"></div>
              ${Container({
                title: "Login Pong",
                className: "login-container",
                children : `
                <div id="login-form-container"></div>
                      `
              })}
          </div>
      `;
  }

  mount() {
      const soundControl = new SoundControl('#sound-control-container', 'assets/sounds/music.m4a');
      soundControl.reRender();

      const loginForm = new LoginForm('#login-form-container');
      loginForm.reRender();
  }
}

export default Login;