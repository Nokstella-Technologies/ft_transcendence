import React from 'react';
import './profileLink.css';

const ProfileLink = ({ username, profilePicture }) => {
  return (
    <div class="profile-link" onClick={() => window.location.href = 'profile.html'}>
      <img src={profilePicture} alt="Perfil" />
      <span>{username}</span>
    </div>
  );
};

export default ProfileLink;
