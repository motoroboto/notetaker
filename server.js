// Dependencies
var express = require("express");
var path = require("path");
var PORT = process.env.PORT || 3000;
var db = require('./db/db.json');

// Sets up the Express App
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


// HTML Routes
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

// API Routes
app.get("/api/notes", function (req, res) {
    return res.json(db);
    // console.log('db:', db)
});

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});