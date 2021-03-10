import './dist/simon.css';
import Icon from '@mdi/react'
import { mdiVolumeOff } from '@mdi/js';
import { mdiVolumeHigh } from '@mdi/js';
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
    const [firstGame, setFirstGame] = useState(false)


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
        if (highscore === 0) {
            setFirstGame(true)
        }
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
    const playAudio = (audio) => {
        if (sound) {
            audio.pause()
            audio.currentTime = 0
            audio.play()
        }
    }
    const flashBoxSequence = (i) => {
        switch (combination[i - 1]) {
            case 'yellow':
                playAudio(tone1)
                setYellowOpacity(0.8)
                break;
            case 'blue':
                playAudio(tone2)
                setBlueOpacity(0.8)
                break;
            case 'green':
                playAudio(tone3)
                setGreenOpacity(0.8)
                break;
            case 'red':
                playAudio(tone4)
                setRedOpacity(0.8)
                break;
        }
        setTimeout(() => {
            switch (combination[i - 1]) {
                case 'yellow':
                    setYellowOpacity(0.1)
                    break;
                case 'blue':
                    setBlueOpacity(0.1)
                    break;
                case 'green':
                    setGreenOpacity(0.1)
                    break;
                case 'red':
                    setRedOpacity(0.1)
                    break;
            }
        }, 250);
    }
    const flashBoxPlayerRandom = (color) => {

        switch (color) {
            case 'yellow':
                playAudio(tone1)
                setYellowOpacity(0.8)
                break;
            case 'blue':
                playAudio(tone2)
                setBlueOpacity(0.8)
                break;
            case 'green':
                playAudio(tone3)
                setGreenOpacity(0.8)
                break;
            case 'red':
                playAudio(tone4)
                setRedOpacity(0.8)
                break;
        }
        setTimeout(() => {
            switch (color) {
                case 'yellow':
                    setYellowOpacity(0.1)
                    break;
                case 'blue':
                    setBlueOpacity(0.1)
                    break;
                case 'green':
                    setGreenOpacity(0.1)
                    break;
                case 'red':
                    setRedOpacity(0.1)
                    break;
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
                    setFirstGame(false)
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
    return (<div className='simon__container container-sm'>
        <div className='simon__topHalf'>

            <div className='simon_settings'>
                <div className='simon__titleBox'>
                    <h2 className='simon__title'>Simon</h2>
                    {sound ? <Icon path={mdiVolumeHigh} size={2} onClick={() => setSound(!sound)} className='simon__soundToggle' />
                        : <Icon path={mdiVolumeOff} size={2} onClick={() => setSound(!sound)} className='simon__soundToggle' />
                    }
                </div>
                <div className='simon__buttons'>
                    {!game ? <button onClick={() => handleStartSimon(setGame, colors, setYellowOpacity, setBlueOpacity, setRedOpacity, setGreenOpacity)} className='simon__start btn btn-primary'>Start</button>
                        : <button onClick={() => setGame(false)} className='simon__stop btn btn-danger'>Reset</button>}
                    <button className='btn btn-primary simon_leaderboard'>Leaderboard</button>
                </div>

            </div>

            <div className='simon__gameInfo'>
                <h2>Stats</h2>
                {game ? <div className='gameinfo1'><div className='gameinfo2'><h2>Current score: {score}</h2></div> </div> : null}

                {!firstGame ? <div> {userLoggedIn ? <div className='simon__highscore'>Highscore:{highscore}</div> : <div className='simon__highscore'>Highscore: {highscore}</div>}</div> : null}

            </div>

        </div>
        <div className='simon__turn'>
            {game ? <div className='simon__turnText'>{playerTurn ? <h2>Your turn</h2> : <h2>Pay attention</h2>}</div> : null}
        </div>

        <div className='simon__boxesContainer'>
            <div className='simon_boxes'>
                <div style={{ opacity: yellowOpacity }} onClick={() => playersTurn('yellow')} className='boxes_box yellow'></div>
                <div style={{ opacity: blueOpacity }} onClick={() => playersTurn('blue')} className='boxes_box blue'></div>
                <div style={{ opacity: redOpacity }} onClick={() => playersTurn('red')} className='boxes_box red'></div>
                <div style={{ opacity: greenOpacity }} onClick={() => playersTurn('green')} className='boxes_box green'></div>

            </div></div>
    </div>
    )
}


export default Simon