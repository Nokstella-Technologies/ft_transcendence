class GameProvider {
    constructor() {
        if (GameProvider.instance) {
            return GameProvider.instance;
        }
        this.game = sessionStorage.getItem("game") ? JSON.parse(sessionStorage.getItem("game")) : undefined;
        this.player1 = sessionStorage.getItem("player1") ? JSON.parse(sessionStorage.getItem("player1")) : undefined;
        this.player2 = sessionStorage.getItem("player2") ? JSON.parse(sessionStorage.getItem("player2")) : undefined;
        GameProvider.instance = this;
    }

    get() {
        return {game: this.game, player1: this.player1, player2: this.player2};
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

}


const gameProvider = new GameProvider();
export default gameProvider;