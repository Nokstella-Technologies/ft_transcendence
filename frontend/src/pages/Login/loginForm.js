import Component from '../../../react/Component.js';
import authProvider from '../../provider/authProvider.js';

class LoginForm extends Component {
    constructor(to) {
        super(to);
        if (window.location.search.search("code") !== -1) {
            // authProvider.login42(window.location.search)
        }
        this.init();
    }

    init() {
        const [email, setEmail] = this.useState('');
        const [password, setPassword] = this.useState('');
        this.email = email;
        this.setEmail = setEmail;
        this.password = password;
        this.setPassword = setPassword;
    }

    render() {
        return `
            <form id="login-form">
                <div class="form-group">
                    <input type="text" autocomplete="username" class="form-control" id="email" placeholder="Email" value="${this.email()}" required>
                </div>
                <div class="form-group">
                    <input type="password" autocomplete="current-password" class="form-control" id="password" placeholder="Senha" value="${this.password()}" required>
                </div>
                <button type="submit" class="btn btn-primary btn-block" style="background-color: #00e5ff; border: none;">Login</button>
                <button type="button" class="btn btn-dark btn-block" style="margin-top: 10px;">Login com 42</button>
            </form>
        `;
    }

    mount() {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await authProvider.login(this.email(), this.password()).then(() =>{
                window.location.href = '/home';
            }).catch(err => {
                alert(err.message)
            });
            
        });

        emailInput.addEventListener('input', (e) => {
            this.setEmail(e.target.value);
        });

        passwordInput.addEventListener('input', (e) => {
            this.setPassword(e.target.value);

        }); 

        const login42 = async () => {
            const clientID = "u-s4t2ud-02969ded8f525ab740688ae88c19e30b6f5f25582c0fa571d8db9c20e27ccfe3"
            const redirect = "https://localhost/"
            const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientID}&redirect_uri=${encodeURIComponent(redirect)}&response_type=code`;
            window.location.href = authUrl;
        }

        document.querySelector('.btn-dark').addEventListener('click', login42);
    }
}

export default LoginForm;