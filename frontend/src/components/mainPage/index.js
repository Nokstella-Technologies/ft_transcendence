import Component from "../../../react/Component.js"
import Footer from "../footer/index.js"
import ThemeSelector from "../themeSelector/index.js"

class MainPage extends Component{
    constructor(to){
        super(to)
        this.init()
        const [customizeSchema, setCustomizeSchema] = this.useState({
            theme: 'original',
            paddleColor: '#fff',
            ballColor: '#fff',
            backgroundColor: '#000'
        });
        this.customizeSchema = customizeSchema;
        this.setCustomizeSchema = setCustomizeSchema;
    }

    init(){

    }

    render(){
        return `
            <h1 class="mt-5">Pong</h1>
            <div class="game-modes d-flex flex-column align-items-center mt-5">
                <button class="btn btn-lg">Modo Solo</button>
                <button class="btn btn-lg mt-3">Modo Desafio</button>
                <button class="btn btn-lg mt-3">Modo Torneio</button>
            </div>
            <p class="mt-3">Escolha um dos temas abaixo:</p>
            <div class="themes d-flex justify-content-center mt-3"> </div>
            ${Footer()}
        `
    }

    
    
    
    mount(){
        const changeTheme = (theme, color) =>{
            this.setCustomizeSchema({
                theme,
                paddleColor: color,
                ballColor: color,
                backgroundColor: '#000'
            })
        }
        const themes =  new ThemeSelector('.themes', changeTheme, this.customizeSchema().theme, this.customizeSchema())
        themes.reRender()
    }

}


export default MainPage