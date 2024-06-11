class TournamentProvider {
    constructor() {
        if (TournamentProvider.instance) {
            return TournamentProvider.instance;
        }
        this.tournament_id = sessionStorage.getItem("tournament_id");
        if (this.tournament_id !== null) {
            this.tournament_player = JSON.parse(sessionStorage.getItem("tournament_player"));
        } else {
            this.tournament_player = [{token: null}, {token: null}, {token: null}, {token: null},
                {token: null}, {token: null}, {token: null}, {token: null}];
        }
        TournamentProvider.instance = this;
    }

    async feed_tournament(token) {
        const res = await fetch(`http://localhost:8000/protected/tournament/${this.tournament_id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if (res.status === 200) {
            const data = await res.json();
            data.tournament.players.forEach((player, index) => {});
            return data;
        } else 
            throw new Error("Erro ao buscar torneio");
    }

    get() {
        return {tournament_player: this.tournament_player, tournament_id: this.tournament_id};
    }

    async createTournament(token, user) {
        const res = await fetch('http://localhost:8000/protected/tournament/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
        }})
        if (res.status === 201) {
            const data = await res.json();
            this.tournament_player[0] = {token: token, user: user};
            this.tournament_id = data.tournament.id;
            sessionStorage.setItem("tournament_id", data.tournament.id);
            sessionStorage.setItem("tournament_player", JSON.stringify(this.tournament_player));
            return data;
        }else 
            throw new Error("Erro ao criar torneio");
    }

    async addPlayer(id, token, idx) {
        const res = await fetch(`http://localhost:8000/protected/tournament/participants/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }})
        if (res.status === 200) {
            const data = await res.json();
            const player = await fetch(`http://localhost:8000/protected/user/findById/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if (player.status === 200) {
                const playerData = await player.json();
                this.tournament_player[idx] = {token: token, user: playerData};
                sessionStorage.setItem("tournament_player", JSON.stringify(this.tournament_player));
            }
            return data;
        }else 
            throw new Error("Erro ao adicionar jogador");
    }
}


const tournamentProvider = new TournamentProvider();
export default tournamentProvider;