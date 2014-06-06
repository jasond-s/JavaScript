'use strict';

// --------------------------------------------- CONSTRUCTORS: FACTORIES -----

//
// --------------------------------------------- AUDIO COMPONENTS -----
//
app.factory('audioComponents', [

    function() {
        // Capture scope.
        var that = this;

        // Create our player and link it to the needed DOM elements if they exist.
        var audioElement = document.getElementById('mainPlayer'),
            audioSource = document.getElementById('oggSource'),
            newPlayer = new Player(audioElement, audioSource);

        // Factory provides private through scope.
        return {
            player: newPlayer
        };
    }
]);


// --------------------------------------------- SINGLETONS: SERVICES -----

//
// --------------------------------------------- TRACK CATALOG -----
//
app.service('trackCatalog', ['nsHttp',
    function(nsHttp) {
        var convertDtos = function(data) {
            var results = [];
            for (var i = data.length - 1; i >= 0; i--) {
                var d = data[i];
                results.push(new Song(d.name, d.artist));
            }
            return results;
        }

        // Retrieve catalog from the server.
        this.getAll = function(callback) {
            // Do some form or search and return a new catalog.
            var promise = nsHttp.get('/song').then(function(result) {
                console.log(JSON.stringify(result.data));
                callback(convertDtos(result.data));
            });
        }
        this.search = function(searchTerm, callback) {
            // Do some form or search and return a new catalog.
            var promise = nsHttp.get('/song?' + 'search=' + searchTerm).then(function(result) {
                console.log(JSON.stringify(result.data));
                callback(convertDtos(result.data));
            });
        }
    }
]);

//
// --------------------------------------------- LOGGER -----
//
app.service('logger', [

    function() {
        var logger = Log4js.getLogger('Controllers'),

            // The appenders that the logging system will use.
            browserAppender = new Log4js.BrowserConsoleAppender(),
            ajaxAppender = new Log4js.AjaxAppender("./log/"),

            // Layout for the appenders.
            basicLayout = new Log4js.BasicLayout(),
            jsonLayout = new Log4js.JSONLayout();


        //set the level of logging 
        logger.setLevel(Log4js.Level.ALL);

        // Annoying and not necessary newline in browser.
        basicLayout.LINE_SEP = '';

        browserAppender.setLayout(basicLayout);
        ajaxAppender.setLayout(jsonLayout);

        // Buffer before log send.
        ajaxAppender.setThreshold(10);

        // Add the new appenders the logger will be using.
        logger.addAppender(browserAppender);
        logger.addAppender(ajaxAppender);


        // If you want to send an object as a string.
        var sanitise = function(str) {
            return JSON.stringify(str).replace(/[{}\"]/g, ' ')
        }

        // At the moment only info is implemented.
        return {
            infoString: function(str) {
                logger.info(sanitise(str));
            },
            info: function(source, state) {
                logger.info(JSON.stringify({
                    source: source,
                    state: state
                }));
            }
        };
    }
]);