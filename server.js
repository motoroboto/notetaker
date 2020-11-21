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
    return res.json(db);
});

app.post("/api/notes", function (req, res) {
    var newNote = req.body;
    var data = fs.readFileSync('./db/db.json');
    var json = JSON.parse(data);
    json.push(newNote);
    json.forEach(function (json) { delete json.id });
    newList = json.map((json, id) => Object.assign({ id }, json,))
    renderList();
    res.send(`Successfully added an entry!`)
});

app.delete("/api/notes/:id", function (req, res) {
    const deleteId = req.params.id;
    console.log('target:', deleteId)
    var data = fs.readFileSync('./db/db.json');
    var json = JSON.parse(data);
    newList = json.filter(function (object) {
        return object.id != deleteId;
    });
    renderList();
    res.send("Successfully deleted an entry!");
});

// Render
function renderList() {
    fs.writeFile("./db/db.json", JSON.stringify(newList), function (err, res) {
        if (err) console.log('error', err);
    });
};

// Server Listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
