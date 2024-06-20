class GameProvider {
    constructor() {
        if (GameProvider.instance) {
            return GameProvider.instance;
        }
        this.game = sessionStorage.getItem("game") ? JSON.parse(sessionStorage.getItem("game")) : undefined;
        this.player1 = sessionStorage.getItem("player1") ? JSON.parse(sessionStorage.getItem("player1")) : undefined;
        this.player2 = sessionStorage.getItem("player2") ? JSON.parse(sessionStorage.getItem("player2")) : undefined;
        GameProvider.instance = this;
        this.playerSide = sessionStorage.getItem("playerSide") ? JSON.parse(sessionStorage.getItem("playerSide")) : undefined;
    }

    get() {
        return {game: this.game, player1: this.player1, player2: this.player2, side: this.playerSide};
    }

    setGameAi(side) {
        this.game = {
            score_player1: 0,
            score_player2: 0,
            status: "active",
            type: "ai"
        }
        this.playerSide = side;
        sessionStorage.setItem("playerSide", JSON.stringify(side));
        sessionStorage.setItem("game", JSON.stringify(this.game));
    }

    async createGame(token, player1, player2) {
        const res = await fetch('http://localhost:8000/protected/game/start_game/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                player1_id: player1.user_id,
                player2_id: player2.user_id,
                "status": "active",
                "type": "friendly",
            })
        })
        if (res.status === 201) {
            const data = await res.json();
            this.game = data;
            sessionStorage.setItem("game", JSON.stringify(data));
            sessionStorage.setItem("player1", JSON.stringify(player1.user));
            sessionStorage.setItem("player2", JSON.stringify(player2.user));
            this.player1 = player1.user;
            this.player2 = player2.user;
            return data;
        } else 
            throw new Error("Erro ao criar jogo");

    }

    async setGame(token, game_id, player1, player2) {
        const game = await fetch(`http://localhost:8000/protected/game/get_game/${game_id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if (game.status === 200) { 
            const data = await game.json();
            this.game = data;
            sessionStorage.setItem("game", JSON.stringify(data));
            sessionStorage.setItem("player1", JSON.stringify(player1.user));
            sessionStorage.setItem("player2", JSON.stringify(player2.user));
            this.player1 = player1.user;
            this.player2 = player2.user;
            return data;
        } else 
            throw new Error("Erro ao buscar jogo");
    }

    async setScore(token, player) {
        const data = {
            score_player1: this.game.score_player1,
            score_player2: this.game.score_player2,
        }
        if (this.game.score_player1 === 5 || this.game.score_player2 === 5) {
            data.end = true;
            this.game.status = "ended";
            data.winner = this.game.score_player1 === 5 ? this.game.player1_id : this.game.score_player2;
        }
        const score = await fetch(`http://localhost:8000/protected/game/update_game/${this.game.game_id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
        if (score.status === 200) {
            const res = await score.json();
            if (data.end) {
                this.game = res.game
            }
            sessionStorage.setItem("game", JSON.stringify(res.game));
            return res;
        } else 
            throw new Error("Erro ao setar score");
    }
}


const gameProvider = new GameProvider();
export default gameProvider;