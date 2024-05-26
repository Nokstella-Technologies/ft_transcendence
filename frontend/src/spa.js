import Login from './pages/Login/index.js';
import PageGame from './pages/PongGame/index.js';

const routes = {
    "/": new Login("#app"),
    "": new Login("#app"),
    "/game": new PageGame("#app"),
    // "/home": Home(),
    // "/game": Game(),
    // "/": Login(),
};


export const render = () => {
    const hash = window.location.pathname;
    if (routes[hash]) { 
        routes[hash].reRender()
    } else {
        routes["/"].reRender()
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Define as rotas da aplicação
    // Definindo um hash padrão se estiver vazio

    // Função para renderizar o conteúdo da rota atual
    // Adiciona o evento de mudança de hash
    window.addEventListener('hashchange', render);

    // Renderiza o conteúdo inicial
    render();
});