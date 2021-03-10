import './dist/hangman.css';
import React, { useState, useEffect } from 'react';
import HangmanAdmin from './HangmanAdmin'
import img6 from './img/6.png'
import img5 from './img/5.png'
import img4 from './img/4.png'
import img3 from './img/3.png'
import img2 from './img/2.png'
import img1 from './img/1.png'
import img0 from './img/0.png'
const imgs = [img0, img1, img2, img3, img4, img5, img6]
let hangmanWords
const Hangman = () => {
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
    const [isLoggedIn, setLoggedIn] = useState(false)
    const [victorysAmount, setVictorys] = useState(0)
    const [losesAmount, setLoses] = useState(0)

    useEffect(() => {
        fetch('/auth')
            .then(r => r.json())
            .then(r => {
                if (r.admin === true) {
                    setAdmin(true)
                    setLoggedIn(true)
                } else if (r.user === true) {
                    setLoggedIn(true)
                }
            })
    }, [])
    useEffect(() => {
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
                    < button id="newGame" onClick={() => handleNewGameTimer(setStrikesDom, setHangmanImg, setNewGameButton, setHiddenWord, setLetters, setHintButton, setGameOver, setFinish, setVictorys, setLoses, setOnTime, timer, setTimer)}>Start game with timer.(Extra points)</button>
                    < button id="newGame" onClick={() => handleNewGameUnlimated(setStrikesDom, setHangmanImg, setNewGameButton, setHiddenWord, setLetters, setHintButton, setGameOver, setFinish, setVictorys, setLoses, setOnTime)}>Start Game with unlimated time.</button>
                </div>
                :
                null
            }

            {
                gameOver ?
                    < div >
                        {isLoggedIn ?
                            <div>
                                <h4>Hangman</h4>
                                <div>{finishMsg}</div>
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
                                Log-in to keep track of your games!</div>
                        }
                    </div>
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

// const getRandomWord = async () => {
//     console.log('top')
//     let randomWord = ''
//     await fetch("/games/hangman")
//         .then(r => r.json())
//         .then(data => (
//             randomWord = data.randomWord.word
//         ))
//     console.log('bottom')
//     return randomWord
// }
const handleNewGameTimer = async (setStrikesDom, setHangmanImg, setNewGameButton, setHiddenWord, setLetters, setHintButton, setGameOver, setFinish, setVictorys, setLoses, setOnTime, timer, setTimer) => {
    console.log('timer new game')
    setGameOver(false)
    setTimer('')
    const chosenWord = hangmanWords[Math.floor(Math.random() * hangmanWords.length)].word
    setOnTime(true)

    let twoMinutes = 60 * 2
    startTimer(twoMinutes, setTimer);

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
                await saveScore('lose', setVictorys, setLoses)
            }
        }, 1000);
    }

    strikes = 6
    setStrikesDom(`You have ${strikes} strikes left.`)
    setHangmanImg(imgs[strikes])
    setNewGameButton(false)
    createHiddenWord(setLetters, setStrikesDom, setNewGameButton, setHangmanImg, chosenWord, setHiddenWord, setHintButton, setGameOver, setFinish, setVictorys, setLoses)
}
async function handleNewGameUnlimated(setStrikesDom, setHangmanImg, setNewGameButton, setHiddenWord, setLetters, setHintButton, setGameOver, setFinish, setVictorys, setLoses, setOnTime) {
    setOnTime(false)
    setGameOver(false)
    const hintLetter = []
    const chosenWord = hangmanWords[Math.floor(Math.random() * hangmanWords.length)].word

    strikes = 6
    setStrikesDom(`You have ${strikes} strikes left.`)
    setHangmanImg(imgs[strikes])
    setNewGameButton(false)

    createHiddenWord(setLetters, setStrikesDom, setNewGameButton, setHangmanImg, chosenWord, setHiddenWord, setHintButton, setGameOver, setFinish, setVictorys, setLoses, hintLetter)

}

const createHiddenWord = (setLetters, setStrikesDom, setNewGameButton, setHangmanImg, chosenWord, setHiddenWord, setHintButton, setGameOver, setFinish, setVictorys, setLoses, hintLetter) => {
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
    renderLetters(setLetters, setStrikesDom, setHiddenWord, setNewGameButton, setHangmanImg, chosenWord, chosenWordArray, setHintButton, setGameOver, setFinish, setVictorys, setLoses, hintLetter)
}

const renderLetters = (setLetters, setStrikesDom, setHiddenWord, setNewGameButton, setHangmanImg, chosenWord, chosenWordArray, setHintButton, setGameOver, setFinish, setVictorys, setLoses, hintLetter) => {
    const lettersMap = lettersArray.map(letter => {
        return (<button id="buttonLetter" key={letter} data-letter={letter} onClick={handleLetterClick(setStrikesDom, setHiddenWord, setLetters, setNewGameButton, setHangmanImg, chosenWord, chosenWordArray, setHintButton, setGameOver, setFinish, setVictorys, setLoses, hintLetter)} style={{ gridArea: letter }}>{letter}</button >)
    })
    setLetters(lettersMap)
}

const handleLetterClick = (setStrikesDom, setHiddenWord, setLetters, setNewGameButton, setHangmanImg, chosenWord, chosenWordArray, setHintButton, setGameOver, setFinish, setVictorys, setLoses, hintLetter) => e => {
    checkIfLetterFound(chosenWord, chosenWordArray, setHintButton, hintLetter, e)
    updateHiddenWord(chosenWord, chosenWordArray, setHiddenWord, setHintButton)
    updateImg(chosenWordArray, setStrikesDom, setHangmanImg)
    checkLose(strikes, setLetters, setHiddenWord, setStrikesDom, setNewGameButton, setGameOver, setFinish, setVictorys, setLoses, setHangmanImg)
    checkVictory(chosenWordArray, setLetters, setStrikesDom, setHiddenWord, setNewGameButton, setGameOver, setFinish, setVictorys, setLoses, setHangmanImg)
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

const checkLose = async (strikes, setLetters, setHiddenWord, setStrikesDom, setNewGameButton, setGameOver, setFinish, setVictorys, setLoses, setHangmanImg) => {
    if (strikes == 0) {
        clearInterval(timerInterval);
        setFinish('You lost!')
        setGameOver(true)
        setLetters('')
        setHiddenWord('')
        setStrikesDom('')
        setHangmanImg(img6)
        setNewGameButton(true)
        await saveScore('lose', setVictorys, setLoses)
    }
}
const checkVictory = async (chosenWordArray, setLetters, setStrikesDom, setHiddenWord, setNewGameButton, setGameOver, setFinish, setVictorys, setLoses, setHangmanImg) => {
    let victoryCondition = chosenWordArray.length
    chosenWordArray.forEach(letter => {
        if (letter != "_") {
            victoryCondition--
        }
    })
    if (victoryCondition == 0) {
        clearInterval(timerInterval);
        setGameOver(true)
        setFinish('Victory!')
        setLetters('')
        setStrikesDom('')
        setHiddenWord('')
        setHangmanImg(img6)
        setNewGameButton(true)
        await saveScore('win', setVictorys, setLoses)
    }
}
const saveScore = async (winlose, setVictorys, setLoses) => {
    await fetch("/games/hangman", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ winlose }),
    })
        .then((res) => res.json())
        .then(async (data) => {
            if (data.addedScore === true) {
                setVictorys(data.newWinScore)
                setLoses(data.newLoseScore)
            } else {
                setVictorys('NULL')
                setLoses('NULL')
            }
        })
}
export default Hangman