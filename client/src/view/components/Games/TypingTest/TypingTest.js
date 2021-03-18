import React, { useState, useEffect } from 'react';
import './dist/typingtest.css';
import LoadingCircle from '../LoadingCircle/LoadingCircle'

const TypingTest = ({ }) => {
    const lettersArray = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"]
    const [readyForGame, setReadyForGame] = useState(false)
    const [startTest, setStartTest] = useState(false)
    const [chosenWord, setChosenWord] = useState('')
    const [words, setWords] = useState('')
    const [wordsCompleted, setWordsCompleted] = useState(1)
    const [allWords, setAllWords] = useState()

    useEffect(() => {
        fetch('https://random-word-api.herokuapp.com/all')
            .then(r => r.json())
            .then(r => {
                setAllWords(r)
                setReadyForGame(true)
            })
    }, [])

    const handleStartTyping = () => {
        const chosenWordsArr = []
        while (chosenWordsArr.length < 5) {
            const random = Math.floor(Math.random() * allWords.length)
            chosenWordsArr.indexOf(allWords[random]) === -1 ? chosenWordsArr.push(allWords[random]) : console.log("This item already exists");
        }
        setWords(chosenWordsArr)
        setChosenWord(chosenWordsArr[2])
        setStartTest(true)

    }
    const handleStopTyping = () => {
        setWordsCompleted(1)
        setStartTest(false)
    }

    const handleTypeWord = (e) => {
        const typedWord = e.target.value.trim()
        if (e.keyCode == 32) {
            document.getElementById(`${words[2]}`).style.fontSize = '25px'
            setWordsCompleted(wordsCompleted + 1)
            if (typedWord === chosenWord) {
                document.getElementById(`${chosenWord}`).style.color = 'green'
                e.target.value = ''
            } else {
                document.getElementById(`${chosenWord}`).style.color = 'red'
                e.target.value = ''
            }
            let wordAdded = false
            let newWords
            while (!wordAdded) {
                const random = Math.floor(Math.random() * allWords.length)
                if (words.indexOf(allWords[random]) === -1) {
                    newWords = [...words, allWords[random]]
                    wordAdded = true
                }
            }

            newWords.shift()
            setWords(newWords)
            setChosenWord(newWords[2])
        }
    }
    return (
        <div className="wrapper container-sm bg-light mt-2">

            {readyForGame ? <div>{startTest ? <button onClick={handleStopTyping}>Stop</button>
                : <button onClick={handleStartTyping}>Start</button>
            }</div> :
                <LoadingCircle />}


            {startTest ?
                <div>Word: {chosenWord}
                    <div>{lettersArray.map(letter => {
                        return (<button id="buttonLetter" key={letter} data-letter={letter} style={{ gridArea: letter }}>{letter}</button >)
                    })}</div>
                    <div>
                        {words.map((word, i) => {
                            return (<p key={i} style={{ color: `word${i}Color` }} id={word}>{word}</p>)
                        })}
                    </div>
                    <input onKeyUp={handleTypeWord} className='wordInput' type='text' placeholder='Type Word' />
                </div>
                :
                null}
        </div>
    )
}

export default TypingTest