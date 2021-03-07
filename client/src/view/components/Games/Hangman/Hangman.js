import './dist/hangman.css';
import React, { useState, useEffect } from 'react';
import HangmanAdmin from './HangmanAdmin'
import img6 from './img/6.jpeg'
import img5 from './img/5.jpeg'
import img4 from './img/4.jpeg'
import img3 from './img/3.jpeg'
import img2 from './img/2.jpeg'
import img1 from './img/1.jpeg'
import img0 from './img/0.jpeg'
const imgs = [img0, img1, img2, img3, img4, img5, img6]

const Hangman = () => {
    const [strikesDom, setStrikesDom] = useState('')
    const [hangmanImg, setHangmanImg] = useState(img6)
    const [newGame, setNewGameButton] = useState(true)
    const [hiddenWord, setHiddenWord] = useState('')
    const [letters, setLetters] = useState('')
    const [isAdmin, setAdmin] = useState(false)
    const [allWords, setAllWords] = useState('')

    useEffect(() => {
        fetch('/admin')
            .then(r => r.json())
            .then(r => {
                if (r.admin === true) {
                    setAdmin(true)
                }
            })
    }, [])

    return (
        <div className="wrapper">

            {newGame ?
                <button id="newGame" onClick={() => handleNewGame(setStrikesDom, setHangmanImg, setNewGameButton, setHiddenWord, setLetters)}>Start Game</button>
                :
                null
            }
            <div className="gameInfo">
                <div id="strikes">{strikesDom}</div>
                <div id="toot">{hiddenWord}</div>
            </div>

            <div className="lowerWrapper">
                <div id="hangman">
                    <img src={hangmanImg} />
                </div>
                <div className="letters">
                    <div id="letters">{letters}</div>
                </div>
            </div>

            {isAdmin ?
                <HangmanAdmin allWords={allWords} setAllWords={setAllWords} />
                :
                null
            }
        </div>
    )
}

const lettersArray = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"]
let strikes = 6
let counter = 0

const getRandomWord = async () => {
    let randomWord = ''
    await fetch("/games/hangman")
        .then(r => r.json())
        .then(data => (
            randomWord = data.randomWord.word
        ))
    return randomWord
}
async function handleNewGame(setStrikesDom, setHangmanImg, setNewGameButton, setHiddenWord, setLetters) {
    const chosenWord = await getRandomWord()

    strikes = 6
    setStrikesDom(`You have ${strikes} strikes left.`)
    setHangmanImg(imgs[strikes])
    setNewGameButton(false)
    let html = ""
    let chosenWordArray = []

    for (let i = 0; i < chosenWord.length; i++) {
        if (chosenWord.charAt(i) != " ") {
            chosenWordArray.push("_")
        } else {
            chosenWordArray.push("-")
        }
    }
    chosenWordArray.forEach(letter => {
        html += ` ${letter} `
    })

    setHiddenWord(html)
    renderLetters(setLetters, setStrikesDom, setHiddenWord, setNewGameButton, setHangmanImg, chosenWord, chosenWordArray)
}

const renderLetters = (setLetters, setStrikesDom, setHiddenWord, setNewGameButton, setHangmanImg, chosenWord, chosenWordArray) => {
    console.log('RENDER LETTER')
    const lettersMap = lettersArray.map(letter => {
        return (<button id="buttonLetter" key={letter} data-letter={letter} onClick={handleLetterClick(setStrikesDom, setHiddenWord, setLetters, setNewGameButton, setHangmanImg, chosenWord, chosenWordArray)} style={{ gridArea: letter }}>{letter}</button >)
    })
    setLetters(lettersMap)
}

const handleLetterClick = (setStrikesDom, setHiddenWord, setLetters, setNewGameButton, setHangmanImg, chosenWord, chosenWordArray) => e => {
    const clickedLetter = e.target.dataset.letter
    console.log(clickedLetter)
    const regLetter = new RegExp(clickedLetter, 'gi')

    let html = ""
    e.target.style.backgroundColor = "red"
    e.target.style.pointerEvents = "none"
    for (let i = 0; i < chosenWordArray.length; i++) {
        if (regLetter.test(chosenWord.charAt(i))) {
            console.log("found")
            chosenWordArray.splice(i, 1, `${clickedLetter}`)
        } else {
            counter++
        }
    }
    chosenWordArray.forEach(letter => {
        html += ` ${letter} `
    })
    setHiddenWord(html)

    if (counter == chosenWordArray.length) {
        strikes--
        setStrikesDom(`You have ${strikes} strikes left.`)
        console.log('img selectionj')
        setHangmanImg(imgs[strikes])
    }
    counter = 0

    if (strikes == 0) {
        setLetters('')
        setHiddenWord('You Lost!')
        setStrikesDom('')
        setNewGameButton(true)
    }
    let victoryCondition = chosenWordArray.length
    chosenWordArray.forEach(letter => {
        if (letter != "_") {
            victoryCondition--
        }
    })
    if (victoryCondition == 0) {
        setLetters('')
        setStrikesDom('')
        setHiddenWord('Victory!')
        setNewGameButton(true)
        console.log("you won")
    }
}
export default Hangman