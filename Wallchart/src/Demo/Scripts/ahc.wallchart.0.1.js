/** @module ahc/wallchart */

ahc = ahc || {};

ahc.wallchart = {
    sectorLookup: [12, 6, 4, 2, 1, 0.5, 0.33333, 0.16667, 0.08333, 0.04167, 0.00595],
    timeTextGenerator: [

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
        }
    ],
    unmovableObject: {
        hasControls: false,
        hasBorders: false,
        lockMovementY: true,
        lockMovementX: true
    },
    MARGIN_WIDTH: 130,
    DIARY: 0,
    SCHEDULE: 1,
    factory: function(type, name, options) {
        switch (type) {
            case this.SCHEDULE:
                return new ahc.Schedule(name, options);
            case this.DIARY:
                return new ahc.Diary(name, options);
            default:
                throw new ahc.ex.ArgumentException('type');
        }
    }
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
 * @param {Object} [parent] Event Parent.
 */
var WcEvent = (function(_base) {
    'use strict';
    ahc.extend(WcEvent, _base);
    ahc.mixin(WcEvent.prototype, WcObject.prototype);

    function WcEvent(data, width, height, start, parent) {
        if (!(this instanceof WcEvent)) {
            return new WcEvent(data, width, height, start, parent);
        }

        // This could be contained in the wallchart parent at config time.
        var backGroundColor = ahc.getCssColour(parent.parent.style.event, 'backgroundColor', '#0064AB'),
            borderColor = ahc.getCssColour(parent.parent.style.event, 'borderTopColor', '#00487A');

        _base.call(this, {
            height: height - 2,
            hasRotatingPoint: false,
            hasBorders: false,
            lockRotation: true,
            lockScalingY: true,
            strokeWidth: 1,
            stroke: borderColor
        });

        this.setControlsVisibility({
            tl: false,
            tr: false,
            br: false,
            bl: false,
            ml: true,
            mt: false,
            mr: true,
            mb: false,
            mtr: false
        });

        this.data = data;
        this.parent = parent;

        this.desiredFill = backGroundColor;
        this.currentCollsions = [];

        // Set the fill, this could be a pattern.
        this.setFill(this.desiredFill);

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

            // Call any handlers.

        } else {
            // No Collisions Handle.
            this.fill = this.desiredFill;

            // Handle any extra logic for not having any collisions.

            // Call any handlers.
        }

        // Notify the data of collisions
        if (this.data.colliedWith) this.data.colliedWith(this.currentCollisions.map(function(o) {
            return o.data;
        }));
    }

    return WcEvent;

}(fabric.Rect));
ahc.WcEvent = WcEvent;


/**
 * WcResource
 * @constructor
 * @extends fabric.Rect
 * @param {ahc.WallChart} [parent] The parent wallchart.
 * @param {Object} [data] The resource data.
 */
