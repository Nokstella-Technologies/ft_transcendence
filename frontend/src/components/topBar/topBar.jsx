import React from 'react';
import FriendList from '../friendList/friendList';

const TopBar = ({ friends }) => {
    return (
        <div className="top-bar">
            <FriendList friends={friends} />
        </div>
    );
};

export default TopBar;
