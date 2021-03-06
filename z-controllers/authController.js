const User = require("../z-models/User");
const bcrypt = require("bcrypt");
const jwt = require("jwt-simple");
const nodemailer = require("nodemailer");
require("dotenv").config();
const saltRounds = 12;

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const userFound = await User.findOne({
            $or: [{ username: username }, { email: username }],
        });

        hash = userFound.password;
        bcrypt.compare(password, hash, function (err, result) {
            if (result) {
                const token = jwt.encode(
                    {
                        id: userFound._id,
                        role: userFound.role,
                        username: userFound.username,
                        time: new Date().getTime(),
                    },
                    process.env.SECRET
                );
                res.cookie("userLoggedIn", token, {
                    maxAge: 9200000,
                    httpOnly: true,
                });
                res.send({ status: "authorized" });
            } else {
                res.send({ status: "unauthorized" });

            }
        });
    } catch (e) {
        console.log(e.message);
        res.send({ status: "unauthorized" });
    }
}


exports.registerUser = (req, res) => {
    console.log(req.body)

    const { username, email, password1 } = req.body;

    const newUser = new User({
        email: email,
        username: username,
        password: password1,
    });

    bcrypt.hash(newUser.password, saltRounds, async function (err, hash) {
        try {
            newUser.password = hash;
            await newUser.save();

            const token = jwt.encode(
                {
                    id: newUser._id,
                    role: newUser.role,
                    username: newUser.username,
                    time: new Date().getTime(),
                },
                process.env.SECRET
            );
            res.cookie("userLoggedIn", token, {
                maxAge: 9200000,
                httpOnly: true,
            });

            res.send({ status: "authorized" });
        } catch (e) {
            console.log(e.message);
            res.send({ status: "unauthorized" });
        }
    })

}

exports.resetPassword = async (req, res) => {
    try {
        const userEmail = req.body.userEmail;
        const userFound = await User.findOne({ email: userEmail });
        if (userFound) {
            const userId = userFound._id;
            const encodedId = jwt.encode(userId, process.env.SECRET);
            const tranporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAILPASSWORD,
                },
            });

            const mailOptions = {
                from: "GameNoStop, Support.",
                to: `${userEmail}`,
                subject: "GameNoStop. Reset Password.",
                html: `https://gamescollectionhub.herokuapp.com/updatePassword?${encodedId}`,
            };

            tranporter.sendMail(mailOptions, function (e, info) {
                if (e) {
                    res.send({ email: "failed" });
                } else {
                    res.send({ email: "success" });
                }
            });
        } else {
            res.send({ email: "failed" });
        }
    } catch (e) {
        res.send({ status: "unauthorized" })
        console.log(e.message)
    }
}
exports.updatePassword = (req, res) => {
    let newPassword = req.body.newPassword;
    bcrypt.hash(newPassword, saltRounds, async function (err, hash) {
        try {
            newPassword = hash;
            const encodedId = req.headers.referer.replace(
                "http://localhost:3000/updatePassword?",
                ""
            );

            const decodedId = jwt.decode(encodedId, process.env.SECRET);
            const userFound = await User.findOneAndUpdate(
                { _id: decodedId },
                {
                    password: hash,
                }
            );


            res.send({ user: "updated" });
        } catch (e) {
            res.send({ user: "notUpdated" });
            console.log(e);

        }
    });
}
exports.checkCookie = (req, res) => {
    try {
        if (req.cookies.userLoggedIn) {
            res.send({ status: 'authorized' })
        } else {
            res.send({ status: 'unauthorized' })
        }
    } catch (e) {
        console.log(e.message)
    }
}
exports.checkAuth = async (req, res) => {
    const token = req.cookies.userLoggedIn;

    if (token) {
        const decoded = jwt.decode(token, process.env.SECRET);
        const user = await User.findOne({ _id: decoded.id }).exec()
        if (decoded.role === 'admin') {
            res.send({ admin: true, user })
        } else if (decoded.role === 'public') {
            res.send({ user: true, user })
        } else {
            res.send({ admin: false })
        }
    } else {
        res.send({ admin: false })
    }
}
exports.logOut = (req, res) => {

    res.cookie("userLoggedIn", 'token', {
        maxAge: -10,
        httpOnly: true,
    });
    res.send({ logout: true })
}