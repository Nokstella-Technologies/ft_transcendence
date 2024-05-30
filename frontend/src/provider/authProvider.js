

class AuthProvider {
    constructor() {
        this.authenticated = false;
        
    }

    authenticate(token) {
        // requset com o token
        return true;
    }

    login(username, password) {
        // request com o username e password
        sessionStorage.setItem("token", "token");
        sessionStorage.setItem("user",  {
            
        });
        this.authenticated = true;
    }

    logout() {
        this.authenticated = false;
    }

    isAuthenticated(token) {
        if (token === undefined) {
            token = sessionStorage.getItem("token");
        }
        return  authenticate(token);
    }
}