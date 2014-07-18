/** @module ahc/wallchart */

ahc = ahc || {};
ahc.sectorLookup = [12, 6, 4, 2, 1, 0.5, 0.33333, 0.16667, 0.08333, 0.04167, 0.00595];
ahc.timeTextGenerator = [

    function(d) {
        return d.addMinutes(5);
    },
    function(d) {
        return d.addMinutes(10);
    },
    function(d) {
        return d.addMinutes(15);
    },
    function(d) {
        return d.addMinutes(30);
    },
    function(d) {
        return d.addHours(1);
    },
    function(d) {
        return d.addHours(2);
    },
    function(d) {
        return d.addHours(3);
    },
    function(d) {
        return d.addHours(6);
    },
    function(d) {
        return d.addHours(12);
    },
    function(d) {
        return d.addHours(24);
    },
    function(d) {
        return d.addHours(168);
    },
];
ahc.unmovableObject = {
    hasControls: false,
    hasBorders: false,
    lockMovementY: true,
    lockMovementX: true
};

/**
 * Wallchart Object - Abstract
 * @constructor
 */
var WcObject = (function() {
    'use strict';

    function WcObject() {
        if (!(this instanceof WallChartObject)) {
            return new WcObject();
        }
    }

    /**
     * On Clone Object
     */
    WcObject.prototype.onClone = function() {

    };

    return WcObject;

}());
ahc.WcObject = WcObject;



/**
 * WsEvent
 * @constructor
 * @extends fabric.Rect
 * @param {Object} [data] The Event data.
 * @param {Number} [width] The relative width of the Event.
 * @param {Date} [start] The start position.
 * @param {Object} [fill] Colour fill.
 */
var WcEvent = (function(_base) {
    'use strict';
    ahc.extend(WcEvent, _base);
    ahc.mixin(WcEvent.prototype, WcObject.prototype);

    function WcEvent(data, width, height, start, fill) {
        if (!(this instanceof WcEvent)) {
            return new WcEvent(data, width, height, start, fill);
        }
        _base.call(this, {
            height: height - 4,
            hasRotatingPoint: false,
            hasBorders: false,
            lockRotation: true,
            lockMovementY: true,
            lockScalingY: true
        });

        this.desiredFill = fill;
        this.currentCollsions = [];

        this.data = data;
        this.parent = null;

        // Set the fill, this could be a pattern.
        this.setFill(fill);
        // Some calculation needs to be done for the start.
        this.setLeft(start);
        // The width should be dependant on the scale factor for the current zoom level.
        this.setWidth(width);
    }

    /**
     * Collision With Event
     * When this event collides with another this event is raised.
     * @param {ahc.WcEvent} [event] Takes a single event, the one this has collided with.
     */
    WcEvent.prototype.collisionWithEvent = function() {
        this.currentCollsions = [];

        ahc.arrayArgument(arguments, this, function(obj) {
            ahc.add(this.currentCollsions, obj);
        });

        if (this.currentCollsions.length > 0) {
            // Current Collisions Handle.
            this.fill = 'rgba(255,0,0,0.5)';

            // Handle any extra logic for the collision.
        } else {
            // No Collisions Handle.
            this.fill = this.desiredFill;

            // Handle any extra logic for not having any collisions.
        }
    }

    return WcEvent;

}(fabric.Rect));
ahc.WcEvent = WcEvent;



/**
 * WsResource
 * @constructor
 * @extends fabric.Rect
 * @param {ahc.WallChart} [parent] The parent wallchart.
 * @param {Object} [data] The resource data.
 * @param {Number} [top] The top position in the parent canvas.
 * @param {Object} [pattern] The pattern fill.
 */
