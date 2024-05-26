import Component from '../../../react/Component.js';

class LoginForm extends Component {
    constructor(to) {
        super(to);
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
                    <input type="email" class="form-control" id="email" placeholder="Email" value="${this.email()}" required>
                </div>
                <div class="form-group">
                    <input type="password" class="form-control" id="password" placeholder="Senha" value="${this.password()}" required>
                </div>
                <button type="submit" class="btn btn-primary btn-block" style="background-color: #00e5ff; border: none;">Login</button>
                <button type="button" class="btn btn-dark btn-block" style="margin-top: 10px;">Login com 42</button>
            </form>
        `;
    }

    mount() {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            alert(`Email: ${this.email()}, Password: ${this.password()}`);
        });

        emailInput.addEventListener('input', (e) => {
            this.setEmail(e.target.value);
        });

        passwordInput.addEventListener('input', (e) => {
            this.setPassword(e.target.value);

        }); 
    }
}

export default LoginForm;