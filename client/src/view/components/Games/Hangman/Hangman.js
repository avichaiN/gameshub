import './dist/hangman.css';
import React, { useState, useEffect } from 'react';
import HangmanAdmin from './HangmanAdmin'
import {
    Link,
} from "react-router-dom";

import img6 from './img/6.png'
import img5 from './img/5.png'
import img4 from './img/4.png'
import img3 from './img/3.png'
import img2 from './img/2.png'
import img1 from './img/1.png'
import img0 from './img/0.png'
const imgs = [img0, img1, img2, img3, img4, img5, img6]
let hangmanWords

const Hangman = ({ setFromWhichGame, setLoggedIn, loggedIn }) => {

    const [finishMsg, setFinish] = useState('')
    const [onTime, setOnTime] = useState(false)
    const [timer, setTimer] = useState()
    const [hintButton, setHintButton] = useState('')
    const [strikesDom, setStrikesDom] = useState('')
    const [hangmanImg, setHangmanImg] = useState(img6)
    const [newGame, setNewGameButton] = useState(true)
    const [hiddenWord, setHiddenWord] = useState('')
    const [letters, setLetters] = useState('')
    const [isAdmin, setAdmin] = useState(false)
    const [allWords, setAllWords] = useState('')
    const [gameOver, setGameOver] = useState(false)
    const [pointsAmount, setPoints] = useState(0)
    const [victorysAmount, setVictorys] = useState(0)
    const [losesAmount, setLoses] = useState(0)

    useEffect(() => {
        fetch('/auth')
            .then(r => r.json())
            .then(r => {
                if (r.admin === true) {
                    setAdmin(true)
                    setLoggedIn(true)
                    setPoints(r.user.hangmanPoints)
                    setVictorys(r.user.hangmanW)
                    setLoses(r.user.hangmanL)
                } else if (r.user === true) {
                    setLoggedIn(true)
                    setPoints(r.user.hangmanPoints)
                    setVictorys(r.user.hangmanW)
                    setLoses(r.user.hangmanL)
                }
            })
        fetch("/games/hangman")
            .then(r => r.json())
            .then(data => (
                hangmanWords = data.hangmanWords
            ))
    }, [])

    return (
        <div className="wrapper">

            {newGame ?
                <div>
                    < button id="newGame" onClick={() => handleNewGameTimer(setStrikesDom, setHangmanImg, setNewGameButton, setHiddenWord, setLetters, setHintButton, setGameOver, setFinish, setPoints, setVictorys, setLoses, setOnTime, timer, setTimer)}>Start game with timer(Extra points)</button>
                    < button id="newGame" onClick={() => handleNewGameUnlimated(setStrikesDom, setHangmanImg, setNewGameButton, setHiddenWord, setLetters, setHintButton, setGameOver, setFinish, setPoints, setVictorys, setLoses, setOnTime, false)}>Start Game with unlimated time</button>
                    <Link onClick={() => setFromWhichGame('hangman')} className='games__leaderboard btn btn-primary hangman_leaderboard' to='/leaderboard'>Leaderboard</Link>

                </div>
                :
                <Link onClick={() => setFromWhichGame('hangman')} className='games__leaderboard btn btn-primary hangman_leaderboard' to='/leaderboard'>Leaderboard</Link>

            }
            <div>
                <div>
                    {loggedIn ?
                        <div>
                            <h4>Hangman</h4>
                            <p>
                                Points - {pointsAmount}
                            </p>
                            <p>
                                Victory's - {victorysAmount}
                            </p>
                            <p>
                                Loses - {losesAmount}
                            </p>
                        </div>
                        :
                        <div>
                            <h4>Hangman</h4>
                            <p>{finishMsg}</p>
                                Log-in to keep track of your games!
                                </div>
                    }
                </div>
                <p>Win with timer = +3 points<br />Win = +2 points<br />Lose = -1 point</p>
            </div>

            {
                gameOver ?
                    null
                    :

                    <div>
                        <div className="gameInfo">
                            <div id="strikes">{strikesDom}</div>
                            <div id="toot">{hiddenWord}</div>
                            {onTime ? <div>{timer}</div> : null}
                            <p>{hintButton}</p>
                        </div>

                        <div className="lowerWrapper">
                            <div id="hangman">
                                <img src={hangmanImg} />
                            </div>
                            <div className="letters">
                                <div id="letters">{letters}</div>
                            </div>
                        </div>
                    </div>
            }

            {
                isAdmin ?
                    <HangmanAdmin allWords={allWords} setAllWords={setAllWords} />
                    :
                    null
            }
        </div >
    )
}

