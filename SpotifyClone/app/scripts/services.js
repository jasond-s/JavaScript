'use strict';

// --------------------------------------------- CONSTRUCTORS: FACTORIES -----

//
// --------------------------------------------- AUDIO COMPONENTS -----
//
// Creates a factory method so we can have one for each inject.
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
app.service('trackCatalog', [

    function() {
        // Capture scope.
        var that = this;

        // Create the catalog... this would probably be a remote call with parameters.
        var catalog = [
            new Song('Hit Me Baby One More Time', 'Brittany Spears'),
            new Song('Tik Tok', 'Kei$ha'),
            new Song('Theme Music', 'Rayman 2'),
            new Song('Fouteen Autumns and Fifteen Winters', 'The Twilight Sad'),
            new Song('Still Life', 'The Horrors'),
            new Song('Milk & Black Spiders', 'Foals'),
            new Song('All I Wanted Was Some Danger', 'The Milk'),
            new Song('Pyramid Song', 'Radiohead'),
        ];

        this.search = function(searchTerm) {
            // Do some form or search and return a new catalog.
            return catalog;
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