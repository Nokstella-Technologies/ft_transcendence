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
        // request com o username e password para criar token
        console.log(username, password);
        if (username !== "test@test" && password !== "test") {
            throw new Error("Usuário ou senha inválidos");
        }
        const user = {
            user_id: "test" ,
            username: username,
            email: "luizlcezario@gmail.com",
            is_auth: false ,
            profile_picture: "https://img.icons8.com/ios-glyphs/30/00ffea/user",
            status: "active",
        }
        sessionStorage.setItem("token", "token");
        sessionStorage.setItem("user",  JSON.stringify(user));
        this.user = user;
        this.authenticated = true;
        return user;
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