const lettersArray = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"]
let strikes = 6
let counter = 0
let timerInterval

const handleNewGameTimer = async (setStrikesDom, setHangmanImg, setNewGameButton, setHiddenWord, setLetters, setHintButton, setGameOver, setFinish, setPoints, setVictorys, setLoses, setOnTime, timer, setTimer) => {
    setGameOver(false)
    setTimer('')
    setOnTime(true)
    strikes = 6
    const onTime = true

    let twoMinutes = 60 * 2
    startTimer(twoMinutes, setTimer);
    const chosenWord = hangmanWords[Math.floor(Math.random() * hangmanWords.length)].word
    setStrikesDom(`You have ${strikes} strikes left.`)
    setHangmanImg(imgs[strikes])
    setNewGameButton(false)
    createHiddenWord(onTime, setLetters, setStrikesDom, setNewGameButton, setHangmanImg, chosenWord, setHiddenWord, setHintButton, setGameOver, setFinish, setPoints, setVictorys, setLoses)

    function startTimer(duration, setTimer) {
        let timer = duration, minutes, seconds;
        timerInterval = setInterval(async () => {

            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            setTimer(minutes + ":" + seconds)

            if (--timer < 0) {
                clearInterval(timerInterval);
                setOnTime(false)
                setTimer('')
                setFinish(<div><p>Time is up!</p><p>You Lost!</p></div>)
                setGameOver(true)
                setLetters('')
                setHiddenWord('')
                setStrikesDom('')
                setHangmanImg(img6)
                setNewGameButton(true)
                await saveScore('lose', setPoints, setVictorys, setLoses)
            }
        }, 1000);
    }
}
async function handleNewGameUnlimated(setStrikesDom, setHangmanImg, setNewGameButton, setHiddenWord, setLetters, setHintButton, setGameOver, setFinish, setPoints, setVictorys, setLoses, setOnTime, onTime) {
    setOnTime(false)
    setGameOver(false)
    const hintLetter = []
    const chosenWord = hangmanWords[Math.floor(Math.random() * hangmanWords.length)].word

    strikes = 6
    setStrikesDom(`You have ${strikes} strikes left.`)
    setHangmanImg(imgs[strikes])
    setNewGameButton(false)

    createHiddenWord(onTime, setLetters, setStrikesDom, setNewGameButton, setHangmanImg, chosenWord, setHiddenWord, setHintButton, setGameOver, setFinish, setPoints, setVictorys, setLoses, hintLetter)

}

const createHiddenWord = (onTime, setLetters, setStrikesDom, setNewGameButton, setHangmanImg, chosenWord, setHiddenWord, setHintButton, setGameOver, setFinish, setPoints, setVictorys, setLoses, hintLetter) => {
    let chosenWordArray = []

    for (let i = 0; i < chosenWord.length; i++) {
        if (chosenWord.charAt(i) != " ") {
            chosenWordArray.push("_")
        } else {
            chosenWordArray.push("-")
        }
    }

    let html = ""
    chosenWordArray.forEach(letter => {
        html += ` ${letter} `
    })

    setHiddenWord(html)
    renderLetters(onTime, setLetters, setStrikesDom, setHiddenWord, setNewGameButton, setHangmanImg, chosenWord, chosenWordArray, setHintButton, setGameOver, setFinish, setPoints, setVictorys, setLoses, hintLetter)
}

const renderLetters = (onTime, setLetters, setStrikesDom, setHiddenWord, setNewGameButton, setHangmanImg, chosenWord, chosenWordArray, setHintButton, setGameOver, setFinish, setPoints, setVictorys, setLoses, hintLetter) => {
    const lettersMap = lettersArray.map(letter => {
        return (<button id="buttonLetter" key={letter} data-letter={letter} onClick={handleLetterClick(onTime, setStrikesDom, setHiddenWord, setLetters, setNewGameButton, setHangmanImg, chosenWord, chosenWordArray, setHintButton, setGameOver, setFinish, setPoints, setVictorys, setLoses, hintLetter)} style={{ gridArea: letter }}>{letter}</button >)
    })
    setLetters(lettersMap)
}

