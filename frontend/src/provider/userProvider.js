
class UserProviders {
    constructor() {
        if (UserProviders.instance) {
            return UserProviders.instance;
        }
        this.user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : undefined;
        this.apperance = this.user ? this.user.appearance[0] : {};
        this.stats = this.user ? this.user.stats[0] : {};
        this.friends = sessionStorage.getItem("friends") ? JSON.parse(sessionStorage.getItem("friends")) : [];
        UserProviders.instance = this;
    }


    get() {
        return {user: this.user, apperance: this.apperance, stats: this.stats, friends: this.friends};
    }

    async getUser(token, save = true) {
        const res = await fetch(window.env["API_URL"] + 'protected/user/findById/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
            if (res.status === 200) {
                const data = await res.json();
                if (save) {
                    this.user = data;
                    sessionStorage.setItem("user", JSON.stringify(data));
                    this.apperance = data.appearance[0];
                    this.stats = data.stats[0];
                }
                return data;
            } else {
                throw new Error("Erro ao tentar pegar o usuario");
            }
    }
    async setNewApperence(token, apperance) {
        const res = await fetch(window.env["API_URL"] + `protected/user/update_appearance/${this.user.user_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    theme: apperance.theme,
                    ball_color: apperance.ballColor,
                    paddle_color: apperance.paddleColor,
                    background_color: apperance.backgroundColor
                })
            })
            if (res.status === 200) {
                const data = await res.json();
                this.apperance = data;
                this.user.appearance = data;
                return data;
            } else {
                throw new Error("Erro ao tentar atualizar a aparencia");
        }
    }

    async getFriends(token) {
        const res = await fetch(window.env["API_URL"] + `protected/user/list_friends/${this.user.user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
        })
        if (res.status === 200) {
            const data = await res.json();
            this.friends = data.accepted;
            this.friends = this.friends.concat(data.pending);
            sessionStorage.setItem("friends", JSON.stringify(this.friends));
            return data;
        } else 
            throw new Error("Erro ao tentar pegar os amigos");
    }

    async addFriend(token, friend_id) {
        const res = await fetch(window.env["API_URL"] + `protected/user/add_friend/${this.user.user_id}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    friend_id: friend_id
                })
        })
        if (res.status === 200) {
            const data = await res.json();
            return data;
        } else 
            throw new Error("Erro ao tentar adicionar um amigo");
    }

    async acceptfriend(token, friend_id, id) {
        const res = await fetch(window.env["API_URL"] + `protected/user/accept_friend/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    friend_id: friend_id
                })
            })
            const data = res.json();
            if (res.status === 200) {
                return data;
            } else 
                throw new Error("Erro ao tentar aceitar um amigo");
    }
    async rejectFriend(token, id) {
        const res = await fetch(window.env["API_URL"] + `protected/user/remove_friend/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            const data = res.json();
            if (res.status === 200) {
                return data;
            } else 
                throw new Error("Erro ao tentar rejeitar um amigo");
    }
    async findFriend(token, username) {
        const res = await fetch(window.env["API_URL"] + `protected/user/search_user/?query=${username}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            const data = res.json();
            if (res.status === 200) {
                return data;
            } else 
                throw new Error("Erro ao tentar encontrar um amigo");
    }
}

const userProvider = new UserProviders();
export default userProvider;