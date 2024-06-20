import Component from "../../../react/Component.js";
import authProvider from "../../provider/authProvider.js";
import userProvider from "../../provider/userProvider.js";
import Container from "../containers/index.js";
import Popup from "../popup/popup.js";


export default class ProfileContainer extends Component {
    constructor(to, isEditabled = true) {
        super(to);
        const [showEdit, setShowEdit] = this.useState(false);
        const [show2FA, setShow2FA] = this.useState(false);
        const [showImageEdit, setShowImageEdit] = this.useState(false);
        this.showImageEdit = showImageEdit;
        this.setShowImageEdit = setShowImageEdit;
        this.user = userProvider.get().user;
        this.stats = this.user.stats[0]
        this.showEdit = showEdit;
        this.setShowEdit = setShowEdit;
        this.show2FA = show2FA;
        this.setShow2FA = setShow2FA;
        this.isEditabled = isEditabled;
    }  
   
    render() {
        

        return `
            ${Container({
                title: this.user.username,
                className: "container c-flex",
                children: `
                   <div class="profile-picture-container" >
                        <img src="${this.user.profile_picture}" alt="${this.user.username}" class="rounded-circle img-fluid profile-picture"/>
                        <div class="profile-overlay">
                            <i class="fa fa-pencil-alt"></i>
                        </div>
                    </div>
    
                    <button id="edit-infos" class="btn btn-primary my-2" >Atualizar Informações</button>
                    <div class="form-check form-switch mb-3">
                        <input class="form-check-input" type="checkbox" id="twoFactorAuth" ${this.user.is_auth ? "checked" : ""}>
                        <label class="form-check-label" for="twoFactorAuth">Autenticação de 2 Fatores</label>
                    </div>
                    <div class="text-left">
                        <h5>Estatísticas</h5>
                        <p>Partidas Jogadas: ${this.stats.games_played}</p>
                        <p>Vitórias: ${this.stats.games_won}</p>
                        <p>Derrotas: ${this.stats.games_lost}</p>
                        <p>Vitórias em Torneios: ${this.stats.games_lost}</p>
                    </div>
                    <button class="btn btn-primary my-2" >Ver historico de partidas</button>
                `
            })}
            ${this.showEdit() ? `<div class="popup"></div>` : ''}
            ${this.show2FA() ? `<div class="popup"></div>` : ''}
            ${this.showImageEdit() ? `<div class="popup"></div>` : ''}
        `;
    }

    
    mount() {
        const {token } = authProvider.get();
        document.querySelector('.profile-picture-container').addEventListener('mouseover', () => {
            const overlay = document.querySelector('.profile-overlay');
            overlay.style.display = 'flex';
        })
        document.querySelector('.profile-picture-container').addEventListener('mouseout', () => {
            const overlay = document.querySelector('.profile-overlay');
            overlay.style.display = 'none';
        })
        document.querySelector('.profile-picture-container').addEventListener('click', () => {
            this.setShowImageEdit(true);
        })
        document.querySelector('#edit-infos').addEventListener('click', () => {
            this.setShowEdit(true);
        })
        if (this.showEdit()) {
            const customContent = `
                <form class="profile-update-form">
                    <input type="text" placeholder="Novo Nome de Usuário" id="username" class="form-control mb-2">
                    <input type="password" placeholder="Senha Atual" id="password" class="form-control mb-2">
                    <input type="password" placeholder="Nova Senha" id="newPassword" class="form-control mb-2">
                    <input type="password" placeholder="Confirmar Nova Senha" id="confiNewPassword" class="form-control mb-2">
                    <button class="btn save-button" type="submit" >Salvar</button>
                </form>
            `;
            const popUp = new Popup(".popup", "Edite suas informações:", customContent, this.showEdit(), this.setShowEdit);
            popUp.reRender();
            document.querySelector('profile-update-form').addEventListener('submit', async (event) => {
                try {
                    const username = document.querySelector('#username').value;
                    const password = document.querySelector('#password').value;
                    const newPassword = document.querySelector('#newPassword').value;
                    const confiNewPassword = document.querySelector('#confiNewPassword').value;
                    await userProvider.updateUser(username, password, newPassword, confiNewPassword);
                } catch (err) { 
                    console.log(err);
                }
            })
        }
        else if (this.showImageEdit()) {

            const customContent = `
            <form id="uploadForm" enctype="multipart/form-data">
            <div id="responseMessage" class="mt-3"></div>
            <label for="fileInput">Escolha um arquivo:</label>
            <input type="file" id="fileInput" name="profile_picture"  class="form-control-file" required>
            <button type="submit">Enviar</button>
            </form>
            `;
            const popUp = new Popup(".popup", "Mude sua foto", customContent, this.showImageEdit(), this.setShowImageEdit);
            popUp.reRender();
            const upl = document.querySelector('#uploadForm')
            const responseMessage = document.getElementById('responseMessage');
            upl.addEventListener('submit', async (event) => {
                const formData = new FormData(upl);
                try {
                    const res = await userProvider.updateProfilePicture(token, formData);
                    this.user.profile_picture = res.profile_picture;
                    responseMessage.innerHTML = `
                    <img src="${res.profile_picture}" alt="Profile Picture" class="img-fluid mt-3">
                `;
                } catch (err){
                    responseMessage.innerHTML = `<div class="alert alert-danger">Erro ao enviar: ${err.message}</div>`
                }
            })
        } else if (this.show2FA()) {

        }
    }
}