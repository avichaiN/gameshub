const User = require("../z-models/User");
const jwt = require("jwt-simple");


exports.save = async (req, res) => {
    const token = req.cookies.userLoggedIn;
    const { highscore } = req.body
    if (token) {
        try {
            const decoded = jwt.decode(token, process.env.SECRET);
            const userId = decoded.id
            const updateUser = await User.findOneAndUpdate({ _id: userId }, { simonHS: highscore })
            res.send({ saved: true })

        } catch (e) {
            res.send({ saved: false })
        }
    }
}
exports.highScore = async (req, res) => {
    const token = req.cookies.userLoggedIn;
    if (token) {
        try {
            const decoded = jwt.decode(token, process.env.SECRET);
            const userId = decoded.id
            const getUserInfo = await User.findOne({ _id: userId })
            const simonHighScore = getUserInfo.simonHS
            res.send({ simonHighScore })
        } catch (e) {
            res.send({ highscore: false })
        }
    }
}