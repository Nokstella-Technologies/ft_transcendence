import Component from "../../../react/Component.js"
import authProvider from "../../provider/authProvider.js"
import userProvider from "../../provider/userProvider.js"
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
        //console.log(user);
    }

    init(){

    }

    render(){
        return `<div>
                 ${this.isplayer ? `<div>
                                    <div style="float: right;"><img src="https://www.vhv.rs/dpng/d/84-845553_orange-information-icon-png-transparent-png.png" width="50"></div>
                                            <img src="${this.user.profile_picture}" alt="Player Icon" class="player-picture">
                                            <p>${this.user.username}<br>
                                                (Você)</p>
                                            <button class="btn btn-primary btn-block btn-trocar-lado" style="background-color: #00e5ff; border: none;">Trocar Lado</button>
                                            </div>` :
                                    `<div>
                                    <div style="float: right;"></div>
                                    <i class="fa fa-solid fa-brain" alt="AI Icon" class="player-picture"></i>
                                    <p>IA</p>
                                </div>`}
            </div>
        `
    }

    
    
    
    mount(){
        document.querySelector(".btn-trocar-lado").addEventListener("click", () => {
            // Lógica de troca de lado estará no componente pai (VsAI)
        });
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