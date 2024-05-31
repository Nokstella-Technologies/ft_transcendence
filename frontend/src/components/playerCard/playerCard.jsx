import React from 'react';

const PlayerCard = ({ player, place }) => {
    return (
        <div class={`place ${place}`}>
            <img src={player.image} alt={player.name} />
            <p>{player.name}</p>
        </div>
    );
};

export default PlayerCard;

