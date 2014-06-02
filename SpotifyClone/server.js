//
// --------------------------------------------- REQUIRES ---------
//
var express = require('express'),
    bodyParser = require('body-parser'),
    colors = require('colors'),
    path = require('path');

//
// --------------------------------------------- SETUP APP --------
//
var app = express();

app.use(bodyParser());

app.use(express.static(path.join(__dirname, '/app')));
app.set('views', path.join(__dirname, '/app/views'));

//
// --------------------------------------------- ROUTES -----------
//
app.get("/", function(req, res) {
    res.sendfile(path.join(__dirname, '/app/index.html'));
});

app.post("/log/", function(req, res) {
    var messages = req.body.Log4js;

    for (var i = messages.length - 1; i >= 0; i--) {
        var logEvent = messages[i].LoggingEvent;

        if (typeof logEvent.message == 'string' || logEvent.message instanceof String) {
            console.log('System Message: \n'.red + JSON.stringify(logEvent).cyan + "\n");
        } else {
            console.log('Client Message: \n'.red + JSON.stringify(logEvent).green + "\n");
        }
    };

    res.send("OK");
});

app.put("/song/:id", function(req, res) {
    var identifier = req.params.id;

    console.log("Update Song - Identifier: " + identifier);
    console.log(JSON.stringify(req.body));

    res.send("OK");
});

app.post("/song/:id", function(req, res) {
    var identifier = req.params.id;

    console.log("Add New Song - Identifier: " + identifier);
    console.log(JSON.stringify(req.body));

    res.send("OK");
});

//
// --------------------------------------------- START SERVER -----
//
app.listen(9000, 'ws-jasonds', function() {
    console.log('Play-A-Tron 3000 listening at 9000'.rainbow);
    console.log(' ');
});