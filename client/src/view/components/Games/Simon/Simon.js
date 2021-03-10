import './dist/simon.css';
import React, { useState, useEffect } from 'react';

const tone1 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3')
const tone2 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3')
const tone3 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3')
const tone4 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
const buzz = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
const trumpet = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
let combination = []
let clickNum = 0


const Simon = () => {

    const [yellowOpacity, setYellowOpacity] = useState(0.1)
    const [blueOpacity, setBlueOpacity] = useState(0.1)
    const [redOpacity, setRedOpacity] = useState(0.1)
    const [greenOpacity, setGreenOpacity] = useState(0.1)
    const [sound, setSound] = useState(true)
    const [score, setScore] = useState(0)
    const [colors, setColors] = useState(['yellow', 'blue', 'red', 'green'])
    const [game, setGame] = useState(false)
    const [userLoggedIn, setLoggedIn] = useState(false)
    const [highscore, setHighScore] = useState(0)
    const [playerTurn, setPlayerTurn] = useState(false)

    useEffect(() => {
        fetch('/checkCookie')
            .then(r => r.json())
            .then(data => {
                if (data.status === 'authorized') {
                    setLoggedIn(true)
                }
            })
        fetch('/games/simon/geths')
            .then(r => r.json())
            .then(data => {
                console.log('dasdsa')
                console.log(data)
                setHighScore(data.simonHighScore)
            })
    }, [])

    const handleStartSimon = () => {
        // console.log('start game')
        combination = []
        clickNum = 0
        setScore(0)
        setGame(true)
        startSimonRound()
    }
    const startSimonRound = () => {

        let i = 0
        const gameInterval = setInterval(() => {
            i++
            displayCombination(i)
            setPlayerTurn(false)
            if (i > combination.length) {
                clearInterval(gameInterval)
            }
        }, 600);

    }
    const displayCombination = (i) => {

        if (i > combination.length) {
            addRandomColor()
        } else {
            flashBoxSequence(i)
        }
    }
    const addRandomColor = () => {
        const random = Math.floor(Math.random() * 4)
        const chosenColor = colors[random]
        flashBoxPlayerRandom(chosenColor)

        setTimeout(() => {
            combination.push(chosenColor)
            setPlayerTurn(true)
        }, 250);
    }
    const flashBoxSequence = (i) => {
        if (combination[i - 1] == 'yellow') {
            if (sound) tone1.play()
            setYellowOpacity(1)
        } else if (combination[i - 1] == 'blue') {
            if (sound) tone2.play()
            setBlueOpacity(1)
        } else if (combination[i - 1] == 'red') {
            if (sound) tone3.play()
            setRedOpacity(1)
        } else if (combination[i - 1] == 'green') {
            if (sound) tone4.play()
            setGreenOpacity(1)
        } else {
        }
        setTimeout(() => {
            if (combination[i - 1] == 'yellow') {
                setYellowOpacity(0.1)
            } else if (combination[i - 1] == 'blue') {
                setBlueOpacity(0.1)
            } else if (combination[i - 1] == 'red') {
                setRedOpacity(0.1)
            } else if (combination[i - 1] == 'green') {
                setGreenOpacity(0.1)
            } else {
            }
        }, 250);
    }
    const flashBoxPlayerRandom = (color) => {
        if (color == 'yellow') {
            if (sound) tone1.play()
            setYellowOpacity(1)
        } else if (color == 'blue') {
            if (sound) tone2.play()
            setBlueOpacity(1)
        } else if (color == 'red') {
            if (sound) tone3.play()
            setRedOpacity(1)
        } else if (color == 'green') {
            if (sound) tone4.play()
            setGreenOpacity(1)
        }
        setTimeout(() => {
            if (color == 'yellow') {
                setYellowOpacity(0.1)
            } else if (color == 'blue') {
                setBlueOpacity(0.1)
            } else if (color == 'red') {
                setRedOpacity(0.1)
            } else if (color == 'green') {
                setGreenOpacity(0.1)
            }
        }, 250);
    }
    const playersTurn = (colorClicked) => {

        if (playerTurn) {
            flashBoxPlayerRandom(colorClicked)
            if (combination[clickNum] == colorClicked) {
                if (combination.length - 1 === clickNum) {
                    if (userLoggedIn && combination.length > highscore) {
                        setHighScore(combination.length - 1)
                        console.log('NEW HIGHSCORE')
                    } else if (!userLoggedIn && combination.length > highscore) {
                        setHighScore(combination.length)
                    }
                    if (sound) trumpet.play()
                    setPlayerTurn(false)
                    clickNum = 0
                    setScore(combination.length)
                    setTimeout(() => {
                        startSimonRound()
                    }, 1000);
                } else {
                    clickNum++
                }
            } else {
                if (userLoggedIn && combination.length - 1 > highscore) {
                    saveGame(combination.length - 1)
                    setHighScore(combination.length - 1)
                }
                if (sound) trumpet.play()
                setPlayerTurn(false)
                setGame(false)
                combination = []
            }
        }
    }
    const saveGame = (highscore) => {
        fetch("/games/simon/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ highscore }),
        })
    }
    return (<div className='simon__container'>
        <h2 className='simon__title'>Simon</h2>

        {!game ? <button onClick={() => handleStartSimon(setGame, colors, setYellowOpacity, setBlueOpacity, setRedOpacity, setGreenOpacity)} className='simon__start'>Start</button>
            : <button onClick={() => setGame(false)} className='simon__stop'>Reset</button>}

        {game ? <div>{playerTurn ? <div><p>Your Turn</p><h2>Current score: {score}</h2></div> : <div><p>Pay Atenttion</p>
            <h2>Current score: {score}</h2></div>}</div> : null}

        {userLoggedIn ? <div>Your highscore- {highscore}</div> : <div>Your highscore- {highscore}</div>}
        {sound ? <button onClick={() => setSound(!sound)}>sound on</button>
            : <button onClick={() => setSound(!sound)}>sound off</button>
        }
        <div className='simon_boxes'>
            <div style={{ opacity: yellowOpacity }} onClick={() => playersTurn('yellow')} className='boxes_box yellow'>1</div>
            <div style={{ opacity: blueOpacity }} onClick={() => playersTurn('blue')} className='boxes_box blue'>2</div>
            <div style={{ opacity: redOpacity }} onClick={() => playersTurn('red')} className='boxes_box red'>3</div>
            <div style={{ opacity: greenOpacity }} onClick={() => playersTurn('green')} className='boxes_box green'>4</div>
        </div>
    </div>)
}


export default Simon