var WcResource = (function(_base) {
    'use strict';
    ahc.extend(WcResource, _base);
    ahc.mixin(WcResource.prototype, WcObject.prototype);

    function WcResource(parent, data) {
        if (!(this instanceof WcResource)) {
            return new WcResource(parent, data);
        }
        _base.call(this, ahc.mixin({
            width: parent.canvas.width,
            left: ahc.wallchart.MARGIN_WIDTH
        }, ahc.wallchart.unmovableObject));

        this.canvas = parent.canvas;
        this.parent = parent;

        this.setTop(0 + parent.headerHeight);
        this.setFill(parent.pattern);

        // The main object.
        this.data = data;

        // Might need to store the local Events for he resource.
        this.events = new ahc.ObservableArray();
    }

    /**
     * Add An Event
     * Add a new event to the resource.
     * @param {ahc.WcEvent} [event] Takes a single event, a set of events or an array of events.
     */
    WcResource.prototype.addEvent = function() {
        ahc.arrayArgument(arguments, this, function(obj) {
            obj.top = this.getTop(obj) + 1;
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
            var wcEvent = new ahc.WcEvent(_newEvents[i], (_finish - _start) * _padding + 1, this.parent.height, ahc.wallchart.MARGIN_WIDTH + (_start * _padding), this);
            this.events.add(wcEvent);
        };

        this.addEvent(this.events.getArray());
    };

    /**
     * Remove the resource from the wallchart.
     */
    WcResource.prototype.remove = function() {
        // The resource needs to add itself to the canvas.
        this.removeEvent(this.events.getArray());
        this.events.clear();
        this.canvas.remove(this);
    };

    /**
     * Get Top
     * Gets the vertical position of events in the resource.
     */
    WcResource.prototype.getTop = function() {
        return this.top;
    };

    /**
     * Sort Layers
     * Sort the canvas objects that are contents of the rsource. To prevent overlap.
     */
    WcResource.prototype.sortLayers = function() {
        this.canvas.sendToBack(this);
    };

    return WcResource;
}(fabric.Rect));
ahc.WcResource = WcResource;


/**
 * WcDiaryResource
 * @constructor
 * @extends fabric.Rect
 * @param {ahc.WallChart} [parent] The parent wallchart.
 * @param {Object} [data] The resource data.
 * @param {Number} [top] The top position in the parent canvas.
 */
var WcDiaryResource = (function(_base) {
    'use strict';
    ahc.extend(WcDiaryResource, _base);

    function WcDiaryResource(parent, data, top) {
        if (!(this instanceof WcDiaryResource)) {
            return new WcDiaryResource(parent, data, top);
        }
        _base.call(this, parent, data);

        this.setHeight(parent.height);

        this.text = new fabric.Text(ahc.padRight(16, data.name, ' '), ahc.mixin({
            fontFamily: 'Arial',
            left: 10,
            fill: '#FFF',
            backgroundColor: 'transparent',
            fontSize: 14,
        }, ahc.wallchart.unmovableObject));

        this.cover = new fabric.Rect(ahc.mixin({
            top: top,
            width: ahc.wallchart.MARGIN_WIDTH,
            height: parent.height,
            left: 0,
            fill: ahc.getCssColour(parent.style.resource, 'backgroundColor', '#0064AB'),
            stroke: ahc.getCssColour(parent.style.resource, 'borderTopColor', '#FFF'),
            strokeWidth: 1
        }, ahc.wallchart.unmovableObject));

        this.text.setTop( /* Resource Top */ top + /* Resource Height */ (this.parent.height * 0.5) - /* Inner Text */ (this.text.getHeight() * 0.5) - /* Offset */ 2);

        this.setTop(top);

        // The resource needs to add itself to the canvas.
        this.canvas.add(this);
        this.canvas.add(this.cover);
        this.canvas.add(this.text);

        this.eventsChanged();
    }

    /**
     * Override - Removes the resource from the walchart.
     */
    WcDiaryResource.prototype.remove = function() {
        // The resource needs to add itself to the canvas.
        this.removeEvent(this.events.getArray());
        this.events.clear();
        this.canvas.remove(this);
        this.canvas.remove(this.cover);
        this.canvas.remove(this.text);
    };

    /**
     * Override - Sets vertical position of all events.
     */
    WcDiaryResource.prototype.setVertical = function(top) {
        this.setTop(top);
        this.text.setTop(top + (this.parent.height * 0.5) - (this.text.getHeight() * 0.5) - 2);
        this.cover.setTop(top);
        var _events = this.events.getArray();
        for (var i = 0; i < _events.length; i++) {
            _events[i].setTop(top);
        };
    };

    /**
     * Override - Sort Layers
     * Sort the canvas objects that are contents of the rsource. To prevent overlap.
     */
    WcDiaryResource.prototype.sortLayers = function() {
        this.canvas.sendToBack(this);
        this.canvas.bringToFront(this.cover);
        this.canvas.bringToFront(this.text);
    };

    return WcDiaryResource;

}(ahc.WcResource));
ahc.WcDiaryResource = WcDiaryResource;



/**
 * WcScheduleResource
 * @constructor
 * @extends fabric.Rect
 * @param {ahc.WallChart} [parent] The parent wallchart.
 * @param {Object} [data] The resource data.
 * @param {Number} [top] The top position in the parent canvas.
 */
var WcScheduleResource = (function(_base) {
    'use strict';
    ahc.extend(WcScheduleResource, _base);

    function WcScheduleResource(parent, data) {
        if (!(this instanceof WcScheduleResource)) {
            return new WcScheduleResource(parent, data);
        }
        _base.call(this, parent, data);

        this.setHeight(parent.canvas.height);
        this.eventsChanged();
    }

    /**
     * Override - Sets vertical position of all events.
     */
    WcScheduleResource.prototype.setVertical = function(top) {
        this.setTop(top);
        var _events = this.events.getArray();
        for (var i = 0; i < _events.length; i++) {
            _events[i].setTop(top);
        };
    };

    /**
     * Override - Gets the top position of the resource events.
     */
    WcScheduleResource.prototype.getTop = function(obj) {
        return (obj.data.start.value.getDay(this.parent.startDay) * this.parent.height) + this.parent.headerHeight;
    };

    return WcScheduleResource;

}(ahc.WcResource));
ahc.WcScheduleResource = WcScheduleResource;



/**
 * WallChart
 * @constructor
 * @param {String} [elementName] The name of the wallchat HTML element.
 * @param {Object} [options] Options for wallchart.
 */
var Wallchart = (function() {

    function start() {
        var _now = new Date();
        return new Date(_now.getFullYear(), _now.getMonth(), _now.getDate(), 0, 0, 0, 0);
    }

    function Wallchart(elementName, options) {
        if (!(this instanceof Wallchart)) {
            return new Wallchart(elementName, options);
        }

        wc = this;

        this.name = elementName;


        // Options
        if (!options) options = {};
        this.pixelsPerHour = options.zoom = options.zoom || 50;
        this.padding = options.zoom = options.zoom || 50;
        this.height = options.lineHeight = options.lineHeight || 50;
        this.headerHeight = options.headerHeight = options.headerHeight || 30;
        this.startTime = options.start = options.start || start();


        // Internals
        var _currentClone;
        this.currentEvent; // This is the currently selected event.
        this.selectedResource; // This is the currently focused resource.
        this.resources = [];
        this.canvas = _canvas = new fabric.Canvas(this.name);

        this.style = {};
        this.style.header = this.getHeaderStyle();
        this.style.resource = this.getResourceStyle();
        this.style.event = this.getEventStyle();


        //
        // TIME MARKS
        //

        var resourceBackground = ahc.getCssColour(this.style.resource, 'backgroundColor', '#0064AB');
        var headerBackground = ahc.getCssColour(this.style.header, 'backgroundColor', '#0064AB');

        // The resource texture.
        this._rsrcCanvas = new fabric.StaticCanvas();
        this._rsrcCanvas.add(ahc.mixin(new fabric.Line([-1, (this.height), -1, -(this.height)], {
            fill: resourceBackground,
            stroke: resourceBackground,
            strokeWidth: 1,
            hasControls: false,
            selectable: false
        }), ahc.unmovableObject));
        this._rsrcCanvas.add(ahc.mixin(new fabric.Line([100, -1, -0, -1], {
            fill: resourceBackground,
            stroke: resourceBackground,
            strokeWidth: 1,
            hasControls: false,
            selectable: false
        }), ahc.unmovableObject));
        this.pattern = new fabric.Pattern({
            source: function() {
                wc._rsrcCanvas.setDimensions({
                    width: wc.padding,
                    height: wc.height
                });
                return wc._rsrcCanvas.getElement();
            },
            repeat: 'repeat'
        });

        // The top left corner.
        this.canvas.add(new fabric.Rect(ahc.mixin({
            left: 0,
            width: ahc.wallchart.MARGIN_WIDTH,
            height: this.headerHeight,
            fill: headerBackground,
            selectable: false
        }, ahc.wallchart.unmovableObject)));
        this.canvas.add(new fabric.Text('Day/Time', ahc.mixin({
            fontFamily: 'Arial',
            left: 10,
            top: (this.headerHeight * 0.2),
            fill: '#000',
            backgroundColor: 'transparent',
            fontSize: 12,
        }, ahc.wallchart.unmovableObject)));

        // The time marks collection.
        this.timeMarks = [];

        // Add the time slots.
        this.setTimeMarks();

        //
        // MAIN
        //
        this.canvas.on({
            'mouse:down': mouseDown,
            'mouse:up': mouseUp,
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
            // Create the list of possible collsions
            var _collided = [];

            wc.canvas.forEachObject(function(obj) {
                if (obj !== current && obj instanceof ahc.WcEvent && current instanceof ahc.WcEvent) {

                    // Check intersection
                    if (current.intersectsWithObject(obj)) {

                        // Add the new collison and sort layers.
                        _collided.push(obj);
                        current.bringToFront();
                        current.parent.sortLayers();
                    }
                }

            });

            // Notify events of collisions.
            if (current.collisionWithEvent) current.collisionWithEvent(_collided);
        };

        /**
         * On Canvas Object Mouse Down
         * @param {Object} [options] The event options sent from the fabirc event handler.
         */
        function mouseDown(options) {
            // Maybe nothing needed here.
        };

        /**
         * On Canvas Object Mouse Up
         * @param {Object} [options] The event options sent from the fabirc event handler.
         */
        function mouseUp(options) {
            var _current = options.target;

            if (_current instanceof WcEvent) {

                _current.hasControls = true;

                // If the object intersects with old, just ignore the move?
                var _left = _current.getLeft();

                if ((_currentClone && _current.intersectsWithObject(_currentClone)) ||  // Intersects with itself.
                    (_left < ahc.wallchart.MARGIN_WIDTH) ||                             // Intersects with the resource headers.
                    (_left + _current.getWidth() > wc.canvas.width) ||                  // Intersects with the edge.
                    (_current.getTop() < wc.headerHeight)) {                            // Intersects with the header.

                    // Cancel the action.

                    // Add the event back in to the resource as it knows how to handle this best.

                    _current.parent.data.removeEvent(_current.data);
                    _current.parent.data.addEvent(_current.data);

                } else {

                    // If the mouse up is not from a select action.

                    if (!wc.select) {

                        // Complete the move.

                        // Find the closest resource to add to.
                        var mouseY = options.e.layerY,
                            resource = wc.getResources().find(function(e, i, a) {
                                if (mouseY > e.top && (e.top + e.getHeight()) > mouseY) {
                                    return e;
                                }
                                return false;
                            });

                        // Create the new booking (transfer the data). 

                        if (resource) {

                            wc.setTimeOnMove(_current);

                            // Add the new event.
                            _current.parent.data.removeEvent(_current.data);
                            resource.data.addEvent(_current.data);
                        }
                    }
                }

                // Remove the ghosts.
                _canvas.remove(_currentClone);

                _canvas.renderAll();

                _currentClone = null;

                wc.select = false;
            }
        };

        /**
         * On Canvas Object Move
         * @param {Object} [options] The event options sent from the fabirc event handler.
         */
        function onMove(options) {
            var _current = options.target;

            wc.select = false;

            _current.setCoords();

            if (_current instanceof WcEvent) {

                if (!_currentClone) {

                    // Create placeholder for the old position.

                    _currentClone = _current.clone();

                    _currentClone.setOpacity('0.6');

                    _current.hasControls = false;

                    _canvas.add(_currentClone);

                    // Create the ghost (opacity of the selected object).

                    _current.setOpacity('0.4');

                    _canvas.renderAll();
                }

                // Collision detection.
                collisionDetection(_current);
            }
        };

        /**
         * On Canvas Object Changed
         * @param {Object} [options] The event options sent from the fabirc event handler.
         */
        function onChange(options) {
            var _current = options.target;

            // -> Anything to do with general resizing of the event.
            _current.setCoords();

            // Collision detection.
            collisionDetection(_current);
        };

        /**
         * On Canvas Object Selected
         * @param {Object} [options] The event options sent from the fabirc event handler.
         */
        function onSelect(options) {
            var _obj = options.target;
            wc.currentEvent = null;

            // If the selected object is resource
            if (_obj instanceof ahc.WcResource) {
                wc.selectedResource = options;
                wc.select = true;
                return;
            }

            // If the selected object is an event.
            if (_obj instanceof ahc.WcEvent) {
                wc.currentEvent = options;
                wc.select = true;
                return;
            }

            // Set coords if not redrawing.
            _obj.setCoords();
        };

        /**
         * Keyboard Event Binder
         * This method is for capturing the keyboard events consumed by the browser.
         * @param {undefined} Nothing
         * @return {undefined} Nothing
         */
        (function() {
            var _key = null;
            window.onkeydown = function(e) {
                if (e.key !== _key) {
                    if (e.keyCode === 46) wc.delete();
                    if (_key && _key.ctrlKey) {
                        if (e.keyCode === 67) wc.copy();
                        if (e.keyCode === 86) wc.paste();
                        if (e.keyCode === 88) wc.cut();
                    }
                    _key = e;
                }
            };
            window.onkeyup = function(e) {
                _key = null;
            };
        }());
    };


    Wallchart.prototype.getHeaderStyle = function() {
        return document ? ahc.getCss(document.getElementById(this.name + 'Header')) : {};
    };

    Wallchart.prototype.getResourceStyle = function() {
        return document ? ahc.getCss(document.getElementById(this.name + 'Resource')) : {};
    };

    Wallchart.prototype.getEventStyle = function() {
        return document ? ahc.getCss(document.getElementById(this.name + 'Event')) : {};
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
                obj.setLeft(((obj.left - ahc.wallchart.MARGIN_WIDTH) * _scale) + ahc.wallchart.MARGIN_WIDTH);
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
        var _pixelsLookup = ahc.wallchart.sectorLookup.map(function(o) {
            return _px / o;
        })

        // Find out the most appropriate sector type.
        var _sectorLookupWidth = _pixelsLookup.find(function(e, i, a) {
            if (e >= 40 && e <= 80) {
                _sectorLookupIndex = i;
                return e;
            }
            return false;
        });

        // Create the generator function for our new values.
        if (!_sectorLookupWidth) _sectorLookupWidth = _pixelsLookup[_sectorLookupIndex];
        var gen = function(last) {
            return ahc.wallchart.timeTextGenerator[_sectorLookupIndex](last);
        };

        this.padding = _sectorLookupWidth;

        if (this.timeMarks.length < 1) {
            // // If it is the first run..
            var _flip = false;
            for (var i = 0; i < 30; i++) {
                var _timeMark = new fabric.Text(ahc.parseTimeToString(_last), ahc.mixin({
                        fontFamily: 'Arial',
                        left: ahc.wallchart.MARGIN_WIDTH + _lpos + 2,
                        top: (this.headerHeight * 0.2),
                        fill: '#000',
                        backgroundColor: 'transparent',
                        fontSize: 12,
                    }, ahc.wallchart.unmovableObject)),
                    _cover = new fabric.Rect(ahc.mixin({
                        selectable: false,
                        hasControls: false,
                        top: 0,
                        width: this.padding,
                        height: this.headerHeight - 1,
                        left: ahc.wallchart.MARGIN_WIDTH + _lpos,
                        fill: ahc.getCssColour(this.style.header, 'backgroundColor', '#0064AB'),
                        stroke: ahc.getCssColour(this.style.header, 'borderTopColor', '#FFFFFF'),
                        strokeWidth: 1,
                        opacity: _flip ? 1 : 0.5
                    }, ahc.wallchart.unmovableObject));

                this.canvas.add(_cover);
                this.canvas.add(_timeMark);
                this.timeMarks.push({
                    time: _timeMark,
                    cover: _cover
                });
                _last = gen(_last);
                _lpos = _lpos + _sectorLookupWidth;
                _flip = !_flip;
            };
        } else {
            // Move the old ones.
            for (var j = 0; j < this.timeMarks.length; j++) {
                this.timeMarks[j].time.setText(ahc.parseTimeToString(_last));
                this.timeMarks[j].time.setLeft(ahc.wallchart.MARGIN_WIDTH + _lpos + 2);
                this.timeMarks[j].cover.setWidth(this.padding);
                this.timeMarks[j].cover.setLeft(ahc.wallchart.MARGIN_WIDTH + _lpos);
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
        ahc.mixin(_obj, this.currentClone.data.data);
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
}());
ahc.Wallchart = Wallchart;



/**
 * Diary - WallChart
 * @constructor
 * @param {String} [elementName] The name of the wallchat HTML element.
 * @param {Object} [options] Options for wallchart.
 */
Diary = (function(_base) {
    'use strict';
    ahc.extend(Diary, _base);

    function Diary(elementName, options) {
        if (!(this instanceof Diary)) {
            return new Diary(elementName, options);
        }
        _base.call(this, elementName, options);

        this.resources = [];
    }

    /**
     * Set the booking start times on a move.
     * @param {Object} [options] The event options sent from the fabirc event handler.
     */
    Diary.prototype.setTimeOnMove = function(current) {

        // Convert the data using times of the left and right pos of element.
        var startPx = (current.getLeft() - ahc.wallchart.MARGIN_WIDTH) / this.pixelsPerHour,
            finishPx = ((current.getLeft() + current.getWidth()) - ahc.wallchart.MARGIN_WIDTH) / this.pixelsPerHour,
            startTimeInMills = /* Hours */ (Math.floor(startPx) * 3600000) + /* Minutes */ (Math.round(startPx % 1 * 60) * 60000),
            finishTimeInMills = /* Hours */ (Math.floor(finishPx) * 3600000) + /* Minutes */ (Math.round(finishPx % 1 * 60) * 60000);

        current.data.start.value = new Date(this.startTime).addMilliseconds(startTimeInMills);
        current.data.finish.value = new Date(this.startTime).addMilliseconds(finishTimeInMills);
    }

    /**
     * Get THe Resources As Array
     */
    Diary.prototype.getResources = function() {
        return this.resources;
    };

    /**
     * Add Resource
     * @param {ahc.Resource} [resources] Add resources as single, multiple or array.
     */
    Diary.prototype.addResource = function() {
        ahc.arrayArgument(arguments, this, function(obj) {
            var _resource = new ahc.WcDiaryResource(this, obj, (this.resources.length * this.height) + this.headerHeight);
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
    Diary.prototype.removeResource = function() {
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

    return Diary;
}(ahc.Wallchart));
ahc.Diary = Diary;


/**
 * Schedule - WallChart
 * @constructor
 * @param {String} [elementName] The name of the wallchat HTML element.
 * @param {Object} [options] Options for wallchart.
 */
Schedule = (function(_base) {
    'use strict';
    ahc.extend(Schedule, _base);

    var weekStartTime = function(startDate, startDay) {
        var _d = startDate,
            _day = _d.getDay(startDay),
            _diff = _d.getDate() - _day,
            _res = new Date(_d.setDate(_diff));

        return new Date(_res.getFullYear(), _res.getMonth(), _res.getDate(), 0, 0, 0, 0);
    };

    function Schedule(elementName, options) {
        if (!(this instanceof Schedule)) {
            return new Schedule(elementName, options);
        }

        // Set the start day for the schedule, before the base sets time marks.
        this.startDay = options.startDay = options.startDay || 'monday';
        options.start = weekStartTime(options.startTime || new Date(), this.startDay);

        // Apply the base to the new object.
        _base.call(this, elementName, options);

        var dayBackground = ahc.getCssColour(this.style.resource, 'backgroundColor', '#0064AB'),
            // Find the real start day.
            _j = ahc.days.indexOf(this.startDay);

        for (var i = 0; i < ahc.days.length; i++) {
            var top = (i * this.height) + this.headerHeight,
                text = new fabric.Text(ahc.toTitleCase(ahc.padRight(16, ahc.days[((_j + i) % ahc.days.length)], ' ')), ahc.mixin({
                    fontFamily: 'Arial',
                    left: 10,
                    fill: '#FFF',
                    backgroundColor: 'transparent',
                    fontSize: 14,
                    selectable: false
                }, ahc.wallchart.unmovableObject)),
                cover = new fabric.Rect(ahc.mixin({
                    top: top,
                    width: ahc.wallchart.MARGIN_WIDTH,
                    height: this.height,
                    left: 0,
                    fill: dayBackground,
                    selectable: false,
                    stroke: ahc.getCssColour(this.style.resource, 'borderColor', '#FFF'),
                    strokeWidth: 1,
                }, ahc.wallchart.unmovableObject));

            text.setTop(top + (this.height * 0.5) - (text.getHeight() * 0.5) - 2);

            // The resource needs to add itself to the canvas.
            this.canvas.add(cover);
            this.canvas.add(text);
        };

        this.resource = {};
    }

    /**
     * Set the booking start times on a move.
     * @param {Object} [options] The event options sent from the fabirc event handler.
     */
    Schedule.prototype.setTimeOnMove = function(current) {

        // Convert the data using times of the left and right pos of element.
        var startPx = (current.getLeft() - ahc.wallchart.MARGIN_WIDTH) / this.pixelsPerHour,
            finishPx = ((current.getLeft() + current.getWidth()) - ahc.wallchart.MARGIN_WIDTH) / this.pixelsPerHour,
            dayNew = Math.round((current.top - this.headerHeight) / this.height),
            startTimeInMills = /* Hours */ (Math.floor(startPx) * 3600000) + /* Minutes */ (Math.round(startPx % 1 * 60) * 60000),
            finishTimeInMills = /* Hours */ (Math.floor(finishPx) * 3600000) + /* Minutes */ (Math.round(finishPx % 1 * 60) * 60000);

        current.data.start.value = new Date(this.startTime).addMilliseconds(startTimeInMills).addDays(dayNew);
        current.data.finish.value = new Date(this.startTime).addMilliseconds(finishTimeInMills).addDays(dayNew);
    }

    /**
     * Get The Resources As An Array.
     */
    Schedule.prototype.getResources = function() {
        return [this.resource];
    };

    /**
     * Add Resource
     * @param {ahc.Resource} [resources] Add resources as single, multiple or array.
     */
    Schedule.prototype.addResource = function(resource) {
        if (this.resource.remove) {
            this.resource.remove();
        }

        var _resource = new ahc.WcScheduleResource(this, resource);
        resource.events.addHandler(new ahc.Hand(_resource, _resource.eventsChanged));
        this.resource = _resource;
        this.canvas.forEachObject(function(obj) {
            obj.setCoords();
        });
    };

    /**
     * Remove Resource
     * @param {ahc.Resource} [resources] Remove resources as single, multiple or array.
     */
    Schedule.prototype.removeResource = function() {
        this.resource.remove();
        this.canvas.forEachObject(function(obj) {
            obj.setCoords();
        });
    };

    return Schedule;
}(ahc.Wallchart));
ahc.Schedule = Schedule;