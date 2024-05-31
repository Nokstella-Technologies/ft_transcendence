import Component from "../../../react/Component";
import Popup from "../popup/popup";


export default class ProfileContainer extends Component {
    constructor(to, user) {
        const [showEdit, setShowEdit] = this.useState(false);
        this.user = user;
        this.to = to;
        this.showEdit = showEdit;
        this.setShowEdit = setShowEdit;
        this.isEditabled = isEditabled;

        
    }  
   
    render() {
        

        return `
            <div class="profile-container">
                <h2>Gerenciamento de Perfil</h2>
                <img src="${this.user.profilePicture}" alt="Foto de Perfil">
                <h3>${this.user.username}</h3>
                <button class="btn btn-primary" onclick="component.togglePopup()">Editar Perfil</button>
                <div class="switch">
                    <input type="checkbox" id="twoFactorAuth">
                    <label for="twoFactorAuth">Autenticação de 2 Fatores</label>
                </div>
                <div class="stats">
                    <h3>Estatísticas</h3>
                    <p>Partidas Jogadas: ${this.user.gamesPlayed}</p>
                    <p>Vitórias: ${this.user.wins}</p>
                    <p>Derrotas: ${this.user.losses}</p>
                    <p>Vitórias em Torneios: ${this.user.tournamentWins}</p>
                </div>
                <div class="history">
                    <h3>Histórico</h3>
                    ${this.user.history.map(game => `<p>${game}</p>`).join('')}
                </div>
            </div>
            ${this.showEdit() ? `<div class="popup"> </div>` : ''}
        `;
    }

    mount() {
        const customContent = `
            <div class="profile-update-form">
                <input type="text" placeholder="Novo Nome de Usuário" class="form-control mb-2">
                <input type="password" placeholder="Senha Atual" class="form-control mb-2">
                <input type="password" placeholder="Nova Senha" class="form-control mb-2">
                <input type="password" placeholder="Confirmar Nova Senha" class="form-control mb-2">
                <button class="btn save-button" onclick="component.togglePopup()">Salvar</button>
                <button class="btn save-button" onclick="component.togglePopup()">Cancelar</button>
            </div>
        `;
        const popUp = new Popup(".popup", "Escolha a cor da raquete:", customContent, this.showEdit(), this.setShowEdit);
        popUp.reRender();
        if (this.showEdit()) {
            
        }
    }
}