'use strict';

//
//
/** @module test/ahc */
//
//

console.log('module test/ahc: ' + new Date());

describe('ahc date', function() {
    var test = this,
        time = null;

    beforeEach(function() {
        time = new Date(1990, 1, 1, 1, 1, 1, 1);
    });

    describe('add days method', function() {
        it('should add time to input', function() {
            var newTime = time.addDays(1);
            expect(newTime.getDate()).toBe(2)
        });
    });

    describe('add hours method', function() {
        it('should add time to input', function() {
            var newTime = time.addHours(1);
            expect(newTime.getHours()).toBe(2)
        });
    });

    describe('add minutes method', function() {
        it('should add time to input', function() {
            var newTime = time.addMinutes(1);
            expect(newTime.getMinutes()).toBe(2)
        });
    });
});

describe('ahc array', function() {
    var test = this,
        array = [],
        anObject = {
            test: 'test'
        };

    beforeEach(function() {
        array = [];
    });

    describe('add method', function() {
        it('should add values to an array', function() {
            ahc.add(array, anObject);
            expect(array.length).toBe(1);
        });

        it('should not add duplicate items', function() {
            ahc.add(array, anObject);
            ahc.add(array, anObject);
            expect(array.length).toBe(1);
        });
    });

    describe('remove method', function() {
        it('should remove values from an array', function() {
            ahc.add(array, anObject);
            expect(array.length).toBe(1);
            ahc.remove(array, anObject);
            expect(array.length).toBe(0);
        });

        it('should only remove existing items', function() {
            ahc.add(array, anObject);
            ahc.remove(array, {
                test: 'other'
            });
            expect(array.length).toBe(1);
        });
    });
});

describe('ahc parse', function() {
    var test = this,
        time = null;

    beforeEach(function() {
        time = new Date(1990, 1, 1, 1, 1, 1, 1);
    });

    describe('parseTimeToDecimal method', function() {
        it('should parse time to decimal time', function() {
            var out = ahc.parseTimeToDecimal(time).toFixed(4);
            expect(out).toBe('1.0167');
        });
    });

    describe('parseTimeToString method', function() {
        it('should parse time to string', function() {
            var out = ahc.parseTimeToString(time);
            expect(out).toBe('01:01');
        });
    });
});

describe('ahc padding', function() {
    var test = this,
        str = null;

    beforeEach(function() {
        str = 'HelloWorld'
    });

    describe('pad left method', function() {
        it('should pad string to correct length', function() {
            var out = ahc.padLeft(15, str, ' ');
            expect(out.length).toBe(15);
        });
    });

    describe('pad right method', function() {
        it('should pad string to correct length', function() {
            var out = ahc.padRight(15, str, ' ');
            expect(out.length).toBe(15);
        });
    });
});

describe('ahc array argument', function() {
    var test = this,
        someHandler,
        myArray = [];

    this.someMethod = function() {
        arrayArgument(arguments, test, someHandler);
    }

    beforeEach(function() {
        myArray = [];
        someHandler = function(obj) {
            myArray.push(obj);
        };
    });

    // Worth noting that this method for assimilating arguments should not
    // be used with methods that need to accept an array as an argument
    // as it will be flattened by the parser.
    describe('arrayArgument method', function() {
        it('should accept single values', function() {
            test.someMethod({
                test: 'test'
            });
            expect(myArray.length).toBe(1);
        });

        it('should accept multiple values', function() {
            test.someMethod({
                test: 'test'
            }, {
                test: 'test1'
            });
            expect(myArray.length).toBe(2);
        });

        it('should accept an array value', function() {
            test.someMethod([{
                test: 'test'
            }, {
                test: 'test1'
            }]);
            expect(myArray.length).toBe(2);
        });

        it('should accept a mix or argument types', function() {
            test.someMethod({
                test: 'test'
            }, [{
                test: 'test1'
            }, {
                test: 'test2'
            }]);
            expect(myArray.length).toBe(3);
        });

        it('should accept multiple arrays as arguments', function() {
            test.someMethod([{
                test: 'test1'
            }, {
                test: 'test2'
            }], [{
                test: 'test3'
            }, {
                test: 'test4'
            }]);
            expect(myArray.length).toBe(4);
        });
    });
});

