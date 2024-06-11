import Component from "../../../react/Component.js";
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
        return `
            <nav id="top_bar" class="navbar navbar-expand navbar-custom"> </nav>
            <h1 class="mt-5">
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