var WcResource = (function(_base) {
    'use strict';
    ahc.extend(WcResource, _base);
    ahc.mixin(WcResource.prototype, WcObject.prototype);

    function WcResource(parent, data, top, pattern) {
        if (!(this instanceof WcResource)) {
            return new WcResource(parent, data, top, pattern);
        }
        _base.call(this, ahc.mixin({
            width: 900,
            height: parent.height,
            left: 130
        }, ahc.unmovableObject));

        this.canvas = parent.canvas;
        this.parent = parent;

        this.setTop(top);
        this.setFill(pattern);

        this.text = new fabric.Text(ahc.padRight(16, data.name, ' '), ahc.mixin({
            fontFamily: 'consolas',
            left: 0,
            fill: '#FFF',
            backgroundColor: '#0064ab',
            fontSize: 14,
        }, ahc.unmovableObject));

        this.cover = new fabric.Rect(ahc.mixin({
            top: top,
            width: this.text.getWidth() + 2,
            height: parent.height,
            left: 0,
            fill: '#0064ab'
        }, ahc.unmovableObject));

        this.text.setTop(top + (parent.height * 0.5) - (this.text.getHeight() * 0.5) - 2);

        // The main object.
        this.data = data;

        // Might need to store the local Events for he resource.
        this.events = new ahc.ObservableArray();

        // The resource needs to add itself to the canvas.
        this.canvas.add(this);
        this.canvas.add(this.cover);
        this.canvas.add(this.text);

        this.eventsChanged();
    }

    WcResource.prototype.remove = function() {
        // The resource needs to add itself to the canvas.
        this.removeEvent(this.events.getArray());
        this.events.clear();
        this.canvas.remove(this);
        this.canvas.remove(this.cover);
        this.canvas.remove(this.text);
    };

    WcResource.prototype.setVertical = function(top) {
        this.setTop(top);
        this.text.setTop(top + (this.parent.height * 0.5) - (this.text.getHeight() * 0.5) - 2);
        this.cover.setTop(top);
        var _events = this.events.getArray();
        for (var i = 0; i < _events.length; i++) {
            _events[i].setTop(top);
        };
    };

    /**
     * Sort Layers
     * Sort the canvas objects that are contents of the rsource. To prevent overlap.
     */
    WcResource.prototype.sortLayers = function() {
        this.canvas.sendToBack(this);
        this.canvas.bringToFront(this.cover);
        this.canvas.bringToFront(this.text);
    };

    /**
     * Events Changed
     * Handler for events of containing object changing.
     */
    WcResource.prototype.eventsChanged = function() {
        this.removeEvent(this.events.getArray());
        this.events.clear();

        var _padding = this.parent.pixelsPerHour,
            _newEvents = this.data.events.getArray();

        for (var i = 0; i < _newEvents.length; i++) {
            var _start = ahc.parseTimeToDecimal(_newEvents[i].start.value);
            var _finish = ahc.parseTimeToDecimal(_newEvents[i].finish.value);
            var wcEvent = new ahc.WcEvent(_newEvents[i], (_finish - _start) * _padding + 1, this.parent.height, 130 + (_start * _padding), '#0064ab');
            this.events.add(wcEvent);
        };

        this.addEvent(this.events.getArray());
    };

    /**
     * Add An Event
     * Add a new event to the resource.
     * @param {ahc.WcEvent} [event] Takes a single event, a set of events or an array of events.
     */
    WcResource.prototype.addEvent = function() {
        ahc.arrayArgument(arguments, this, function(obj) {
            obj.top = this.top;
            obj.parent = this;
            this.events.push(obj);
            this.canvas.add(obj);
        });
        this.sortLayers();
    };

    /**
     * Remove An Event
     * Remove an exisiting event from the resource.
     * @param {ahc.WcEvent} [event] Takes a single event, a set of events or an array of events.
     */
    WcResource.prototype.removeEvent = function() {
        ahc.arrayArgument(arguments, this, function(obj) {
            this.canvas.remove(obj);
        });
    };

    return WcResource;

}(fabric.Rect));
ahc.WcResource = WcResource;



// Not sure this is the way to go yet.
ahc.wallchart = {};

ahc.wallchart.SCHEDULE = function(options) {
    return new Wallchart('wallchart', options);
}

ahc.wallchart.DIARY = function(options) {
    return new Wallchart('wallchart', options);
}

ahc.wallchart.HEAT = function(options) {
    return new Wallchart('wallchart', options);
}



/**
 * WallChart
 * @constructor
 * @param {String} [elementName] The name of the wallchat HTML element.
 * @param {Object} [options] Options for wallchart.
 */
