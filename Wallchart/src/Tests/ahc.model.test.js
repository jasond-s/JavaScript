'use strict';

//
//
/** @module test/ahc/model */
//
//

console.log('module test/ahc/model: ' + new Date());

describe('ahc.Eventbase', function() {
    var test = this,
        _myEvent = {},
        _myData = {},
        _now = new Date(1990, 1, 1, 1, 1, 1, 1);

    beforeEach(function() {
        _myData = {
            start: _now,
            finish: _now
        };
        _myEvent = new ahc.Eventbase(_myData);
    });

    describe('stores the ref to event data', function() {
        it('data should contain observable start', function() {
            expect(_myEvent.start.value.getTime()).toBe(_now.getTime());
        });

        it('data should contain observable finish', function() {
            expect(_myEvent.finish.value.getTime()).toBe(_now.getTime());
        });
    });
});

describe('ahc.Booking', function() {
    var test = this,
        _myEvent = {},
        _myData = {},
        _now = new Date(1990, 1, 1, 1, 1, 1, 1);

    beforeEach(function() {
        _myData = {
            start: _now,
            finish: _now
        };
        _myEvent = new ahc.Booking(_myData);
    });

    describe('requires data to construct', function() {
        it('should throw an exception if data is no specified', function() {
            expect(function() {
                new ahc.Booking()
            }).toThrow();
        });
    });

    describe('stores the ref to event data', function() {
        it('data should contain observable start', function() {
            expect(_myEvent.start.value.getTime()).toBe(_now.getTime());
        });

        it('data should contain observable finish', function() {
            expect(_myEvent.finish.value.getTime()).toBe(_now.getTime());
        });
    });
});

describe('ahc.Resource', function() {
    var test = this,
        _myResource = {},
        _myRData = {},
        _myEvent = {},
        _myEData = {},
        _now = new Date(1990, 1, 1, 1, 1, 1, 1);

    beforeEach(function() {
        _myEData = {
            start: _now,
            finish: _now
        };
        _myEvent = new ahc.Booking(_myEData);

        _myRData = {
            name: 'JOHN'
        };
        _myResource = new ahc.Resource(_myRData);

    });

    describe('requires data to construct', function() {
        it('should throw an exception if data is no specified', function() {
            expect(function() {
                new ahc.Resource()
            }).toThrow();
        });
    });

    describe('stores the ref to resource data', function() {
        it('data should contain name', function() {
            expect(_myResource.name).toBe('JOHN');
        });
    });

    describe('is a container for events', function() {
        describe('the add event method', function() {
            it('should accept events', function() {
                _myResource.addEvent(_myEvent);
                expect(_myResource.events.length).toBe(1);
            });

            it('should accept not accept an untyped object', function() {
                _myResource.addEvent({
                    test: 'test'
                });
                expect(_myResource.events.length).toBe(0);
            });
        });

        describe('the remove evetn method', function() {
            it('should remove exisiting events', function() {
                _myResource.addEvent(_myEvent);
                expect(_myResource.events.length).toBe(1);
                _myResource.removeEvent(_myEvent);
                expect(_myResource.events.length).toBe(0);
            });

            it('should remove not remove events not already present', function() {
                _myResource.addEvent(_myEvent);
                expect(_myResource.events.length).toBe(1);
                _myResource.removeEvent({
                    test: 'test'
                });
                expect(_myResource.events.length).toBe(1);
            });
        });
    });
});