// Dependencies
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
let db = require('./db/db.json');
let PORT = process.env.PORT || 3000;
var newList = [{}];

// Sets up the Express App
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


// HTML Routes
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

// API Routes
app.get("/api/notes", function (req, res) {
    res.json(db);
});


app.post("/api/notes", function (req, res) {
    let newNote = req.body;
    db.push(newNote);
    db.forEach(function (db) { delete db.id });
    db = db.map((db, id) => Object.assign({ id }, db,))
    renderList();
    res.send(`Successfully added an entry!`)
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.delete("/api/notes/:id", function (req, res) {
    let deleteId = req.params.id;
    db = db.filter(object => object.id != deleteId);
    renderList();
    res.send("Successfully deleted an entry!");
});

// Render
function renderList() {
    fs.writeFile("./db/db.json", JSON.stringify(db), function (err, res) {
        if (err) return console.log('error', err)
    });
};

// Server Listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
