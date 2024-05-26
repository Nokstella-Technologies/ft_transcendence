import React, { useState } from 'react';
import './friendList.css';

const FriendList = ({ friends }) => {
    const [visible, setVisible] = useState(false);

    const toggleMenu = () => {
        setVisible(!visible);
    };

    return (
        <div>
            <div class="hamburger-menu" onClick={toggleMenu}>
                <img src="https://img.icons8.com/ios-glyphs/30/00ffea/user-group-man-man.png" alt="Amigos" />
            </div>
            {visible && (
                <div class="hamburger-content">
                    <div class="friend-list">
                        {friends.map((friend, index) => (
                            <div key={index} class={`friend ${friend.online ? 'online' : 'offline'}`}>
                                <span class="friend-name">{friend.name}</span>
                                <span class={`friend-status ${friend.online ? 'online' : 'offline'}`}>
                                    {friend.online ? 'Online' : 'Offline'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FriendList;
