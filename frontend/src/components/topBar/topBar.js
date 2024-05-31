
import Component from '../../../react/Component.js';

class TopBar extends Component {
    constructor(to, friends, isHome, user) {
        super(to);
        this.isHome = isHome;
        this.friends = friends;
        this.user = user;
    }

    init() {
    
    }

    render() {
        return `
        <a class="nav-link" href="/profile">
            <img src="${this.user.profilePicture}" alt="Profile Picture" class="profile-pic">
            ${this.user.username}
        </a>
        <div class="navbar-nav ml-auto">
            <div class="nav-item dropdown">
                <i class="fas fa-user-friends friends-icon dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton" id="friend_list">
                        ${this.friends.map(friend => `
                        <a class="dropdown-item" href="#">
                        <span class="status-indicator ${friend.status === 'online' ? 'status-online' : 'status-offline'}"></span>
                            ${friend.username}
                        </a>
                         `).join('')}
                    </div>
                </div>
            </div>
        `;  
    }

    mount () {
    }
};

export default TopBar;
