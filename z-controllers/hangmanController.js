const Hangman = require("../z-models/Hangman");


exports.getRandomWord = async (req, res) => {
    const hangmanWords = await Hangman.find({}).exec()

    const randomWord = hangmanWords[Math.floor(Math.random() * hangmanWords.length)];
    res.send({ randomWord })
    // const newWord = new Hangman({
    //     word: 'random word'
    // });
    // try {
    //     await newUser.save()
    //     console.log(newUser)
    // } catch (e) {
    //     console.log(e.message)
    // }
}
exports.addWord = async (req, res) => {
    const { word } = req.body
    const newWord = new Hangman({
        word: word
    });
    const acceptWord = /^[A-Za-z\s]*$/;
    if (acceptWord.test(word)) {
        try {
            await newWord.save()
            console.log(newWord)
            res.send({ added: true, word })
        } catch (e) {
            res.send({ added: false, word })
        }
    } else {
        res.send({ added: false, word })
    }
}
exports.allWords = async (req, res) => {
    const hangmanWords = await Hangman.find({}).exec()
    res.send({ hangmanWords })
}