var Wallchart = (function() {

    function today() {
        var _now = new Date();
        return new Date(_now.getYear(), _now.getMonth(), _now.getDate(), 0, 0, 0, 0);
    };

    function Wallchart(elementName, options) {
        if (!(this instanceof Wallchart)) {
            return new Wallchart(elementName, options);
        }

        wc = this;

        if (!options) options = {};

        var type = options.type || ahc.wallchart.SCHEDULE;

        this.currentEvent; // This is the currently selected event.
        this.selectedResource; // This is the currently focused resource.

        // Options
        this.pixelsPerHour = options.zoom = options.zoom || 50;
        this.padding = options.zoom = options.zoom || 50;
        this.height = options.lineHeight = options.lineHeight || 50;
        this.headerHeight = options.headerHeight = options.headerHeight || 30;
        this.startTime = options.start = options.start || today();

        // Internals
        this.resources = [];
        this.canvas = new fabric.Canvas(elementName);

        fabric.Object.prototype.transparentCorners = true;

        //
        // TIME MARKS
        //
        var rsrcCanvas = new fabric.StaticCanvas();
        rsrcCanvas.add(new fabric.Line([-1, (this.height / 2), -1, -(this.height / 2)], {
            fill: 'darkgrey',
            stroke: 'darkgrey',
            strokeWidth: 1,
            selectable: false
        }));
        this.pattern = new fabric.Pattern({
            source: function() {
                rsrcCanvas.setDimensions({
                    width: wc.padding,
                    height: 100
                });
                return rsrcCanvas.getElement();
            },
            repeat: 'repeat'
        });

        var hdrCanvas = new fabric.StaticCanvas();
        hdrCanvas.add(new fabric.Rect({
            left: 1,
            width: 100,
            height: this.headerHeight - 2,
            fill: '#12476E'
        }));
        this.canvas.add(new fabric.Rect(ahc.mixin({
            left: 0,
            width: 130,
            height: this.headerHeight,
            fill: '#0064ab'
        }, ahc.unmovableObject)));
        this.canvas.add(new fabric.Rect(ahc.mixin({
            left: 130,
            width: 900,
            height: this.headerHeight,
            fill: new fabric.Pattern({
                source: function() {
                    hdrCanvas.setDimensions({
                        width: wc.padding,
                        height: wc.headerHeight
                    });
                    return hdrCanvas.getElement();
                },
                repeat: 'repeat'
            })
        }, ahc.unmovableObject)));

        // The time marks collection.
        this.timeMarks = [];

        // Add the time slots.
        this.setTimeMarks();

        //
        // MAIN
        //
        this.canvas.on({
            'object:moving': onMove,
            'object:scaling': onChange,
            'object:selected': onSelect
        });

        /**
         * Collision Detection
         * See if the current event passed to the function has any collisions and call events collision method.
         * @param {current} Selected Event.
         * @return {undefined} Nothing
         */
        function collisionDetection(current) {
            var _collided = [];
            wc.canvas.forEachObject(function(obj) {
                if (obj !== current && obj instanceof ahc.WcEvent && current instanceof ahc.WcEvent) {
                    if (current.intersectsWithObject(obj)) {
                        _collided.push(obj);
                        current.bringToFront();
                        current.parent.sortLayers();
                    }
                }

            });
            current.collisionWithEvent(_collided);
        };

        /**
         * On Canvas Object Move
         * @param {options} The event options sent from the fabirc event handler.
         * @return {undefined} Nothing
         */
        function onMove(options) {
            var _current = options.target;

            // -> Here we need to do the snap to resource type action.

            // Update data start and finish.
            if (_current instanceof ahc.WcEvent) {}

            // Collision detection.
            collisionDetection(_current);
            _current.setCoords();
        };

        /**
         * On Canvas Object Changed
         * @param {options} The event options sent from the fabirc event handler.
         * @return {undefined} Nothing
         */
        function onChange(options) {
            var _current = options.target;

            // -> Anything to do with general resizing of the event.

            // Update data start and finish.
            if (_current instanceof ahc.WcEvent) {}

            // Collision detection.
            collisionDetection(_current);
            _current.setCoords();
        };

        /**
         * On Canvas Object Selected
         * @param {options} The event options sent from the fabirc event handler.
         * @return {undefined} Nothing
         */
        function onSelect(options) {
            var _obj = options.target;
            wc.currentEvent = null;
            if (_obj instanceof ahc.WcResource) {
                wc.selectedResource = options;
                return;
            }
            if (_obj instanceof ahc.WcEvent) {
                wc.currentEvent = options;
                return;
            }
            _obj.setCoords();
        };

        /**
         * Keyboard Event Binder
         * This method is for capturing the keyboard events consumed by the browser.
         * @param {undefined} Nothing
         * @return {undefined} Nothing
         */
        (function() {
            var _key;
            window.onkeydown = function(e) {
                if (e.key !== _key) {
                    if (e.key === 'Del') wc.delete();
                    if (_key === 'Control') {
                        if (e.key === 'c') wc.copy();
                        if (e.key === 'v') wc.paste();
                        if (e.key === 'x') wc.cut();
                    }
                    _key = e.key;
                }
            };
            window.onkeyup = function(e) {
                _key = null;
            };
        }());
    };


    /**
     * Add Resource
     * @param {ahc.Resource} [resources] Add resources as single, multiple or array.
     */
    Wallchart.prototype.addResource = function() {
        ahc.arrayArgument(arguments, this, function(obj) {
            var _resource = new ahc.WcResource(this, obj, (this.resources.length * this.height) + this.headerHeight, this.pattern);
            obj.events.addHandler(new ahc.Hand(_resource, _resource.eventsChanged));
            this.resources.push(_resource);
        });
        this.canvas.forEachObject(function(obj) {
            obj.setCoords();
        });
    };


    /**
     * Remove Resource
     * @param {ahc.Resource} [resources] Remove resources as single, multiple or array.
     */
    Wallchart.prototype.removeResource = function() {
        ahc.arrayArgument(arguments, this, function(obj) {
            var _i = 0,
                _resource = this.resources.find(function(e, i, a) {
                    _i = i;
                    if (e.data == obj) return e;
                    return false;
                });
            for (var i = 0; i < this.resources.length; i++) {
                if (i >= _i) this.resources[i].setVertical(this.resources[i].top - this.height);
            };
            _resource.remove();
            ahc.remove(this.resources, _resource);
        });
        this.canvas.forEachObject(function(obj) {
            obj.setCoords();
        });
    };


    /**
     * Change the Zoom Level
     * @param {Number} [pxPerHr] The number of pixels per hour of time.
     */
    Wallchart.prototype.changeZoom = function(pxPerHr) {
        var _original = this.pixelsPerHour,
            _scale = (pxPerHr / _original);

        // Will need to set the padding dependant on time marks .
        this.pixelsPerHour = pxPerHr;

        // Scale the events.
        this.canvas.forEachObject(function(obj) {
            if (obj instanceof ahc.WcEvent) {
                obj.setWidth(obj.width * _scale);
                obj.setLeft(obj.left * _scale);
                obj.setCoords();
            }
        });

        // Adjust the time marks.
        this.setTimeMarks();

        // Tell the canvas to re-render itself.
        this.canvas.renderAll();
    };


    /**
     * Sets The Wllachart Time Marks
     */
    Wallchart.prototype.setTimeMarks = function() {
        var _px = this.pixelsPerHour,
            _canvas = this.canvas,
            _sectorLookupIndex = 0,
            _lpos = 0,
            _last = new Date(this.startTime); // Default to hours for now.

        // Map current pixels per hour to sector lookup.
        var _pixelsLookup = ahc.sectorLookup.map(function(o) {
            return _px / o;
        })

        // Find out the most appropriate sector type.
        var _sectorLookupWidth = _pixelsLookup.find(function(element, index, array) {
            if (element >= 40 && element <= 80) {
                _sectorLookupIndex = index;
                return element;
            }
            return false;
        });

        if (!_sectorLookupWidth) _sectorLookupWidth = _pixelsLookup[_sectorLookupIndex];

        var gen = function(last) {
            return ahc.timeTextGenerator[_sectorLookupIndex](last);
        };

        this.padding = _sectorLookupWidth;

        if (this.timeMarks.length < 1) {
            // // If it is the first run..
            for (var i = 0; i < 30; i++) {
                var _timeMark = new fabric.Text(ahc.parseTimeToString(_last), ahc.mixin({
                    fontFamily: 'consolas',
                    left: 130 + _lpos + 2,
                    top: (this.headerHeight * 0.2),
                    fill: '#FFF',
                    backgroundColor: '#12476E',
                    fontSize: 12,
                }, ahc.unmovableObject));
                this.canvas.add(_timeMark);
                this.timeMarks.push(_timeMark);
                _last = gen(_last);
                _lpos = _lpos + _sectorLookupWidth;
            };
        } else {
            // Move the old ones.
            for (var j = 0; j < this.timeMarks.length; j++) {
                this.timeMarks[j].setText(ahc.parseTimeToString(_last));
                this.timeMarks[j].setLeft(130 + _lpos + 2);
                _last = gen(_last);
                _lpos = _lpos + _sectorLookupWidth;
            }
        }
    };


    /**
     * Cut Event Recieved.
     */
    Wallchart.prototype.cut = function() {
        this.currentClone = this.currentEvent.target;
        this.selectedResource.target.removeEvent(this.currentClone);
    };


    /**
     * Copy Event Recieved
     */
    Wallchart.prototype.copy = function() {
        this.currentClone = this.currentEvent.target;
    };


    /**
     * Paste Event Recieved
     */
    Wallchart.prototype.paste = function() {
        var _obj = {};
        ahc.extend(_obj, this.currentClone.data.data);
        var _booking = new ahc.Booking(_obj);
        this.selectedResource.target.data.addEvent(_booking);
    };


    /**
     * Delete Event Recieved
     */
    Wallchart.prototype.delete = function() {
        if (this.currentEvent) this.selectedResource.target.removeEvent(this.currentEvent.target);
    };

    return Wallchart;

})();
ahc.Wallchart = Wallchart;