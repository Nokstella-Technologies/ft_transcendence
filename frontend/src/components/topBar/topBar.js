
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
        const { user } = userProvider.get();
        this.buttons = false;
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
                        <div class="dropdown-item d-flex justify-content-between align-items-center" id="${friend.id}">
                        <span class="friend-username ml-auto">${friend.friend.username}</span>
                        <span class="status-indicator ${friend.friend.status === 'online' ? 'status-online' : 'status-offline'}"></span>
                        </div>`:
                    ` <div class="dropdown-item d-flex justify-content-between align-items-center">
                        <span class="friend-username">${friend.friend.username}</span>
                        <div class="ml-auto">
                        <button class="btn btn-success btn-sm accept-btn" data-id="${friend.id}" data-friend-id="${friend.friend.user_id}">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-danger btn-sm reject-btn ml-2" data-id="${friend.id}" >
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    </div>`).join('')}
                    </div>
                </div>
            </div>
        `;  
    }

    async mount () {
        const { token } = authProvider.get();
        await userProvider.getFriends(token).then(() => {
            const {friends} = userProvider.get();
            this.setFriends(friends);
        }).catch((err) => {
            this.setFriends([])
        });
        if (this.buttons === false) {
            this.buttons = true;
            const {token} = authProvider.get();
            document.querySelectorAll('.accept-btn').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const id = event.currentTarget.getAttribute('data-id');
                    const friend_id = event.currentTarget.getAttribute('data-friend-id');
                    await userProvider.acceptfriend(token, friend_id, id);
                    this.reRender();
                });
            });
            
            document.querySelectorAll('.reject-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const username = event.currentTarget.getAttribute('data-id');
                    this.reRender();
                });
            });
        }
        
    }
};

export default TopBar;
