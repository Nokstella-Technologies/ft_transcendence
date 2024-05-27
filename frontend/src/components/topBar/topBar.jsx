import React from 'react';
import FriendList from '../friendList/friendList';

const TopBar = ({ friends }) => {
    return (
        <div class="top-bar">
            <FriendList friends={friends} />
        </div>
    );
};

export default TopBar;
