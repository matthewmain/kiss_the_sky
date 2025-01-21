


///////// VERLET.JS /////////




////---INITIATION---////


///canvas  (*canvas width & height must be equal to retain aspect ratio)
var canvasContainerDiv = document.getElementById("canvas_container_div");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var canvRatio = 0.75;  // canvas ratio, as canvas size to lowest of window width or height
var canvasPositionLeft = canvas.getBoundingClientRect().left + window.scrollX;
var canvasPositionTop = canvas.getBoundingClientRect().top + window.scrollY;

///trackers
var points = [], pointCount = 0;
var spans = [], spanCount = 0;
var skins = [], skinCount = 0;
var worldTime = 0;  // time as frame count

///settings
var viewPoints = false;  // (point visibility)
var viewSpans = false;  // (span visibility)
var viewScaffolding = false; // (scaffolding visibility)
var viewSkins = false; // (skin visibility)
var gravity = 0.01;  // (rate of y-velocity increase per frame per point mass of 1)
var rigidity = 10;  // global span rigidity (as iterations of position accuracy refinement)
var friction = 0.999;  // (proportion of previous velocity after frame refresh)
var bounceLoss = 0.9;  // (proportion of previous velocity after bouncing)
var skidLoss = 0.9;  // (proportion of previous velocity if touching the ground)
var breeze = 0.2;  // breeziness level (applied as brief left & right gusts)




////---OBJECTS---////


///point constructor
function Point(current_x, current_y, materiality="material") {  // materiality can be "material" or "immaterial"
  this.saveTagClass = "point";
  this.cx = current_x;
  this.cy = current_y; 
  this.px = this.cx;  // previous x value
  this.py = this.cy;  // previous y value
  this.mass = 1;  // (as ratio of gravity)
  this.width = 0;
  this.materiality = materiality;
  this.fixed = false;
  // this.grabbed = false;
  // this.mxd = null;  // mouse x distance (upon grab)
  // this.myd = null;  // mouse y distance (upon grab)
  this.id = pointCount;
  pointCount += 1;
}

///span constructor
function Span(point_1, point_2, visibility="visible") {  // visibility can be "visible" or "hidden"
  this.saveTagClass = "span";
  this.p1 = point_1;
  this.p2 = point_2;
  this.l = distance(this.p1,this.p2); // length
  this.strength = 1;  // (as ratio of rigidity)
  this.visibility = visibility;
  this.id = spanCount;
  spanCount += 1;
}

///skins constructor
function Skin(points_array,color) {
  this.saveTagClass = "skin";
  this.points = points_array;  // an array of points for skin outline path
  this.color = color;
  this.id = skinCount;
  skinCount += 1;
}




////---FUNCTIONS---////


///scales canvas to window
function scaleToWindow() {
  if (window.innerWidth > window.innerHeight) {
    canvasContainerDiv.style.height = window.innerHeight*canvRatio+"px";
    canvasContainerDiv.style.width = canvasContainerDiv.style.height;
  } else {
    canvasContainerDiv.style.width = window.innerWidth*canvRatio+"px";
    canvasContainerDiv.style.height = canvasContainerDiv.style.width;
  }
  canvasPositionLeft = canvas.getBoundingClientRect().left + window.scrollX;
  canvasPositionTop = canvas.getBoundingClientRect().top + window.scrollY;
}

///converts percentage to canvas x value
function xValFromPct(percent) {
  return percent * canvas.width / 100;
}

///converts percentage to canvas y value
function yValFromPct(percent) {
  return percent * canvas.height / 100;
}

///converts canvas x value to percentage of canvas width
function pctFromXVal(xValue) {
  return xValue * 100 / canvas.width;
}

///converts canvas y value to percentage of canvas height
function pctFromYVal(yValue) {
  return yValue * 100 / canvas.height;
}

///gets a point by id number
function getPt(id) {
  for (var i=0; i<points.length; i++) { 
    if (points[i].id == id) { return points[i]; }
  }
}

