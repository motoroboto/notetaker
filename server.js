// Dependencies
var express = require("express");
var path = require("path");
var fs = require("fs");
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
function loadNotes() {
    app.get("/notes", function (req, res) {
        res.sendFile(path.join(__dirname, "public/notes.html"));
    });
};

app.get("/api/notes", function (req, res) {
    return res.json(db);
});

// API Routes




app.post("/api/notes", function (req, res) {
    var newNote = req.body;
    var data = fs.readFileSync('./db/db.json');
    var json = JSON.parse(data);
    json.push(newNote);
    console.log('json:', json)
    const indexed = json.map((json, id) => Object.assign({ id }, json,))
    console.log(indexed)
    fs.writeFile("./db/db.json", JSON.stringify(indexed), function (err, result) {
        if (err) console.log('error', err);
    });
    loadNotes();
});

app.delete("/api/notes/:id", function (req, res) {
    const deleteId = req.params.id;
    console.log('target:', deleteId)
    var data = fs.readFileSync('./db/db.json');
    var json = JSON.parse(data);
    var newData = json.filter(function (object) {
        return object.id != deleteId;
    })
    fs.writeFile("./db/db.json", JSON.stringify(newData), function (err, result) {
        if (err) console.log('error', err);
    });
    loadNotes();

});

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
    loadNotes()
});
