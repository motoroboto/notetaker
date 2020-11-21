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
    var newNote = req.body;
    var data = fs.readFileSync('./db/db.json');
    var json = JSON.parse(data);
    json.push(newNote);
    json.forEach(function (json) { delete json.id });
    newList = json.map((json, id) => Object.assign({ id }, json,))
    renderList();
    res.send(`Successfully added an entry!`)
    res.sendFile(path.join(__dirname, "public/notes.html"));
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
    req.send('this?');

});

// Render
function renderList() {
    fs.writeFile("./db/db.json", JSON.stringify(newList), function (err, res) {
        console.log('newList:', newList);
        if (err) {
            return console.log('error', err)
        }
        console.log('did this work?');
        // res.send('how about this?');
    });
};

// Server Listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