///gets distance between two points (pythogorian theorum)
function distance(point1, point2) {
  var xDiff = point2.cx - point1.cx;
  var	yDiff = point2.cy - point1.cy;
  return Math.sqrt( xDiff*xDiff + yDiff*yDiff);
}

///gets a span's mid point (returns object: { x: <value>, y: <value> } )
function spanMidPoint( span ) {
  var mx = ( span.p1.cx + span.p2.cx ) / 2;  // mid x value
  var my = ( span.p1.cy + span.p2.cy ) / 2;  // mid y value
  return { x: mx, y: my};
}

///gets the mid point between two points (returns object: { x: <value>, y: <value> } )
function midPoint( point1, point2 ) {
  var mx = ( point1.cx + point2.cx ) / 2;  // mid x value
  var my = ( point1.cy + point2.cy ) / 2;  // mid y value
  return { x: mx, y: my};
}

///creates a point object instance
function addPt(xPercent,yPercent,materiality="material") {
  points.push( new Point( xValFromPct(xPercent), yValFromPct(yPercent), materiality ) );
  return points[points.length-1];
}

///creates a span object instance
function addSp(p1,p2,visibility="visible") {
  spans.push( new Span( getPt(p1), getPt(p2), visibility ) );
  return spans[spans.length-1];
}

///creates a skin object instance
function addSk(idPathArray, color) {
  var skinPointsArray = [];
  for ( var i=0; i<idPathArray.length; i++) {
    for( var j=0; j<points.length; j++){ 
      if ( points[j].id === idPathArray[i] ) { 
        skinPointsArray.push( points[j] ); 
      }
    }
  }
  skins.push( new Skin(skinPointsArray,color) );
  return skins[skins.length-1];
}

///removes a point by id  
function removePoint(id) {
  for( var i=0; i<points.length; i++){ 
    if ( points[i].id === id) { points.splice(i,1); }
  }
}

///removes a span by id
function removeSpan(id) {
  for( var i=0; i<spans.length; i++){ 
    if ( spans[i].id === id) { spans.splice(i,1); }
  }
}

///removes a span by id
function removeSkin(id) {
  for( var i=0; i<skins.length; i++){ 
    if ( skins[i].id === id) { skins.splice(i,1); }
  }
}

///updates point positions based on verlet velocity (i.e., current coord minus previous coord)
function updatePoints() {
  for(var i=0; i<points.length; i++) {
    var p = points[i];  // point object
    if (!p.fixed) {
      var	xv = (p.cx - p.px) * friction;	// x velocity
      var	yv = (p.cy - p.py) * friction;	// y velocity
      if (p.py >= canvas.height-p.width/2-0.1) { xv *= skidLoss; }
      p.px = p.cx;  // updates previous x as current x
      p.py = p.cy;  // updates previous y as current y
      p.cx += xv;  // updates current x with new velocity
      p.cy += yv;  // updates current y with new velocity
      p.cy += gravity * p.mass;  // add gravity to y
      if (worldTime % Tl.rib( 100, 200 ) === 0) { p.cx += Tl.rfb( -breeze, breeze ); }  // apply breeze to x
    }
  } 
}

///applies constrains
function applyConstraints() {
  for (var i=0; i<points.length; i++) {
    var p = points[i];
    var pr = p.width/2;  // point radius
    var xv = p.cx - p.px;  // x velocity
    var yv = p.cy - p.py;  // y velocity
    //wall constraints (inverts velocity if point moves beyond a canvas edge)
    if (p.materiality === "material") {
      if (p.cx > canvas.width - pr) { 
        p.cx = canvas.width - pr;  // move point back to wall
        p.px = p.cx + xv * bounceLoss;  // reverse velocity
      }
      if (p.cx < 0 + pr) {
        p.cx = 0 + pr;
        p.px = p.cx + xv * bounceLoss;
      }
      if (p.cy > canvas.height - pr) {
        p.cy = canvas.height - pr;
        p.py = p.cy + yv * bounceLoss;
      }
      // if (p.cy < 0 + pr) {  // (ceiling constraints omitted so flowers can pass through without bouncing)
      //   p.cy = pr;
      //   p.py = p.cy + yv * bounceLoss;
      // }
    }
  }
}