const handleLetterClick = (onTime, setStrikesDom, setHiddenWord, setLetters, setNewGameButton, setHangmanImg, chosenWord, chosenWordArray, setHintButton, setGameOver, setFinish, setPoints, setVictorys, setLoses, hintLetter) => e => {
    checkIfLetterFound(chosenWord, chosenWordArray, setHintButton, hintLetter, e)
    updateHiddenWord(chosenWord, chosenWordArray, setHiddenWord, setHintButton)
    updateImg(chosenWordArray, setStrikesDom, setHangmanImg)
    checkLose(strikes, setLetters, setHiddenWord, setStrikesDom, setNewGameButton, setGameOver, setFinish, setPoints, setVictorys, setLoses, setHangmanImg)
    checkVictory(onTime, chosenWordArray, setLetters, setStrikesDom, setHiddenWord, setNewGameButton, setGameOver, setFinish, setPoints, setVictorys, setLoses, setHangmanImg)
}
const checkIfLetterFound = (chosenWord, chosenWordArray, setHintButton, hintLetter, e) => {
    counter = 0
    const clickedLetter = e.target.dataset.letter


    const regLetter = new RegExp(clickedLetter, 'i')
    e.target.style.pointerEvents = "none"
    let foundLetter = false

    for (let i = 0; i < chosenWordArray.length; i++) {

        if (regLetter.test(chosenWord[i])) {
            foundLetter = true
            e.target.style.backgroundColor = "green"
            chosenWordArray.splice(i, 1, `${clickedLetter}`)
        } else if (!foundLetter) {
            e.target.style.backgroundColor = "red"
            counter++
        }
    }
}

const updateHiddenWord = (chosenWord, chosenWordArray, setHiddenWord, setHintButton) => {
    let html = ""
    chosenWordArray.forEach(letter => {
        html += ` ${letter} `
    })
    setHiddenWord(html)
}

const updateImg = (chosenWordArray, setStrikesDom, setHangmanImg) => {
    if (counter == chosenWordArray.length) {
        strikes--
        setStrikesDom(`You have ${strikes} strikes left.`)
        setHangmanImg(imgs[strikes])
    } else {
        counter = 0
    }
}

const checkLose = async (strikes, setLetters, setHiddenWord, setStrikesDom, setNewGameButton, setGameOver, setFinish, setPoints, setVictorys, setLoses, setHangmanImg) => {
    if (strikes == 0) {
        clearInterval(timerInterval);
        setFinish('You lost!')
        setGameOver(true)
        setLetters('')
        setHiddenWord('')
        setStrikesDom('')
        setHangmanImg(img6)
        setNewGameButton(true)
        await saveScore('lose', false, setPoints, setVictorys, setLoses)
    }
}
const checkVictory = async (onTime, chosenWordArray, setLetters, setStrikesDom, setHiddenWord, setNewGameButton, setGameOver, setFinish, setPoints, setVictorys, setLoses, setHangmanImg) => {
    let victoryCondition = chosenWordArray.length
    chosenWordArray.forEach(letter => {
        if (letter != "_") {
            victoryCondition--
        }
    })
    if (victoryCondition == 0) {
        console.log(onTime)

        clearInterval(timerInterval);
        setGameOver(true)
        setFinish('Victory!')
        setLetters('')
        setStrikesDom('')
        setHiddenWord('')
        setHangmanImg(img6)
        setNewGameButton(true)
        await saveScore('win', onTime, setPoints, setVictorys, setLoses)
    }
}
const saveScore = async (winlose, onTime, setPoints, setVictorys, setLoses) => {
    await fetch("/games/hangman", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ winlose, onTime }),
    })
        .then((res) => res.json())
        .then(async (data) => {
            console.log(data)
            if (data.addedScore === true) {
                setVictorys(data.newWinScore)
                setLoses(data.newLoseScore)
                setPoints(data.newScore)
            } else {
                setVictorys('NULL')
                setLoses('NULL')
                setPoints('NULL')
            }
        })
}
export default Hangman