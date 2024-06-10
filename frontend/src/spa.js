import Home from './pages/Home/index.js';
import Loading from './pages/Loading/index.js';
import Login from './pages/Login/index.js';
import PageGame from './pages/PongGame/index.js';
import SingUp from './pages/SingUp/index.js';
import authProvider from './provider/authProvider.js';
import VsAI from './pages/VsAI/index.js';

async function route(path) {
    const routes = {
        "/": new Login("#app"),
        "": new Login("#app"),
        "/game": new PageGame("#app"),
        "/register": new SingUp('#app'),
        "/home": new Home("#app"),
        "/vsai": new VsAI("#app"),
    }
    if (path === "" || path === "/" || path === "/register")  {
        return routes[path]
    }
    return await securityRoutes(routes[path])
}

async function securityRoutes(componet) {
    const loading = new Loading("#app");
    loading.reRender();
    const res = await authProvider.isAuthenticated()
    if (res) {
        return componet
    } else {
        window.history.pushState({}, '', '/'); 
        return new Login("#app")
    }
}

 const render = async () => {
    const path = window.location.pathname;
    console.log("changing page", path)
    let component = await route(path)
    if (component === undefined) {
        window.history.pushState({}, '', '/'); 
        component = route("/")
    }
    component.reRender();
    document.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', (event) => {
            event.preventDefault();
            const href = event.currentTarget.getAttribute('href');
            window.history.pushState({}, '', href);
            render();
        });
    });
};

const navigateTo = (url) => {
    if (window.location.pathname !== url) {
        window.history.pushState({}, '', url);
        render();
    }
};

window.navigateTo = navigateTo;

document.addEventListener('DOMContentLoaded', () => {
    render();
    window.addEventListener('popstate', render);
    window.addEventListener('beforeunload', async () => {
        const token = authProvider.get().token;
        if (token === undefined) {
            return
        }
       authProvider.changeStatus("offline")
    });
});