///updates span positions and adjusts associated points
function updateSpans( currentIteration ) {
  for (var i=0; i<spans.length; i++) {
    var thisSpanIterations = Math.round( rigidity * spans[i].strength );
    if ( currentIteration+1 <= thisSpanIterations ) {
      var s = spans[i];
      var dx = s.p2.cx - s.p1.cx;  // distance between x values
      var	dy = s.p2.cy - s.p1.cy;  // distance between y values
      var d = Math.sqrt( dx*dx + dy*dy);  // distance between the points
      var	r = s.l / d;	// ratio (span length over distance between points)
      var	mx = s.p1.cx + dx / 2;  // midpoint between x values 
      var my = s.p1.cy + dy / 2;  // midpoint between y values
      var ox = dx / 2 * r;  // offset of each x value (compared to span length)
      var oy = dy / 2 * r;  // offset of each y value (compared to span length)
      if (!s.p1.fixed) {
        s.p1.cx = mx - ox;  // updates span's first point x value
        s.p1.cy = my - oy;  // updates span's first point y value
      }
      if (!s.p2.fixed) {
        s.p2.cx = mx + ox;  // updates span's second point x value
        s.p2.cy = my + oy;  // updates span's second point y value
      }
    }
  }
}

///refines points for position accuracy & shape rigidity by updating spans and applying constraints iteratively
function refinePositions() {
  var requiredIterations = rigidity;
  for (var i=0; i<spans.length; i++) {
    var thisSpanIterations = Math.round( rigidity * spans[i].strength );
    if ( thisSpanIterations > requiredIterations ) {
      requiredIterations = thisSpanIterations;
    }
  }
  for (var j=0; j<requiredIterations; j++) {
    updateSpans(j);
    applyConstraints();
  }
}

///displays points
function renderPoints() {
  for (var i=0; i<points.length; i++) {
    var p = points[i];
    var radius = p.width >= 2 ? p.width/2 : 1;
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc( p.cx, p.cy, radius, 0 , Math.PI*2 );
    ctx.fill(); 
  }
}

///displays spans
function renderSpans() {
  for (var i=0; i<spans.length; i++) {
    var s = spans[i];
    if (s.visibility == "visible") {
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "blue";
      ctx.moveTo(s.p1.cx, s.p1.cy);
      ctx.lineTo(s.p2.cx, s.p2.cy);
      ctx.stroke(); 
    }
  }
}

///displays scaffolding & binding spans (i.e., "hidden" spans)
function renderScaffolding() {
  ctx.beginPath();
  for (var i=0; i<spans.length; i++) {
    var s = spans[i];
    if (s.visibility === "hidden") {
      ctx.strokeStyle="pink";
      ctx.moveTo(s.p1.cx, s.p1.cy);
      ctx.lineTo(s.p2.cx, s.p2.cy);
    }
  }
  ctx.stroke();
}

///displays skins 
function renderSkins() {
  for(var i=0; i<skins.length; i++) {
    var s = skins[i];
    ctx.beginPath();
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 0;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.fillStyle = s.color;
    ctx.moveTo(s.points[0].cx, s.points[0].cy);
    for(var j=1; j<s.points.length; j++) { ctx.lineTo(s.points[j].cx, s.points[j].cy); }
    ctx.lineTo(s.points[0].cx, s.points[0].cy);
    ctx.stroke();
    ctx.fill();  
  }
}

///clears canvas frame
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

///renders all visible components
function renderImages() {
  //if ( viewSkins ) { renderSkins(); }  // disabled here so plants can be rendered sequentially in plants.js
  if ( viewSpans ) { renderSpans(); }
  if ( viewPoints ) { renderPoints(); }
  if ( viewScaffolding ) { renderScaffolding(); }
}




////---EVENTS---////


///scaling
window.addEventListener('resize', scaleToWindow);




////---RUN---////


function runVerlet() {
	scaleToWindow();
  updatePoints();
  refinePositions();
  //clearCanvas();  // canvas clearing handled by renderBackground() in season_handler.js
  renderImages();
  worldTime++;
}









