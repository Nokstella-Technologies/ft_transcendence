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
            let res = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: this.email(),
                    password: this.password()
                })
            });
            if (res.status === 200) {
                window.location.href = '/game';
                const body = JSON.parse(res.body)
                sessionStorage.setItem('token', body.token);
            } else {
                alert(body.message);
            }
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