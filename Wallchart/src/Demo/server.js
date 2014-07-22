var connect = require('connect'),
    serveStatic = require('serve-static');

var app = connect()

app.use(serveStatic(__dirname + '/'));

app.listen(8100);

// http://jsperf.com/js-anim/22
// http://jsperf.com/fabricjs-vs-kineticjs/13