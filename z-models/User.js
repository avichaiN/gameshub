const mongoose = require("mongoose");
const Hangman = require("./Hangman");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        username: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: "public",
        },
        hangmanL: {
            type: Number,
            default: 0
        },
        hangmanW: {
            type: Number,
            default: 0
        },
        hangmanPoints: {
            type: Number,
            default: 0,
        },
        simonHS: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("users", UserSchema);