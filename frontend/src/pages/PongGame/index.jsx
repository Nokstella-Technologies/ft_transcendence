import React, {  useEffect, useState } from 'react';
import Music from "../../assets/sounds/music.m4a"
import SoundControl from '../../components/soundControl';
import Game from './game';
import './index.css';

const PageGame = () => {
    const [scoreP1, setScoreP1] = useState(0);
    const [scoreP2, setScoreP2] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    

    const GameOver = () => {
        return (
            <>
                <h1>Game Over</h1>
                {scoreP1 === 5 ? <h1>Player1 Win</h1> : <h1>Player2 Win</h1>}
                <button onClick={() => {
                    setGameOver(false)
                    setScoreP1(0)
                    setScoreP2(0)
                }}>Restart</button>
            </>
        )
    }

    const renderGame = () => {
        return <Game setScoreP1={setScoreP1} setScoreP2={setScoreP2} gameOver={gameOver} />  
    }

    useEffect(() => {
        if (scoreP1 === 5 || scoreP2 === 5) setGameOver(true);
    },[setGameOver, scoreP1, scoreP2])

    return (
        <div className='container-pageGame'>
            <h1>Player1    VS    Player2</h1>
            <h1>{`${scoreP1}`}    -     {`${scoreP2}`}</h1>
            <SoundControl audioSrc={Music}/>
            {gameOver ?  GameOver() :  renderGame()}
           
        </div>
    );
}

export default PageGame;