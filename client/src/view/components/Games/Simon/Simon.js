import './dist/simon.css';
import React, { useState } from 'react';


const Simon = () => {

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
            <div style={{ opacity: yellowOpacity }} onClick={() => playersTurn('yellow', setGame, colors, setYellowOpacity, setBlueOpacity, setRedOpacity, setGreenOpacity)} className='boxes_box yellow'>1</div>
            <div style={{ opacity: blueOpacity }} onClick={() => playersTurn('blue', setGame, colors, setYellowOpacity, setBlueOpacity, setRedOpacity, setGreenOpacity)} className='boxes_box blue'>2</div>
            <div style={{ opacity: redOpacity }} onClick={() => playersTurn('red', setGame, colors, setYellowOpacity, setBlueOpacity, setRedOpacity, setGreenOpacity)} className='boxes_box red'>3</div>
            <div style={{ opacity: greenOpacity }} onClick={() => playersTurn('green', setGame, colors, setYellowOpacity, setBlueOpacity, setRedOpacity, setGreenOpacity)} className='boxes_box green'>4</div>
        </div>
    </div>)
}
const tone1 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3')
const tone2 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3')
const tone3 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3')
const tone4 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
const buzz = new Audio('https://cdn.rawgit.com/Cu7ious/React.js-based-Simon-Game/master/assets/sounds/buzz.mp3')
const trumpet = new Audio('./audio/cherring.mp3')
let combination = []
let clickNum = 0
let playerTurn = false

const handleStartSimon = (setGame, colors, setYellowOpacity, setBlueOpacity, setRedOpacity, setGreenOpacity) => {
    // console.log('start game')
    combination = []
    clickNum = 0
    setGame(true)
    startSimonRound(colors, setYellowOpacity, setBlueOpacity, setRedOpacity, setGreenOpacity)
}
const startSimonRound = (colors, setYellowOpacity, setBlueOpacity, setRedOpacity, setGreenOpacity) => {
    // console.log('started round')
    // console.log(combination)
    let i = 0
    const gameInterval = setInterval(() => {
        i++
        displayCombination(i, setYellowOpacity, setBlueOpacity, setRedOpacity, setGreenOpacity, colors)
        playerTurn = false
        if (i > combination.length) {
            clearInterval(gameInterval)
            // playersTurn(combination)
        }
    }, 600);

}
const displayCombination = (i, setYellowOpacity, setBlueOpacity, setRedOpacity, setGreenOpacity, colors) => {

    if (i > combination.length) {
        addRandomColor(setYellowOpacity, setBlueOpacity, setRedOpacity, setGreenOpacity, colors)
    } else {
        flashBoxSequence(setYellowOpacity, setBlueOpacity, setRedOpacity, setGreenOpacity, i)
    }
}
const addRandomColor = (setYellowOpacity, setBlueOpacity, setRedOpacity, setGreenOpacity, colors) => {
    const random = Math.floor(Math.random() * 4)
    const chosenColor = colors[random]
    flashBoxPlayerRandom(chosenColor, setYellowOpacity, setBlueOpacity, setRedOpacity, setGreenOpacity)

    setTimeout(() => {
        combination.push(chosenColor)
        playerTurn = true
    }, 250);
}
const flashBoxSequence = (setYellowOpacity, setBlueOpacity, setRedOpacity, setGreenOpacity, i) => {
    if (combination[i - 1] == 'yellow') {
        tone1.play()
        setYellowOpacity(1)
    } else if (combination[i - 1] == 'blue') {
        tone2.play()
        setBlueOpacity(1)
    } else if (combination[i - 1] == 'red') {
        tone3.play()
        setRedOpacity(1)
    } else if (combination[i - 1] == 'green') {
        tone4.play()
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
    }, 400);
}
const flashBoxPlayerRandom = (color, setYellowOpacity, setBlueOpacity, setRedOpacity, setGreenOpacity) => {
    if (color == 'yellow') {
        tone1.play()
        setYellowOpacity(1)
    } else if (color == 'blue') {
        tone2.play()
        setBlueOpacity(1)
    } else if (color == 'red') {
        tone3.play()
        setRedOpacity(1)
    } else if (color == 'green') {
        tone4.play()
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
const playersTurn = (colorClicked, setGame, colors, setYellowOpacity, setBlueOpacity, setRedOpacity, setGreenOpacity) => {

    if (playerTurn) {
        flashBoxPlayerRandom(colorClicked, setYellowOpacity, setBlueOpacity, setRedOpacity, setGreenOpacity)
        if (combination[clickNum] == colorClicked) {
            if (combination.length - 1 === clickNum) {
                trumpet.play()
                playerTurn = false
                clickNum = 0
                setTimeout(() => {
                    startSimonRound(colors, setYellowOpacity, setBlueOpacity, setRedOpacity, setGreenOpacity)

                }, 1000);
            } else {
                clickNum++
            }
        } else {
            trumpet.play()
            console.log('game over')
            playerTurn = false
            setGame(false)
            combination = []
        }
    } else {
        console.log('not ur turn')
    }
}
export default Simon