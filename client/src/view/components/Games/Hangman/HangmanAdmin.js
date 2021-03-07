import swal from 'sweetalert';

const HangmanAdmin = ({ setAllWords, allWords }) => {
    return (
        <div>
            <h3>Admin</h3>
            <form onSubmit={addWord(setAllWords)}>
                <label>Add word to DB</label>
                <input type='text' name='hangmanWord' required />
                <button>Add word</button>
            </form>
            <button onClick={() => getAllWords(setAllWords)}>Show all words</button>

            <div className='hangman__allWords'>{allWords}</div>
        </div>
    )
}
const addWord = (setAllWords) => e => {
    e.preventDefault()
    const word = e.target.children.hangmanWord.value
    console.log(word)
    fetch("/games/hangman", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ word }),
    })
        .then((res) => res.json())
        .then(async (data) => {
            if (data.added === true) {
                await swal({
                    title: `${data.word}`,
                    text: "Word added sucessfully",
                    icon: "success",
                    buttons: false,
                    timer: 1500,
                });
                getAllWords(setAllWords)
            } else {
                await swal({
                    title: `${data.word}`,
                    text: "Error adding word",
                    icon: "error",
                    buttons: false,
                    timer: 1500,
                });
            }

        })
}
const getAllWords = (setAllWords) => {
    fetch("/games/hangman/allwords")
        .then((res) => res.json())
        .then((data) => {
            const hangmanWords = data.hangmanWords.map(word => {
                console.log(word.word)
                return (<p key={word.word}>{word.word}</p>)
            })
            setAllWords(hangmanWords)
        })
}
export default HangmanAdmin