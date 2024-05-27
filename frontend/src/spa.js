import Login from './pages/Login/index.js';
import PageGame from './pages/PongGame/index.js';
import SingUp from './pages/SingUp/index.js';

const routes = {
    "/": new Login("#app"),
    "": new Login("#app"),
    "/game": new PageGame("#app"),
    "/register": new SingUp('#app'),
};  


export const render = () => {
    const path = window.location.pathname;
    console.log("changing page", path)
    if (routes[path]) { 
        routes[path].reRender()
    } else {
        routes["/"].reRender()
    }
    document.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', (event) => {
            event.preventDefault();
            const href = event.currentTarget.getAttribute('href');
            window.history.pushState({}, '', href);
            render();
        });
    });
    window.addEventListener('popstate', render);
};

document.addEventListener('DOMContentLoaded', () => {
    render();
});