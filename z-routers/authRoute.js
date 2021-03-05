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
    .route("/guest")
    .get(authController.loginAsGuest)


module.exports = router