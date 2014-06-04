    
(function() {
  
  this.intToRoman = function (int) {
    // Create 2-dimensional array for the decimal levels. 
    var romanNumerals = [
        ['', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix'],
        ['', 'x', 'xx', 'xxx', 'xl', 'l', 'lx', 'lxx', 'lxxx', 'xc'],
        ['', 'c', 'cc', 'ccc', 'cd', 'd', 'dc', 'dcc', 'dccc', 'cm'],
        ['', 'm', 'mm', 'mmm']
    ];

    // Split integer string into array and reverse array
    var intArr = int.toString().split('').reverse(), len = intArr.length, romanNumeral = '', i = len;

    // Work out the numbers per decimal place.
    while (i--) romanNumeral += romanNumerals[i][intArr[i]];

    return romanNumeral;
  };

  // Creates a block of kinetic text.
  this.createText = function(x, y, text) {
    return new Kinetic.Text({x: x, y: y, text: text, fontSize: 30, fontFamily: 'Calibri', fill: 'darkcyan'});
  }

  // Animator.
  this.tween = function(i, n, d){
    return new Kinetic.Tween({node: n, duration: d, points: cp[i]});
  };

  // Get on with all the clock code!

  var stage = new Kinetic.Stage({container: 'container', width: 625, height: 625});        
  var theLayer = new Kinetic.Layer({x: 10, y: 10});

  var s = new Kinetic.Line({points: [300, 300, 300, 0], tension: 0.5, closed: true, stroke: 'lightskyblue', strokeWidth: 5});
  var m = new Kinetic.Line({points: [300, 300, 300, 0], tension: 0.5, closed: true, stroke: 'lightskyblue', strokeWidth: 8});
  var h = new Kinetic.Line({points: [300, 300, 300, 0], tension: 0.5, closed: true, stroke: 'darkcyan', strokeWidth: 8});       

  // Clock position lookup.
  cp = [
    // 0/12
    [300, 300, 300, 0],[300, 300, 340, 0],[300, 300, 380, 0],[300, 300, 420, 0],[300, 300, 460, 0],
    [300, 300, 500, 0],[300, 300, 540, 0],[300, 300, 580, 0],[300, 300, 600, 20],[300, 300, 600, 60],
    [300, 300, 600, 100],[300, 300, 600, 140],[300, 300, 600, 180],[300, 300, 600, 220],[300, 300, 600, 260],
    // 3
    [300, 300, 600, 300],[300, 300, 600, 340],[300, 300, 600, 380],[300, 300, 600, 420],[300, 300, 600, 460],
    [300, 300, 600, 500],[300, 300, 600, 540],[300, 300, 600, 580],[300, 300, 580, 600],[300, 300, 540, 600],
    [300, 300, 500, 600],[300, 300, 460, 600],[300, 300, 420, 600],[300, 300, 380, 600],[300, 300, 340, 600],
    // 6
    [300, 300, 300, 600],[300, 300, 260, 600],[300, 300, 220, 600],[300, 300, 180, 600],[300, 300, 140, 600],
    [300, 300, 100, 600],[300, 300, 60, 600],[300, 300, 20, 600],[300, 300, 0, 580],[300, 300, 0, 540],
    [300, 300, 0, 500],[300, 300, 0, 460],[300, 300, 0, 420],[300, 300, 0, 380],[300, 300, 0, 340],
    // 9
    [300, 300, 0, 300],[300, 300, 0, 260],[300, 300, 0, 220],[300, 300, 0, 180],[300, 300, 0, 140],
    [300, 300, 0, 100],[300, 300, 0, 60],[300, 300, 0, 20],[300, 300, 20, 0],[300, 300, 60, 0],
    [300, 300, 100, 0],[300, 300, 140, 0],[300, 300, 180, 0],[300, 300, 220, 0],[300, 300, 260, 0],
  ];

  // Add the numbers to the face.
  for (var i = cp.length - 1; i >= 0; i--) {
    var colour = 'grey';
    if (i % 5 === 0) {
      colour = 'darkcyan';
      var time = intToRoman(Math.floor(i / 5));
      if (i === 0) time = 'xii';
      theLayer.add(createText(cp[i][2] - 10, cp[i][3] - 10, time.toUpperCase()));
    }
  };

  theLayer
    // The hands.
    .add(s).add(m).add(h)
    // Prettifier bits.
    .add(new Kinetic.Circle({x: 300, y: 300, radius: 10, fill: 'cadetblue', strokeWidth: 1}))
    .add(new Kinetic.Line({points: [290, 310, 310, 310, 310, 290, 290, 290], tension: 5, closed: true, stroke: 'cadetblue', strokeWidth: 6}));

  // Compile the whole doolideep.
  stage.add(theLayer);

  // Position creation for the hands.
  var pf = [
    {h: s, v: function(d){ return d.getSeconds(); }},
    {h: m, v: function(d){ return d.getMinutes(); }},
    {h: h, v: function(d){ return ((d.getHours() % 12) * 5) + Math.floor((d.getMinutes() / 12)); }}
  ];

  // Start the clock!
  setInterval(function(){
    // What's the time Mr Wolf!
    var d = new Date();
    for (var i = 0; i < pf.length; i++) {
      var t = pf[i];
      tween(t.v(d), t.h, 0.08).play();
    }
    // The interval time sets the biggest margin of error for a single second.
  }, 200);
})();