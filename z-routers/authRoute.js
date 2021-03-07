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
    .route("/admin")
    .get(authController.checkAdmin)

router
    .route("/guest")
    .get(authController.loginAsGuest)

router
    .route("/reset")
    .post(authController.resetPassword)
    .put(authController.updatePassword)

router
    .route("/checkCookie")
    .get(authController.checkCookie)




module.exports = router