describe('ahc.Hand', function() {
    var test = this,
        someHandler;

    this.otherValue = 0;
    var someHandler = new ahc.Hand(test, function() {
        this.otherValue = 1;
    });

    beforeEach(function() {
        test.otherValue = 0;
    });

    describe('should execute methods on given context', function() {
        it('not call functions until commanded with ex', function() {
            expect(test.otherValue).toBe(0)
        });

        it('call context values', function() {
            someHandler.ex();
            expect(test.otherValue).toBe(1)
        });
    });
});

describe('ahc.ObservableVal', function() {
    var test = this,
        anObservable = {};

    this.otherValue = 0;
    var someHandler = new ahc.Hand(test, function() {
        this.otherValue = 1;
    });

    beforeEach(function() {
        test.otherValue = 0;
        anObservable = new ahc.ObservableVal(4);
    });

    describe('should extend Observable', function() {
        it('should be an instance of', function() {
            expect(anObservable instanceof ahc.Observable).toBeTruthy();
        });
    });

    describe('the value set', function() {
        it('should be equal to initial value', function() {
            expect(anObservable.value).toBe(4);
        });

        it('should be equal to ant set value', function() {
            anObservable.value = 5
            expect(anObservable.value).toBe(5);
        });
    });

    describe('add handler method', function() {
        it('should accept ahc.Hand objects', function() {
            anObservable.addHandler(someHandler);
            expect(anObservable.handlerArray.length).toBe(1);
        });

        it('should remove ', function() {
            anObservable.addHandler(someHandler);
            expect(anObservable.handlerArray.length).toBe(1);
            anObservable.removeHandler(someHandler);
            expect(anObservable.handlerArray.length).toBe(0);
        });
    });

    describe('should call handlers when value changes', function() {
        it('but not before', function() {
            anObservable.addHandler(someHandler);
            expect(test.otherValue).toBe(0);
        });

        it('should set values on context', function() {
            anObservable.addHandler(someHandler);
            anObservable.value = 9001;
            expect(test.otherValue).toBe(1);
        });
    });
});

describe('ahc.ObservableArray', function() {
    var test = this,
        anObservable = {},
        anObject = {
            test: 'test'
        },
        anObject2 = {
            test: 'test'
        };

    this.otherValue = 0;
    var someHandler = new ahc.Hand(test, function() {
        this.otherValue = 1;
    });

    beforeEach(function() {
        test.otherValue = 0;
        anObservable = new ahc.ObservableArray();
    });

    describe('should extend Observable', function() {
        it('should be an instance of', function() {
            expect(anObservable instanceof ahc.Observable).toBeTruthy();
        });
    });

    describe('add method should insert new values', function() {
        it('should contain no values initially', function() {
            expect(anObservable.length).toBe(0);
        });

        it('should contain any value we add', function() {
            anObservable.add(anObject);
            expect(anObservable.length).toBe(1);
        });

        it('should contain multiple values we add', function() {
            anObservable.add(anObject, anObject2);
            expect(anObservable.length).toBe(2);
        });

        it('should contain the array of values we add', function() {
            anObservable.add([anObject, anObject2]);
            expect(anObservable.length).toBe(2);
        });
    });

    describe('remove method should remove values', function() {
        it('should contain a values initially', function() {
            anObservable.add(anObject);
            expect(anObservable.length).toBe(1);
        });

        it('should contain no values after removal', function() {
            anObservable.add(anObject);
            expect(anObservable.length).toBe(1);
            anObservable.remove(anObject);
            expect(anObservable.length).toBe(0);
        });

        it('should contain multiple values we add', function() {
            anObservable.add(anObject, anObject2);
            expect(anObservable.length).toBe(2);
            anObservable.remove(anObject, anObject2);
            expect(anObservable.length).toBe(0);
        });

        it('should contain the array of values we add', function() {
            anObservable.add([anObject, anObject2]);
            expect(anObservable.length).toBe(2);
            anObservable.remove([anObject, anObject2]);
            expect(anObservable.length).toBe(0);
        });
    });

    describe('push method should insert new values', function() {
        it('should contain no values initially', function() {
            expect(anObservable.length).toBe(0);
        });

        it('should contain any value we add', function() {
            anObservable.push(anObject);
            expect(anObservable.length).toBe(1);
        });
    });

    describe('pop method should return last value', function() {
        it('should contain no values initially', function() {
            expect(anObservable.length).toBe(0);
        });

        it('should return the value we add', function() {
            anObservable.push(anObject);
            expect(anObservable.pop()).toBe(anObject);
        });
    });
});