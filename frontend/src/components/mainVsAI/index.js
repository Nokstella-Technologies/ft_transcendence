import Component from "../../../react/Component.js"
import authProvider from "../../provider/authProvider.js"
import userProvider from "../../provider/userProvider.js"
import Footer from "../footer/index.js"
import ThemeSelector from "../themeSelector/index.js"

class MainVsAI extends Component{
    constructor(to, apperance, isplayer){
        super(to)
        this.init()
        const [customizeSchema, setCustomizeSchema] = this.useState({
            theme: apperance.theme,
            paddleColor: apperance.paddle_color,
            ballColor: apperance.ball_color,
            backgroundColor: apperance.background_color
        }); 
        this.customizeSchema = customizeSchema;
        this.setCustomizeSchema = setCustomizeSchema;
        this.isplayer = isplayer;
        const {user} = userProvider.get();
        this.user = user;
    }

    init(){

    }

    render(){
        return `<div class="player-selection">
                 ${this.isplayer ? `<div class="player-card">
                                    <img src="path/to/player-icon.png" alt="Player Icon" width="80" height="80">
                                    <p>${this.user.username}</p>
                                    <button>Trocar Lado</button>
                                    </div>` :
                                    `<div class="ai-card">
                                    <img src="path/to/ai-icon.png" alt="AI Icon" width="80" height="80">
                                    <p>IA</p>
                                </div>`}
            </div>
            <button id="start-game">Start Game</button>
            ${Footer()}
        `
    }

    
    
    
    mount(){
        /* document.querySelector(".btn").addEventListener("click", () => navigateTo("/vsai"))
        const changeTheme = (new_apperance) =>{
            const {token} = authProvider.get()
            userProvider.setNewApperence(token, new_apperance)
            this.setCustomizeSchema({
                theme: new_apperance.theme,
                paddleColor: new_apperance.paddleColor,
                ballColor: new_apperance.ballColor,
                backgroundColor: new_apperance.backgroundColor
            })
        }
        const themes =  new ThemeSelector('.themes', changeTheme, this.customizeSchema().theme, this.customizeSchema())
        themes.reRender() */
    }

}


export default MainVsAI