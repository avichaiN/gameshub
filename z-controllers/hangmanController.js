const Hangman = require("../z-models/Hangman");
const User = require("../z-models/user");

const jwt = require("jwt-simple");


exports.getRandomWord = async (req, res) => {
    try {
        const hangmanWords = await Hangman.find({}).exec()
        res.send({ hangmanWords })
    } catch (e) {
        res.send({ err: true })
    }
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
exports.saveScore = async (req, res) => {
    const token = req.cookies.userLoggedIn;

    if (token) {
        const decoded = jwt.decode(token, process.env.SECRET);
        const userId = decoded.id
        const getCurrentUser = await User.findOne({ _id: userId }).exec()

        let currentLoseScore
        let currentWinScore
        let currentPoints = getCurrentUser.hangmanPoints
        let { winlose, onTime } = req.body
        console.log(onTime)

        try {

            if (winlose === 'lose') {
                currentLoseScore = getCurrentUser.hangmanL
                currentWinScore = getCurrentUser.hangmanW
                const newLoseScore = getCurrentUser.hangmanL + 1
                const newWinScore = getCurrentUser.hangmanW
                if (currentPoints < 0) currentPoints = 1
                await User.findOneAndUpdate({ _id: userId }, { hangmanL: newLoseScore, hangmanPoints: currentPoints - 1 }).exec()
                res.send({ addedScore: true, newLoseScore, newWinScore, getCurrentUser })
            } else {
                console.log('victory')
                currentLoseScore = getCurrentUser.hangmanL
                currentWinScore = getCurrentUser.hangmanW
                const newLoseScore = getCurrentUser.hangmanL
                const newWinScore = getCurrentUser.hangmanW + 1
                if (onTime) {
                    const newScore = currentPoints + 3
                    console.log('on time')
                    await User.findOneAndUpdate({ _id: userId }, { hangmanW: newWinScore, hangmanPoints: newScore }).exec()
                } else {
                    const newScore = currentPoints + 2
                    console.log('reg game')
                    await User.findOneAndUpdate({ _id: userId }, { hangmanW: newWinScore, hangmanPoints: newScore }).exec()
                }
                res.send({ addedScore: true, newLoseScore, newWinScore, getCurrentUser })
            }
        } catch (e) {
            console.log(e.message)
            res.send({ addedScore: false })
        }
    }
}
exports.deleteWord = async (req, res) => {
    const { wordId } = req.body
    try {
        await Hangman.findOneAndDelete({ _id: wordId }).exec()
        res.send({ deleted: true })
    } catch (e) {
        console.log(e.message)
        res.send({ deleted: false })
    }
}