'use strict';

//
//
/** @module test/ahc/wallchart */
//
//

console.log('module test/ahc/wallchart: ' + new Date());

describe('ahc.Wallchart', function() {
    var test = this,
        wallchart = {},
        today;

    beforeEach(function() {
        var now = new Date();
        today = new Date(1990, 1, 1, 0, 0, 0, 0);
        wallchart = new ahc.Wallchart('wallchart', {
            start: today
        });
    });

    describe('during initialisation', function() {
        it('should deal with start', function() {
            expect(wallchart.startTime).toBe(today);
        });

        it('should create new canvas', function() {
            expect(wallchart.canvas instanceof fabric.Canvas).toBeTruthy();
        });

        describe('time marks need to be created', function() {
            it('as the date for all midnight times', function() {
                wallchart.changeZoom(50);
                expect(wallchart.timeMarks[0].getText()).toBe('01/01');
            });

            it('at 5 minutes if zoom is 480.', function() {
                wallchart.changeZoom(480);
                expect(wallchart.timeMarks[1].getText()).toBe('00:05');
            });

            it('at 10 minutes if zoom is 240.', function() {
                wallchart.changeZoom(240);
                expect(wallchart.timeMarks[1].getText()).toBe('00:10');
            });

            it('at 15 minutes if zoom is 160.', function() {
                wallchart.changeZoom(160);
                expect(wallchart.timeMarks[1].getText()).toBe('00:15');
            });

            it('at 30 minutes if zoom is 80.', function() {
                wallchart.changeZoom(80);
                expect(wallchart.timeMarks[1].getText()).toBe('00:30');
            });

            it('at hours if zoom is 50.', function() {
                wallchart.changeZoom(50);
                expect(wallchart.timeMarks[1].getText()).toBe('01:00');
            });

            it('at 2 hours if zoom is 39.', function() {
                wallchart.changeZoom(39);
                expect(wallchart.timeMarks[1].getText()).toBe('02:00');
            });

            it('at 3 hours if zoom is 19.', function() {
                wallchart.changeZoom(19);
                expect(wallchart.timeMarks[1].getText()).toBe('03:00');
            });

            it('at 6 hours if zoom is 13.', function() {
                wallchart.changeZoom(13);
                expect(wallchart.timeMarks[1].getText()).toBe('06:00');
            });

            it('at 12 hours if zoom is 6.', function() {
                wallchart.changeZoom(6);
                expect(wallchart.timeMarks[1].getText()).toBe('12:00');
            });

            it('at 1 day if zoom is 3.', function() {
                wallchart.changeZoom(3);
                expect(wallchart.timeMarks[1].getText()).toBe('02/01');
            });
        });
    });
});