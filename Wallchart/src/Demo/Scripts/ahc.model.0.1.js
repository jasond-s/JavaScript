/** @module ahc/model */

// Coallease the namespace.
ahc = ahc || {};

/**
 * Eventbase : Abstract
 * @constructor
 * @param {Object} [data] The data associated with the event.
 */
var Eventbase = (function() {
    'use strict'

    function Eventbase(data) {
        if (!(this instanceof Eventbase)) {
            return new Eventbase(data);
        }

        if (!data) throw new ahc.ex.ArgumentException('data');

        this.data = data;

        this.start = new ahc.ObservableVal(this.data.start);
        this.finish = new ahc.ObservableVal(this.data.finish);
    }

    return Eventbase;
}());
ahc.Eventbase = Eventbase;



/**
 * Booking
 * @constructor
 * @param {Object} [data] The data associated with the booking/event.
 */
var Booking = (function(_base) {
    'use strict'
    ahc.extend(Booking, _base);

    function Booking(data) {
        if (!(this instanceof Booking)) {
            return new Booking(data);
        }
        _base.call(this, data)
    }

    return Booking;
}(ahc.Eventbase));
ahc.Booking = Booking;



/**
 * Resource
 * @constructor
 * @param {Object} [data] The data associated with the resource.
 */
var Resource = (function() {
    'use strict'

    function Resource(data) {
        if (!(this instanceof Resource)) {
            return new Resource(data);
        }

        if (!data) throw new ahc.ex.ArgumentException('data');

        this.name = data.name;
        this.events = new ahc.ObservableArray();
    }

    /**
     * Add An Event
     * Add a new event to the resource.
     * @param {ahc.Event} [args] Takes a single event, a set of events or an array of events.
     */
    Resource.prototype.addEvent = function() {
        ahc.arrayArgument(arguments, this, function(obj) {
            if (obj instanceof Eventbase) {
                this.events.add(obj);
            }
        });
    };

    /**
     * Remove An Event
     * Remove an exisiting event from the resource.
     * @param {ahc.Event} [args] Takes a single event, a set of events or an array of events.
     */
    Resource.prototype.removeEvent = function() {
        ahc.arrayArgument(arguments, this, function(obj) {
            this.events.remove(obj);
        });
    };

    return Resource;
}());
ahc.Resource = Resource;