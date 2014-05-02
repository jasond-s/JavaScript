'use strict';

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


// Creates a singleton that is used wherever it is injected.
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