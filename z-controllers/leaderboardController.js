const User = require("../z-models/user");


exports.getLeaderBoard = async (req, res) => {
    const whichGame = req.params.id
    try {
        if (whichGame === 'hangmanP') {
            const hangmanLeaders = await hangmanPoints()
            res.send({ hangmanLeaders })
        } else if (whichGame === 'hangmanW') {
            const hangmanLeaders = await hangmanWins()
            res.send({ hangmanLeaders })
        } else if (whichGame === 'simon') {
            const simonHighScore = await simonLeaders()
            res.send({ simonHighScore })
        } else {
            console.log('main button')
            res.send({ ok: true })
        }

    } catch (e) {
        console.log(e)
        res.send({ err: true })
    }
}
const hangmanPoints = async () => {
    try {
        const allUsersPlayedHangman = await User.find({ hangmanPoints: { $gte: 1 } })
        const sortPointsHangman = allUsersPlayedHangman.sort((a, b) => b.hangmanPoints - a.hangmanPoints)
        return sortPointsHangman
    } catch (e) {
        res.send({ err: true })
    }
}
const hangmanWins = async () => {
    try {
        const allUsersPlayedHangman = await User.find({ hangmanW: { $gte: 1 } })
        const sortWinsHangman = allUsersPlayedHangman.sort((a, b) => b.hangmanW - a.hangmanW)
        return sortWinsHangman
    } catch (e) {
        res.send({ err: true })
    }
}
const simonLeaders = async () => {
    try {
        const allUsersPlayedSimon = await User.find({ simonHS: { $gte: 1 } })
        const sortSimonHS = allUsersPlayedSimon.sort((a, b) => b.simonHS - a.simonHS)
        return (sortSimonHS)
    } catch (e) {
        res.send({ err: true })
    }
}