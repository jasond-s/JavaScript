    
(function() {
  
  var sw = 625, sh = 625;
  var stage = new Kinetic.Stage({container: 'container', width: 625, height: 625});        
  var theLayer = new Kinetic.Layer({x: 10, y: 10});

  var seconds = new Kinetic.Line({
    points: [300, 300, 300, 0],
    tension: 0.5,
    closed: true,
    stroke: 'lightskyblue',
    strokeWidth: 5   
  });

  var minutes = new Kinetic.Line({
    points: [300, 300, 300, 0],
    tension: 0.5,
    closed: true,
    stroke: 'lightskyblue',
    strokeWidth: 8   
  });

  var hours = new Kinetic.Line({
    points: [300, 300, 300, 0],
    tension: 0.5,
    closed: true,
    stroke: 'darkcyan',
    strokeWidth: 8
  });       

  clockPoints = [
    // 0/12
    [300, 300, 300, 0],
    [300, 300, 340, 0],
    [300, 300, 380, 0],
    [300, 300, 420, 0],
    [300, 300, 460, 0],
    [300, 300, 500, 0],
    [300, 300, 540, 0],
    [300, 300, 580, 0],
    [300, 300, 600, 20],
    [300, 300, 600, 60],
    [300, 300, 600, 100],
    [300, 300, 600, 140],
    [300, 300, 600, 180],
    [300, 300, 600, 220],
    [300, 300, 600, 260],
    // 3
    [300, 300, 600, 300],
    [300, 300, 600, 340],
    [300, 300, 600, 380],
    [300, 300, 600, 420],
    [300, 300, 600, 460],
    [300, 300, 600, 500],
    [300, 300, 600, 540],
    [300, 300, 600, 580],
    [300, 300, 580, 600],
    [300, 300, 540, 600],
    [300, 300, 500, 600],
    [300, 300, 460, 600],
    [300, 300, 420, 600],
    [300, 300, 380, 600],
    [300, 300, 340, 600],
    // 6
    [300, 300, 300, 600],
    [300, 300, 260, 600],
    [300, 300, 220, 600],
    [300, 300, 180, 600],
    [300, 300, 140, 600],
    [300, 300, 100, 600],
    [300, 300, 60, 600],
    [300, 300, 20, 600],
    [300, 300, 0, 580],
    [300, 300, 0, 540],
    [300, 300, 0, 500],
    [300, 300, 0, 460],
    [300, 300, 0, 420],
    [300, 300, 0, 380],
    [300, 300, 0, 340],
    // 9
    [300, 300, 0, 300],
    [300, 300, 0, 260],
    [300, 300, 0, 220],
    [300, 300, 0, 180],
    [300, 300, 0, 140],
    [300, 300, 0, 100],
    [300, 300, 0, 60],
    [300, 300, 0, 20],
    [300, 300, 20, 0],
    [300, 300, 60, 0],
    [300, 300, 100, 0],
    [300, 300, 140, 0],
    [300, 300, 180, 0],
    [300, 300, 220, 0],
    [300, 300, 260, 0],
  ];

  var createText = function(x, y, text) {
    return new Kinetic.Text({
      x: x,
      y: y,
      text: text,
      fontSize: 30,
      fontFamily: 'Calibri',
      fill: 'darkcyan'
    });
  }

  // Add the numbers to the face.
  for (var i = clockPoints.length - 1; i >= 0; i--) {
    var colour = 'grey'
    if (i % 5 === 0) {
      colour = 'darkcyan'
      theLayer.add(createText(clockPoints[i][2] - 10, clockPoints[i][3] - 10, Math.floor(i / 5)))
    }
  };

  theLayer
  // THe hands.
  .add(seconds)
  .add(minutes)
  .add(hours)
  // Prettifier bits.
  .add(new Kinetic.Circle({
    x: 300,
    y: 300,
    radius: 10,
    fill: 'cadetblue',
    strokeWidth: 1    
  }))
  .add(new Kinetic.Line({
    points: [290, 310, 310, 310, 310, 290, 290, 290],
    tension: 5,
    closed: true,
    stroke: 'cadetblue',
    strokeWidth: 6    
  }));

  // Compile the whole doolideep.
  stage.add(theLayer);

  // Animator.
  var tween = function(index, node){
    return new Kinetic.Tween({
      node: node,
      duration: 0.00000000000001,
      points: clockPoints[index]
    })
  };             

  // Start the clock!
  setInterval(function(){
    // What's the time Mr Wolf!
    var date = new Date();

    // Set position to actual time.
    var secPos = date.getSeconds(), minPos = date.getMinutes(), hrPos = ((date.getHours() % 12) * 5) + Math.floor((date.getMinutes() / 12));

    // Animate it to the new position.
    tween(secPos, seconds).play();
    tween(minPos, minutes).play();
    tween(hrPos, hours).play();

    // The interval time sets the biggest margin of error.
  }, 200);
  
})();