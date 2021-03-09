import './dist/simon.css';
import React, { useState } from 'react';


const Simon = () => {
    const tone1 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3')
    const tone2 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3')
    const tone3 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3')
    const tone4 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
    const buzz = new Audio('https://cdn.rawgit.com/Cu7ious/React.js-based-Simon-Game/master/assets/sounds/buzz.mp3')
    const trumpet = new Audio('https://cdn.rawgit.com/Cu7ious/React.js-based-Simon-Game/master/assets/sounds/trumpet.mp3')
    
    const [yellowOpacity, setYellowOpacity] = useState(0.1)
    const [blueOpacity, setBlueOpacity] = useState(0.1)
    const [redOpacity, setRedOpacity] = useState(0.1)
    const [greenOpacity, setGreenOpacity] = useState(0.1)
    const [colors, setColors] = useState(['yellow', 'blue', 'red', 'green'])
    const [game, setGame] = useState(false)

    return (<div className='simon__container'>
        <h2 className='simon__title'>Simon</h2>

        {!game ? <button onClick={() => handleStartSimon(setGame, colors, setYellowOpacity, setBlueOpacity, setRedOpacity, setGreenOpacity)} className='simon__start'>Start</button>
            : null}
        <div className='simon_boxes'>
            <div style={{ opacity: yellowOpacity }} onClick={() => playersTurn('yellow')} className='boxes_box yellow'>1</div>
            <div style={{ opacity: blueOpacity }} onClick={() => playersTurn('blue')} className='boxes_box blue'>2</div>
            <div style={{ opacity: redOpacity }} onClick={() => playersTurn('red')} className='boxes_box red'>3</div>
            <div style={{ opacity: greenOpacity }} onClick={() => playersTurn('green')} className='boxes_box green'>4</div>
        </div>
    </div>)
}
let combination = []
let clickNum = 0
let playerTurn = false

const handleStartSimon = (setGame, colors, setYellowOpacity, setBlueOpacity, setRedOpacity, setGreenOpacity) => {
    console.log('start game')
    setGame(true)
    combination = []
    startSimon(colors, setYellowOpacity, setBlueOpacity, setRedOpacity, setGreenOpacity)
}
const startSimon = (colors, setYellowOpacity, setBlueOpacity, setRedOpacity, setGreenOpacity) => {
    console.log('started round')

    let i = 0
    const gameInterval = setInterval(() => {
        i++
        startFlashingBoxes(i)
        if (i > combination.length) {
            clearInterval(gameInterval)
            // playersTurn(combination)
        }
    }, 600);

    const startFlashingBoxes = (i) => {
        displayCombination(i)
    }
    const displayCombination = (i) => {
        playerTurn = false
        if (i > combination.length) {
            addRandomColor()
        } else {
            if (combination[i - 1] == 'yellow') {
                setYellowOpacity(1)
            } else if (combination[i - 1] == 'blue') {
                setBlueOpacity(1)
            } else if (combination[i - 1] == 'red') {
                setRedOpacity(1)
            } else if (combination[i - 1] == 'green') {
                setGreenOpacity(1)
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
                }
            }, 400);
        }
    }
    const addRandomColor = () => {
        const random = Math.floor(Math.random() * 4)
        const chosenColor = colors[random]
        console.log(chosenColor)

        if (chosenColor == 'yellow') {
            setYellowOpacity(1)
        } else if (chosenColor == 'blue') {
            setBlueOpacity(1)
        } else if (chosenColor == 'red') {
            setRedOpacity(1)
        } else if (chosenColor == 'green') {
            setGreenOpacity(1)
        }
        setTimeout(() => {
            if (chosenColor == 'yellow') {
                setYellowOpacity(0.1)
            } else if (chosenColor == 'blue') {
                setBlueOpacity(0.1)
            } else if (chosenColor == 'red') {
                setRedOpacity(0.1)
            } else if (chosenColor == 'green') {
                setGreenOpacity(0.1)
            }

            combination.push(chosenColor)
            playerTurn = true
        }, 400);
    }
}
const playersTurn = (colorClicked) => {

    if (playerTurn) {
        if (combination[clickNum] == colorClicked) {
            console.log('CORRECTa')
            clickNum++
            if (combination.length === clickNum) {
                console.log('next round')
                clickNum = 0
            }

        } else {
            console.log('YOU LOST!')
            clickNum = 0
        }
    } else {
        console.log('NOT UR TURN')
    }
}
export default Simon