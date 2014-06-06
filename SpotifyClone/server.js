//
// --------------------------------------------- CLUSTER ---------
//
var cluster = require('cluster');

if ( cluster.isMaster ) {
    for ( var i=0; i<4; ++i ){
        cluster.fork();
    }
} else {

    //
    // --------------------------------------------- REQUIRES ---------
    //  
    var express = require('express'),
        bodyParser = require('body-parser'),
        colors = require('colors'),
        path = require('path'),
        model = require('./app/scripts/model/Player');

    var Song = model.Song;
    var Player = model.Player;

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

    //
    // --------------------------------------------- INFRA -----------
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

    //
    // --------------------------------------------- SONGS -----------
    //
    var searchSongs = function(req, res, search) {
        var catalog = [
            new Song('Hit Me Baby One More Time', 'Brittany Spears'),
            new Song('Tik Tok', 'Kei$ha'),
            new Song('Theme Music', 'Rayman 2'),
            new Song('Fouteen Autumns and Fifteen Winters', 'The Twilight Sad'),
            new Song('Still Life', 'The Horrors'),
            new Song('The Entertainer', 'Scott Joplin'),
            new Song('Spring from Four Seasons', 'Vivaldi'),
            new Song('Milk & Black Spiders', 'Foals'),
            new Song('All I Wanted Was Some Danger', 'The Milk'),
            new Song('Pyramid Song', 'Radiohead'),
        ];

        res.json(catalog);
    };

    app.get("/song", function(req, res) {
        console.log("Get All Songs Catalog:");

        searchSongs(req, res);
    });

    app.get("/song/:search", function(req, res) {
        var search = req.params.search;

        console.log("Get Song Catalog: " + search);

        searchSongs(req, res, search);
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
    app.listen(9000, 'localhost', function() {
        console.log('Play-A-Tron 3000 listening at 9000'.rainbow);
        console.log(' ');
    });
}