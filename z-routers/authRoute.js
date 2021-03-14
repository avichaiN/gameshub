const express = require("express");
const router = express.Router();

const cookieParser = require("cookie-parser");
const authController = require("../z-controllers/authController")

router.use(cookieParser());

router
    .route("/")
    .put(authController.loginUser)
    .post(authController.registerUser)

router
    .route("/auth")
    .get(authController.checkAuth)

router
    .route("/logout")
    .get(authController.logOut)


router
    .route("/reset")
    .post(authController.resetPassword)
    .put(authController.updatePassword)

router
    .route("/checkCookie")
    .get(authController.checkCookie)




module.exports = router