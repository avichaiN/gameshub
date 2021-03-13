import React, { useState, useEffect } from 'react';
import {
    Link,
} from "react-router-dom";

const Leaderboard = ({ setFromWhichGame, game }) => {

    const [hangmanByPoints, setHangmanSort] = useState(true)

    let whichGame = game
    if (game.game === '') {
        whichGame = 'mainButton'
    }

    // useEffect(() => {
    //     fetch(`/games/leaderboard/${whichGame}`)
    //         .then(r => r.json())
    //         .then(r => {

    //         })
    // }, [])

    return (
        <div>
            <h1>Leaderboard</h1>
            <Link onClick={() => setFromWhichGame('simon')} className='games__leaderboard btn btn-primary simon_leaderboard' to='/leaderboard'>Simon</Link>
            <Link onClick={() => setFromWhichGame('hangman')} className='games__leaderboard btn btn-primary simon_leaderboard' to='/leaderboard'>Hangman</Link>
            {whichGame === 'hangman' ?
                <div>
                    <h1>Hangman</h1>
                    {hangmanByPoints ? <h5 onClick={() => setHangmanSort(!hangmanByPoints)}>By points</h5> : <h5 onClick={() => setHangmanSort(!hangmanByPoints)}>By wins</h5>}
                    <HangmanLeaderBoard hangmanByPoints={hangmanByPoints} />
                </div>
                : null}


            {whichGame === 'simon' ? <div><h1>Simon</h1> <SimonLeaderBoard /></div> : null}
        </div>
    )
}
const HangmanLeaderBoard = ({ hangmanByPoints }) => {
    const [leaders, setLeaders] = useState('')
    let x
    if (hangmanByPoints) {
        x = 'hangmanP'
    } else {
        x = 'hangmanW'
    }
    useEffect(async () => {
        await fetch(`/games/leaderboard/${x}`)
            .then(r => r.json())
            .then(r => {
                console.log(r)
                mapHangmanHighScore(r.hangmanLeaders)
            })
    }, [hangmanByPoints])

    const mapHangmanHighScore = (highScore) => {
        const hangmanMap = highScore.map(user => {
            console.log(user)
            return (<div key={user.username}>
                <h3>Username: {user.username}</h3>
                <h3>Points: {user.hangmanPoints}</h3>
                <h3>Victory's: {user.hangmanW}</h3>
                <h3>Lose's: {user.hangmanL}</h3>
            </div>)
        })
        setLeaders(hangmanMap)
    }

    return (<div>{leaders}</div>)
}
const SimonLeaderBoard = () => {
    const [leaders, setLeaders] = useState('')

    useEffect(async () => {
        await fetch(`/games/leaderboard/simon`)
            .then(r => r.json())
            .then(r => {
                mapSimonHighScore(r.simonHighScore)
            })
    }, [])

    const mapSimonHighScore = (highScore) => {
        const simonMap = highScore.map(user => {
            console.log(user)
            return (<div key={user.username}>
                <h3>Username: {user.username}</h3>
                <h3>Highscore: {user.simonHS}</h3>
            </div>)
        })
        setLeaders(simonMap)
    }

    return (<div>{leaders}</div>)
}
export default Leaderboard