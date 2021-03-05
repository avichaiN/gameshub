const User = require("../z-models/user");
const bcrypt = require("bcrypt");
// const jwt = require("jwt-simple");
const saltRounds = 12;

exports.loginUser = (req, res) => {
    const { username, password } = req.body

    console.log('in login')

    res.send({ ok: true })
}

exports.registerUser = (req, res) => {
    console.log(req.body)

    const { username, email, password } = req.body;

    const newUser = new User({
        email: email,
        username: username,
        password: password,
    });

    bcrypt.hash(newUser.password, saltRounds, async function (err, hash) {
        try {
            newUser.password = hash;
            await newUser.save();
            res.send({ ok: true })
        } catch (e) {
            console.log(e.message);
            res.send({ ok: false })
        }
    })

}

exports.loginAsGuest = (req, res) => {

    res.send({ ok: true })
}