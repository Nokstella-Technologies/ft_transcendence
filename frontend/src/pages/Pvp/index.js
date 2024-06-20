import Component from "../../../react/Component.js";
import Container from "../../components/containers/index.js";
import Footer from "../../components/footer/index.js";
import TopBar from "../../components/topBar/topBar.js";
import authProvider from "../../provider/authProvider.js";
import userProvider from "../../provider/userProvider.js";


export default class PvPage extends Component {
    constructor(to) {
        super(to);
        this.init();
    }
    init() { 
        
    }

    render () {
        const {user} = userProvider.get();
        return `
        <nav id="top_bar" class="navbar navbar-expand navbar-custom"> </nav>
        <div class="page">
        ${Container({
            title: "Duelo",
            className: "container vertical-center grid-container",
            children : `
            <div class="row">
                ${Container({
                    title: "",
                    className: `col`,
                    children: `
                    <div class="pvp-item grid-item" style="width: 18rem;">
                        <img src="${user.profile_picture}" class="card-img-top" alt="foto">
                        <h5 class="card-title">${user.username}</h5>
                    </div>
                    `
                })}
                ${Container({
                    title: "",
                    className: `col`,
                    children: `
                        <div class="grid-item-pvp ${"logar_container"}" >
                            <i class="fas fa-regular fa-plus"></i>
                            <h5 class="card-title">Logar player </h5>
                        </div>
                    `
                })}
            </div>
            <div class="row">
                <button id="start-game" class="btn btn-primary btn-block" style="background-color: #00e5ff; border: none; margin-top:20px;">Start Game</button>
            </div>
            `
        })}
        ${Footer()}
        `
    }
    async mount () {
        const {_, token} = authProvider.get()
        await userProvider.getUser(token).catch((err) => {
            console.log(err)
            authProvider.logout();
            return navigateTo('/')
        }); 
        
        const topBar = new TopBar('#top_bar', false);
        topBar.reRender();
    }
}
