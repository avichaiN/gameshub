const express = require("express");
const router = express.Router();

const hangmanController = require("../z-controllers/hangmanController")
const checkAdmin = require("../z-controllers/checkAdmin");


router
    .route("/hangman")
    .get(hangmanController.getRandomWord)
    .post(checkAdmin, hangmanController.addWord)
    .put(hangmanController.saveScore)
    .delete(checkAdmin, hangmanController.deleteWord)

router
    .route("/hangman/allwords")
    .get(checkAdmin, hangmanController.allWords)

module.exports = router