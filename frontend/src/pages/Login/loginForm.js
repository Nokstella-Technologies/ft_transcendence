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
                <div id="error-message" class="text-danger"></div>
                <div class="form-group">
                    <input type="text" autocomplete="username" class="form-control" id="email" placeholder="Username" value="${this.email()}" required>
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
        const errorMessage = document.getElementById('error-message');

        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            if (this.email() === '' || this.password() === '') {
                this.errorMessage = 'Por favor, preencha todos os campos.';
            }
            try {
                const res = await authProvider.login(this.email(), this.password())
                if (res.status === 200) {
                    window.location.href = '/home';
                }
            } catch(err) {
                errorMessage.textContent = 'Usuário ou senha inválidos';
            }       
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