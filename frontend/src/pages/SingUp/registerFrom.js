import Component from '../../../react/Component.js';

class RegisterForm extends Component {
    constructor(to) {
        super(to);
        this.init();
    }

    init() {
        const [email, setEmail] = this.useState('');
        const [username, setUsername] = this.useState('');
        const [password, setPassword] = this.useState('');
        const [Confirmpassword, setConfirmPassword] = this.useState('');
        this.email = email;
        this.setEmail = setEmail;
        this.password = password;
        this.setPassword = setPassword;
        this.username = username;
        this.setUsername = setUsername;
        this.Confirmpassword = Confirmpassword;
        this.setConfirmPassword = setConfirmPassword;
    }

    render() {
        return `
            <form id="register-form">
                <div class="form-group">
                    <input type="email" class="form-control" id="email" placeholder="Email" value="${this.email()}" required>
                </div>
                <div class="form-group">
                    <input type="text" class="form-control" id="username" placeholder="Username" value="${this.email()}" required>
                </div>
                <div class="form-group">
                    <input type="password" class="form-control" id="password" placeholder="Senha" value="${this.password()}" required>
                </div>
                <div class="form-group">
                    <input type="password" class="form-control" id="confirmedPassword" placeholder="Confirme Senha" value="${this.password()}" required>
                </div>
                <button type="submit" class="btn btn-primary btn-block" style="background-color: #00e5ff; border: none;">Login</button>
            </form>
        `;
    }

    mount() {
        const emailInput = document.getElementById('email');
        const username = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const confirmedPassword = document.getElementById('confirmedPassword');

        document.getElementById('register-form').addEventListener('submit', async (e) => {
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

        username.addEventListener('input', (e) => {
            this.setUsername(e.target.value);
        });

        passwordInput.addEventListener('input', (e) => {
            this.setPassword(e.target.value);
        });
        
        confirmedPassword.addEventListener('input', (e) => {
            this.setConfirmPassword(e.target.value);
        })
    }
}

export default RegisterForm;