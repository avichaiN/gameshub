const express = require('express')
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require("mongoose");
require("dotenv").config();


//DB Connection
mongoose.connect(`${process.env.DATABASE_URL}`, {
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

//Routes
const authRoute = require("./z-routers/authRoute");

const port = process.env.PORT || 4000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", authRoute);

app.use(express.static(path.join(__dirname, '.', 'client', 'build')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, "./public", "Categories.html"));
//   })

app.listen(port, () => { console.log(`listen on port ${port}`) })