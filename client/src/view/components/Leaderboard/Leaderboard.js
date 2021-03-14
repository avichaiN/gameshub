import './dist/leaderboard.css';
import React, { useState, useEffect } from 'react';
import {
    NavLink,
} from "react-router-dom";

const Leaderboard = ({ setFromWhichGame, game, setLoggedIn }) => {

    useEffect(() => {
        fetch('/checkCookie')
            .then(r => r.json())
            .then(data => {
                if (data.status === 'authorized') {
                    setLoggedIn(true)
                }
            })
    }, [])
    const [hangmanByPoints, setHangmanSort] = useState(true)
    let whichGame = game
    if (game.game === '') {
        whichGame = 'mainButton'
    }

    return (
        <div className='bg-dark leaderboard__container'>
            <h1 className='leaderboard__title mt-1 bg-dark'>Leaderboard</h1>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark navBarFather">
                <div className="container-fluid">
                    <div className="navbar-expand navbarContainer">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 navbarContent">
                            <li className="nav-item">
                                <NavLink onClick={() => setFromWhichGame('simon')} to='/leaderboard' exact className='nav-link'>Simon</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink onClick={() => setFromWhichGame('hangman')} to='/leaderboard' exact className='nav-link'>Hangman</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            {whichGame === 'hangman' ?
                <div className='leaderboard__hangman table-responsive'>
                    <h1 className='leaderboard__gameTitle mt-1'>Top Hangman players</h1>
                    {hangmanByPoints ? <h5 className='light sortHangman' onClick={() => setHangmanSort(!hangmanByPoints)}>Click me to sort by Victory's</h5> : <h5 className='light sortHangman' onClick={() => setHangmanSort(!hangmanByPoints)}>Click me to sort by Points</h5>}
                    {hangmanByPoints ? <h6 className='light whichSort'>Sorted by Points</h6> : <h6 className='light whichSort'>Sorted by Victory's</h6>}
                    <HangmanLeaderBoard hangmanByPoints={hangmanByPoints} />
                </div>
                : null}


            {whichGame === 'simon' ? <div className='leaderboard__simon'><h1 className='leaderboard__gameTitle mt-1'>Top Simon players</h1> <SimonLeaderBoard /></div> : null}
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
                mapHangmanHighScore(r.hangmanLeaders)
            })
    }, [hangmanByPoints])

    let i = 0
    const mapHangmanHighScore = (highScore) => {
        const hangmanMap = highScore.map(user => {
            i++
            return (
                <tr className='table-dark' key={user.username}>
                    <th scope="col">{i}</th>
                    <th scope="col">{user.username}</th>
                    <th scope="col">{user.hangmanPoints}</th>
                    <th scope="col">{user.hangmanW}</th>
                    <th scope="col">{user.hangmanL}</th>
                </tr>
            )
        })
        setLeaders(
            <table className="table table-dark table-hover">
                <thead>
                    <tr className='table-dark'>
                        <th scope="col">#</th>
                        <th scope="col">Username</th>
                        <th scope="col">Points</th>
                        <th scope="col">Victory's</th>
                        <th scope="col">Loses</th>
                    </tr>
                </thead>
                <tbody>
                    {hangmanMap}
                </tbody>
            </table>
        )
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
        let i = 0
        const simonMap = highScore.map(user => {
            i++
            return (
                <tr className='table-dark' key={user.username}>
                    <th scope="col">{i}</th>
                    <th scope="col">{user.username}</th>
                    <th scope="col">{user.simonHS}</th>
                </tr>
            )
        })
        setLeaders(simonMap)
    }

    return (<table className="table table-dark table-hover">
        <thead>
            <tr className='table-dark'>
                <th scope="col">#</th>
                <th scope="col">Username</th>
                <th scope="col">Level</th>
            </tr>
        </thead>
        <tbody>
            {leaders}
        </tbody>
    </table>)
}
export default Leaderboard