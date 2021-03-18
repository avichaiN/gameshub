import React, { useState, useEffect } from 'react';
import './dist/typingtest.css';
import LoadingCircle from '../LoadingCircle/LoadingCircle'
let timerInterval
const TypingTest = ({ }) => {
    const lettersArray = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"]
    const [readyForGame, setReadyForGame] = useState(false)
    const [gameLive, setGameLive] = useState(false)
    const [allWords, setAllWords] = useState()

    const [timer, setTimer] = useState()
    const [correctWords, setCorrectWords] = useState(0)
    const [inCorrectWords, setInCorrectWords] = useState(0)


    const [chosenWordFont, setChosenWordFont] = useState('25px')
    const [oldWord1Color, setOldWord1Color] = useState('black')
    const [oldWord2Color, setOldWord2Color] = useState('black')
    const [oldWord3Color, setOldWord3Color] = useState('black')


    const [oldWord1, setOldWord1] = useState()
    const [oldWord2, setOldWord2] = useState()
    const [oldWord3, setOldWord3] = useState()
    const [word1, setWord1] = useState()
    const [word2, setWord2] = useState()
    const [word3, setWord3] = useState()
    const [word4, setWord4] = useState()



    useEffect(() => {
        fetch('https://random-word-api.herokuapp.com/all')
            .then(r => r.json())
            .then(r => {
                setAllWords(r)
                setReadyForGame(true)
            })
    }, [])


    const randomNum = () => {
        const random = Math.floor(Math.random() * allWords.length)
        return random
    }

    const handleStartTyping = () => {
        clearInterval(timerInterval);
        setWord1(allWords[randomNum()])
        setWord2(allWords[randomNum()])
        setWord3(allWords[randomNum()])
        setWord4(allWords[randomNum()])
        setGameLive(true)

        let oneMinute = 60 * 1
        startTimer(oneMinute, setTimer);
        function startTimer(duration, setTimer) {
            console.log('timer')
            let timer = duration, minutes, seconds;
            timerInterval = setInterval(() => {

                minutes = parseInt(timer / 60, 10);
                seconds = parseInt(timer % 60, 10);

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                setTimer(minutes + ":" + seconds)

                if (--timer < 0) {
                    clearInterval(timerInterval);
                    setGameLive(false)
                    setTimer('01:00')
                    setOldWord1()
                    setOldWord2()
                    setOldWord3()
                }
            }, 1000);
        }
    }
    const handleStopTyping = () => {
        setGameLive(false)
        clearInterval(timerInterval);
        setTimer('01:00')
        setOldWord1()
        setOldWord2()
        setOldWord3()
    }

    const handleTypeWord = (e) => {
        const typedWord = e.target.value.trim()

        if (e.keyCode == 32) {
            if (typedWord === word1) {
                setCorrectWords(correctWords + 1)
                setOldWord3Color('green')
                setOldWord2Color(oldWord3Color)
                setOldWord1Color(oldWord2Color)
            } else {
                setInCorrectWords(inCorrectWords + 1)
                setOldWord3Color('red')
                setOldWord2Color(oldWord3Color)
                setOldWord1Color(oldWord2Color)
            }
            e.target.value = ''
            setOldWord3(word1)
            setOldWord2(oldWord3)
            setOldWord1(oldWord2)
            setWord1(word2)
            setWord2(word3)
            setWord3(word4)
            setWord4(allWords[randomNum()])
        }
    }
    const displayKey = (e) => {
        const key = e.key
        const regex = /^[a-zA-Z]*$/;
        if (key !== 'Backspace' && key !== 'Enter' && key !== 'Shift' && key !== 'Control' && key !== 'Tab' && key !== 'ContextMenu' && !key == 'Alt') {
            if (regex.test(key)) {
                document.getElementById(`${key}`).style.color = 'red'
                setTimeout(() => {
                    document.getElementById(`${key}`).style.color = 'black'
                }, 100);
            }
        }
    }
    document.addEventListener('keydown', displayKey);




    return (
        <div className="wrapper container-sm bg-light mt-2">

            {readyForGame ?
                <div>
                    <div>{gameLive ? <button onClick={handleStopTyping}>Stop</button>
                        : <button onClick={handleStartTyping}>Start 1 min test</button>
                    }
                    </div>


                    <div>
                        <div><p>Correct words: {correctWords}</p><p>Incorrect Words: {inCorrectWords}</p></div>
                        <div>{lettersArray.map(letter => {
                            return (<button id="buttonLetter" key={letter} id={letter} style={{ gridArea: letter }}>{letter}</button >)
                        })}</div>
                        <div>
                            <h3>{timer}</h3>
                            <p style={{ color: oldWord1Color }}>{oldWord1}</p>
                            <p style={{ color: oldWord2Color }}>{oldWord2}</p>
                            <p style={{ color: oldWord3Color }}>{oldWord3}</p>
                            <p style={{ fontSize: chosenWordFont }}>{word1}</p>
                            <p >{word2}</p>
                            <p >{word3}</p>
                            <p >{word4}</p>
                        </div>
                        {
                            gameLive ?
                                <input onKeyUp={handleTypeWord} className='wordInput' type='text' placeholder='Type Word' />
                                :
                                <input onKeyUp={handleTypeWord} className='wordInput' disabled type='text' placeholder='Type Word' />
                        }
                    </div>
                </div>
                :
                <LoadingCircle />}
        </div>
    )
}

export default TypingTest