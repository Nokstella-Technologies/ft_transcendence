
import Component from '../../../react/Component.js';
import authProvider from '../../provider/authProvider.js';
import userProvider from '../../provider/userProvider.js';

class TopBar extends Component {
    constructor(to, isHome) {
        super(to);
        const [friends, setFriends] = this.useState([])
        this.friends = friends;
        this.setFriends = setFriends;
        this.isHome = isHome;
        const { user} = userProvider.get();
        this.user = user;
    }

    init() {
    
    }

    render() {
        return `
        <a class="nav-link" href="/profile">
            <img src="${this.user.profile_picture}" alt="Profile Picture" class="profile-pic">
            ${this.user.username}
        </a>
        <div class="navbar-nav ml-auto">
            <div class="nav-item dropdown">
                <i class="fas fa-user-friends friends-icon dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton" id="friend_list">
                        ${this.friends().map(friend => friend.status === "accepted" ? `
                        <a class="dropdown-item" href="#">
                        <span class="status-indicator ${friend.friend.status === 'online' ? 'status-online' : 'status-offline'}"></span>
                            ${friend.friend.username}
                        </a>`:
                    ` <div class="dropdown-item">
                    ${friend.friend.username}
                    <button class="btn btn-success btn-sm ml-2 accept-btn" )">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-danger btn-sm ml-2 reject-btn" )">
                        <i class="fas fa-times"></i>
                    </button>
                </div>`).join('')}
                    </div>
                </div>
            </div>
        `;  
    }

    async mount () {
        const { token} = authProvider.get();
        await userProvider.getFriends(token).then(() => {
            const {friends} = userProvider.get();
            this.setFriends(friends);
        }).catch((err) => {
            this.setFriends([])
        });
    }
};

export default TopBar;
