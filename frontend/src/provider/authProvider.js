import { sleep } from "../utils/sleep.js";

class AuthProvider {
    constructor() {
        if (AuthProvider.instance) {
            return AuthProvider.instance;
        }
        this.user = {};
        this.authenticated = false;
        AuthProvider.instance = this;
    }


    get() {
        return {auth: this.authenticated, user: this.user};
    }

    async authenticate(token) {
        // requset com o token para verificar auth
        return true;
    }

    async login(username, password) {
        const res = await fetch('http://localhost:8000/public/auth/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        if (res.status === 200) {
            const data = await res.json();
            sessionStorage.setItem("token", data.token);
            this.authenticated = true;
            return user;
        }
        throw new Error("Erro ao logar");
    }

    async createAccount(username, email, password) {
        const res = await fetch('http://localhost:8000/public/user/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        })
        if (res.status === 201) {
            return res;
        }
        throw new Error("Erro ao criar conta");
    }

    async isAuthenticated(token) {
        if (token === undefined) {
            token = sessionStorage.getItem("token");
        }
        return await authenticate(token);
    }
}

const authProvider = new AuthProvider();
export default authProvider;