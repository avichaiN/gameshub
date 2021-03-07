const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const HangmanSchema = new Schema(
    {
        word: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        }
    }
)

module.exports = mongoose.model("hangman", HangmanSchema);