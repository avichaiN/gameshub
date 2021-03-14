const express = require("express");
const router = express.Router();

const hangmanController = require("../z-controllers/hangmanController")
const simonController = require("../z-controllers/simonController")
const leaderboardController = require("../z-controllers/leaderboardController")

const checkAdmin = require("../z-controllers/checkAdmin");


router
    .route('/leaderboard/:id')
    .get(leaderboardController.getLeaderBoard)

router
    .route("/hangman")
    .get(hangmanController.getRandomWord)
    .post(checkAdmin, hangmanController.addWord)
    .put(hangmanController.saveScore)
    .delete(checkAdmin, hangmanController.deleteWord)


router
    .route("/hangman/allwords")
    .get(checkAdmin, hangmanController.allWords)

router
    .route("/simon/save")
    .post(simonController.save)

router
    .route("/simon/geths")
    .get(simonController.highScore)

module.exports = router