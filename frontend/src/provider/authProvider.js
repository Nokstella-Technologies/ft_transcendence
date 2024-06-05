
class AuthProvider {
    constructor() {
        if (AuthProvider.instance) {
            return AuthProvider.instance;
        }
        this.user = {};
        this.authenticated = false;
        this.token = sessionStorage.getItem("token");
        AuthProvider.instance = this;
    }


    get() {
        return {auth: this.authenticated, user: this.user};
    }

    async validate2fa(code, email) {
        const res = await fetch('http://localhost:8000/public/auth/login/code/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: code,
                    email: email
                })
            })
            if (res.status === 200) {
                const data = await res.json();
                if (data["jwt_token"] !== undefined) {
                    sessionStorage.setItem("token", data["jwt_token"]);
                }
                return data;
            } else {
                throw new Error("Erro ao validar 2fa");
            }

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
                if (data["jwt_token"] !== undefined) {
                    sessionStorage.setItem("token", data["jwt_token"]);
                }
                return data;
            } else {
                throw new Error("Erro ao logar");
            }
    }

    async login42(code) {
        const res = await fetch('http://localhost:8000/public/auth/oauth2/authorize/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: code,
            })
        })
        if (res.status === 200) {
            const data = await res.json();
            if (data["jwt_token"] !== undefined) {
                sessionStorage.setItem("token", data["jwt_token"]);
            }
            return data;
        } else {
            console.log(res)
            throw new Error("Erro ao logar com 42");
        }
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

    isAuthenticated(token) {
        if (token === undefined) {
            this.token = sessionStorage.getItem("token");
        }
        if (this.token === null) {
            return false;
        }
        return true;
    }

    async logout() {
        sessionStorage.removeItem("token");
        this.authenticated = false;
    }
}

const authProvider = new AuthProvider();
export default authProvider;