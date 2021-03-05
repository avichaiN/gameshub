const User = require("../z-models/user");
const bcrypt = require("bcrypt");
const jwt = require("jwt-simple");
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

exports.loginAsGuest = (req, res) => {

    const token = jwt.encode(
        {
            time: new Date().getTime(),
        },
        process.env.SECRET
    );
    res.cookie("guestLogged", token, {
        maxAge: 9200000,
        httpOnly: true,
    });
    res.send({ status: "authorized" });
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