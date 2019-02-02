



//////////////////////////  UI  //////////////////////////////




var headerDiv = document.getElementById("header_div");
var footerDiv = document.getElementById("footer_div");

var mouseCanvasXPct;
var mouseCanvasYPct;

var sunShadeY = yValFromPct(8);  // sun shade elevation as canvas Y value
var sunShadeHandleRadiusPct = 1.75;  // sun shade handle radius as percentage of canvas width
var grabbedHandle = null;  // grabbed handle object (assigned when handle is clicked/touched)

var selectRadius= canvas.width*0.015; // radius from click/touch point within which an item is selected
var plantsAreBeingEliminated = false;




/////---OBJECTS---/////


///sun shade handle constructor
function SunShadeHandle( xPositionPct ) {
  this.x = xValFromPct(xPositionPct); 
  this.y = sunShadeY;
}

///sun shade constructor
function SunShade( handle1, handle2 ) {
  this.h1 = handle1;
  this.h2 = handle2; 
}




/////---FUNCTIONS---/////


///attaches header and footer to canvas (after canvas has been resized to window dimensions in verlet.js)
function attachHeaderAndFooter() {
  var canvasHeight = parseFloat(canvasContainerDiv.style.height);
  var canvasTop = canvasContainerDiv.offsetTop - canvasHeight/2;
  headerDiv.style.width = canvasContainerDiv.style.width;
  headerDiv.style.height = canvasHeight*0.15+"px";
  headerDiv.style.top = canvasTop-parseFloat(headerDiv.style.height)+"px";
  footerDiv.style.width = canvasContainerDiv.style.width;
  footerDiv.style.height = canvasHeight*0.075+"px";
  footerDiv.style.top = canvasTop+canvasHeight+"px";
}

///creates a new sun shade handle
function createSunShadeHandle( xPositionPct ) {
  sunShadeHandles.push( new SunShadeHandle( xPositionPct ) );
  sunShadeHandleCount++;
  return sunShadeHandles[sunShadeHandles.length-1];
}

///creates a new sun shade
function createSunShade( handle1XPct, handle2XPct ) {
  var handle1 = createSunShadeHandle( handle1XPct );
  var handle2 = createSunShadeHandle( handle2XPct );
  sunShades.push ( new SunShade( handle1, handle2 ) );
  sunShadeCount++;
  return sunShades[sunShades.length-1];
}

///places sun shade
function placeSunShades( leftCount, rightCount ) {
  for ( var i=0; i<leftCount; i++ ) { createSunShade( 0, 0 ); }
  for ( var j=0; j<rightCount; j++ ) { createSunShade( 100, 100 ); }
}




/////---RENDERING---/////


///renders eliminate plant icon at cursor location
function displayEliminatePlantIconWithCursor(e) {
  var displayIcon = false;
  //canvas.style.cursor = "default";
  for ( var i=0; i<plants.length; i++ ) {
    var p = plants[i];
    if ( p.isAlive || (!p.hasCollapsed && !p.hasBeenEliminatedByPlayer) ) {
      for ( var j=0; j<p.segments.length; j++) {
        var s = p.segments[j];
        var xDiffPct1 = pctFromXVal( s.ptE1.cx ) - mouseCanvasXPct;
        var yDiffPct1 = pctFromYVal( s.ptE1.cy ) - mouseCanvasYPct;
        var distancePct1 = Math.sqrt( xDiffPct1*xDiffPct1 + yDiffPct1*yDiffPct1 );
        var xDiffPct2 = pctFromXVal( s.ptE2.cx ) - mouseCanvasXPct;
        var yDiffPct2 = pctFromYVal( s.ptE2.cy ) - mouseCanvasYPct;
        var selectRadiusPct = selectRadius*100/canvas.width;
        var distancePct2 = Math.sqrt( xDiffPct2*xDiffPct2 + yDiffPct2*yDiffPct2 );
        if ( distancePct1 <= selectRadiusPct*2 || distancePct2 <= selectRadiusPct*2 ) {
          displayIcon = true;
          //canvas.style.cursor = "none";
        }
      }
    }
  }
  if ( displayIcon ) {
    ctx.fillStyle = "rgba(232,73,0,0.5)";
    ctx.strokeStyle = "rgba(232,73,0,1)";
    //circle
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.arc( xValFromPct(mouseCanvasXPct), yValFromPct(mouseCanvasYPct-0.5), selectRadius*1.3, 0, 2*Math.PI );
    ctx.fill();
    ctx.stroke();
    //bar
    ctx.beginPath();
    ctx.lineWidth = 6;
    ctx.lineCap = "butt";
    ctx.moveTo( xValFromPct(mouseCanvasXPct-1.1), yValFromPct(mouseCanvasYPct-0.5) );
    ctx.lineTo( xValFromPct(mouseCanvasXPct+1.1), yValFromPct(mouseCanvasYPct-0.5) );
    ctx.fill();
    ctx.stroke();
  }
}

///renders markers that track the highest red flower height so far  XXXX {{{{{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}

var HeightMarker = {
  w: canvas.width*0.025,  // marker width 
  h: canvas.width*0.025,  // marker height
  y: canvas.height,  // marker position y value (at point)
  chfx: null,  // current highest flower x value
  baa: false,  // bounce animation active
  bat: 0,  // bounce animation time
  laa: false,  // line animation active
  lat: 0,  // line animation time
};

function renderHeightMarker() {
  var hrfy = canvas.height - yValFromPct( highestRedFlowerPct );  // highest red flower y value currently
  var chmp = 100-pctFromYVal(HeightMarker.y);  // current height marker percentage
  if ( Math.floor(highestRedFlowerPct) > Math.floor(chmp) ) {   // initializes animations if new highest red flower
    HeightMarker.y = hrfy;  
    HeightMarker.baa = true;
    HeightMarker.bat = 0;  
    HeightMarker.laa = true;
    HeightMarker.lat = 0;  
  }
  if ( HeightMarker.baa ) {  // marker bounce animation (size expansion & contraction)
    HeightMarker.bat++;
    var a = -0.3;  // corresponds to animation duration ( higher value is longer duration; 0 is infinite)
    var b = 3;  // extent of expansion ( higher value is greater expansion )
    var x = HeightMarker.bat; 
    var y = a*Math.pow(x,2) + b*x;  // current marker expansion extent (quadratic formula; y = ax^2 + bx + c)
    HeightMarker.w = canvas.width*0.025 + y;
    if ( y <= 0 ) { HeightMarker.baa = false; HeightMarker.bat = 0; }
  }
  if ( HeightMarker.laa ) {  // line animation
    HeightMarker.lat++;
    var lad = 15;  // line animation duration
    var rl = (canvas.width/lad)*HeightMarker.lat;  // ray length
    ctx.beginPath();
    ctx.lineWidth = 1;
    var lGrad = ctx.createLinearGradient( HeightMarker.chfx, HeightMarker.y, HeightMarker.chfx-rl, HeightMarker.y);
    lGrad.addColorStop("0", "rgba( 161, 0, 0, 0 )");
    lGrad.addColorStop("1.0", "rgba( 161, 0, 0, 0.8 )");
    ctx.strokeStyle = lGrad;
    ctx.moveTo( HeightMarker.chfx, HeightMarker.y );
    ctx.lineTo( HeightMarker.chfx-rl, HeightMarker.y );
    ctx.stroke();
    var rGrad = ctx.createLinearGradient( HeightMarker.chfx, HeightMarker.y, HeightMarker.chfx+rl, HeightMarker.y);
    rGrad.addColorStop("0", "rgba( 161, 0, 0, 0 )");
    rGrad.addColorStop("1.0", "rgba( 161, 0, 0, 0.8 )");
    ctx.strokeStyle = rGrad;
    ctx.moveTo( HeightMarker.chfx, HeightMarker.y );
    ctx.lineTo( HeightMarker.chfx+rl, HeightMarker.y );
    ctx.stroke();
    if ( HeightMarker.lat > lad ) { HeightMarker.laa = false; HeightMarker.lat = 0; }
  }
  if ( highestRedFlowerPct > 0 ) {  // draws marker
    ctx.beginPath();  // top triangle
    ctx.fillStyle = "#D32100";
    ctx.moveTo( canvas.width, HeightMarker.y );  
    ctx.lineTo( canvas.width, HeightMarker.y - HeightMarker.h/2 ); 
    ctx.lineTo( canvas.width-HeightMarker.w, HeightMarker.y ); 
    ctx.fill();  
    ctx.beginPath();  // bottom triangle
    ctx.fillStyle = "#A10000";
    ctx.moveTo( canvas.width, HeightMarker.y );  
    ctx.lineTo( canvas.width, HeightMarker.y + HeightMarker.h/2 ); 
    ctx.lineTo( canvas.width-HeightMarker.w, HeightMarker.y ); 
    ctx.fill();
  }
}

///renders sun shades
function renderSunShades() {
  var y = sunShadeY;  // sun shade y value
  var r = xValFromPct( sunShadeHandleRadiusPct );  // handle radius
  var c = "#111111";  // color
  for ( var i=0; i<sunShades.length; i++ ) {
    var s = sunShades[i];
    //shadow
    if ( viewShadows ) {
      ctx.fillStyle = "rgba( 0, 0, 0, 0.333 )";
      ctx.beginPath();
      ctx.moveTo( s.h1.x, y );
      ctx.lineTo( s.h2.x, y ); 
      ctx.lineTo( s.h2.x, yValFromPct(100) );
      ctx.lineTo( s.h1.x, yValFromPct(100) );
      ctx.fill();  
    }
    //line
    ctx.beginPath();
    ctx.lineWidth = xValFromPct( sunShadeHandleRadiusPct*0.75 );
    ctx.strokeStyle = c;
    ctx.moveTo(s.h1.x,y);
    ctx.lineTo(s.h2.x,y);
    ctx.stroke();
    //handles
    for ( var j=1; j<=2; j++) {
      var hx = s["h"+j].x;
      if ( hx === 0 || hx === canvas.width ) {
        //tab (outer circle)
        ctx.beginPath();
        ctx.fillStyle = c;
        ctx.arc( hx, y, r*1.1, 0, 2*Math.PI );
        ctx.fill();
        ctx.beginPath();
        //arrow (diamond)
        ctx.fillStyle = "rgba( 213, 215, 197, 0.5 )";
        ctx.moveTo( hx, y-r*0.5 );
        ctx.lineTo( hx+r*0.7, y );
        ctx.lineTo( hx, y+r*0.5 );
        ctx.lineTo( hx-r*0.7, y );
        ctx.fill();
      } else {
        //outer circle
        ctx.beginPath();
        ctx.fillStyle = c;
        ctx.arc( hx, y, r, 0, 2*Math.PI );
        ctx.fill();
        ctx.beginPath();
        //inner circle
        ctx.fillStyle = "rgba( 213, 215, 197, 0.15 )";
        ctx.arc( hx, y, r*0.666, 0, 2*Math.PI );
        ctx.fill();
      }
    }
  }
}




/////---INTERACTION---/////


///updates mouse position coordinates as percentages
function updateMouse(e) {
  var canvasWidthOnScreen = parseFloat(canvasContainerDiv.style.width);
  var canvasHeightOnScreen = parseFloat(canvasContainerDiv.style.height);
  mouseCanvasXPct = (e.pageX-canvasPositionLeft)*100/canvasWidthOnScreen;  // mouse canvas x percent
  mouseCanvasYPct = (e.pageY-canvasPositionTop)*100/canvasHeightOnScreen;  // mouse canvas y percent
}

///toggles shadow visibility on shadows icon click/touch
$(".shadows_icon").click(function(){
  if ( viewShadows === true ) {
    document.getElementById("shadows_icon_on_svg").style.visibility = "hidden";
    document.getElementById("shadows_icon_off_svg").style.visibility = "visible";
    viewShadows = false;
  } else {
    document.getElementById("shadows_icon_on_svg").style.visibility = "visible";
    document.getElementById("shadows_icon_off_svg").style.visibility = "hidden";
    viewShadows = true;
  }
});

///downloads canvas screengrab on camera icon click/touch
$("#save").click(function(){
  var image = canvas.toDataURL("image/png");
  console.log(image);
  var download = document.getElementById("save");
  download.href = image;
  var seasonTitleCase = currentSeason.charAt(0).toUpperCase()+currentSeason.slice(1);
  download.download = "Kiss the Sky - Year "+currentYear+", "+seasonTitleCase+".png";
});

///reloads game on reload icon click/touch
$("#restart_icon_svg").click(function() {
  location.reload();
});

///grabs handle
function grabHandle(e) {
  for ( var i=0; i<sunShadeHandles.length; i++ ) {
    var h = sunShadeHandles[i];
    var xDiffPct = pctFromXVal( h.x ) - mouseCanvasXPct;
    var yDiffPct = pctFromYVal( h.y ) - mouseCanvasYPct;
    var distancePct = Math.sqrt( xDiffPct*xDiffPct + yDiffPct*yDiffPct );
    if ( distancePct <= sunShadeHandleRadiusPct ) {
      grabbedHandle = h;
    }
  }
}

///moves handle
function moveHandle(e) {
  if ( grabbedHandle ) {
    if ( mouseCanvasXPct < 0 ) {
      grabbedHandle.x = 0;
    } else if ( mouseCanvasXPct > 100 ) {
      grabbedHandle.x = xValFromPct( 100 );
    } else {
      grabbedHandle.x = xValFromPct( mouseCanvasXPct );
    }
  }
}

///drops handle
function dropHandle() {
  grabbedHandle = null;
}

///activates plant elimination mode
function startEliminatingPlants() {
  plantsAreBeingEliminated = true;
}

///deactivates plant elimination mode
function stopEliminatingPlants() {
  plantsAreBeingEliminated = false;
}

///eliminates plants (kills them and knocks them over)
function eliminatePlants( e, plant ) {
  for ( var i=0; i<plants.length; i++ ) {
    var p = plants[i];
    if ( plantsAreBeingEliminated && ( p.isAlive || (!p.hasCollapsed && !p.hasBeenEliminatedByPlayer) ) ) {
      for ( var j=0; j<p.segments.length; j++) {
        var s = p.segments[j];
        var xDiffPct1 = pctFromXVal( s.ptE1.cx ) - mouseCanvasXPct;
        var yDiffPct1 = pctFromYVal( s.ptE1.cy ) - mouseCanvasYPct;
        var distancePct1 = Math.sqrt( xDiffPct1*xDiffPct1 + yDiffPct1*yDiffPct1 );
        var xDiffPct2 = pctFromXVal( s.ptE2.cx ) - mouseCanvasXPct;
        var yDiffPct2 = pctFromYVal( s.ptE2.cy ) - mouseCanvasYPct;
        var selectRadiusPct = selectRadius*100/canvas.width;
        var distancePct2 = Math.sqrt( xDiffPct2*xDiffPct2 + yDiffPct2*yDiffPct2 );
        if ( distancePct1 <= selectRadiusPct || distancePct2 <= selectRadiusPct ) {
          s.ptE1.px += distancePct1 > distancePct2 ? 10 : -10;
          p.energy = p.energy > energyStoreFactor*-1 ? energyStoreFactor*-1 : p.energy; 
          killPlant(p);
          for (var k=0; k<p.segments.length; k++) {
            var s2 = p.segments[k];
            s2.ptE1.mass = s2.ptE2.mass = 15;
            if (!s2.isBaseSegment) {
              removeSpan(s2.spCdP.id);  // downward (l to r) cross span to parent
              removeSpan(s2.spCuP.id);  // upward (l to r) cross span to parent
            }
            removeSpan(s2.spCd.id);  // downward (l to r) cross span
            removeSpan(s2.spCu.id);  // upward (l to r) cross span
          }
          p.hasBeenEliminatedByPlayer = true;
        }
      }
    }
  }
}




/////---EVENTS---/////


document.addEventListener("click", function(e) { 
  startEliminatingPlants(); 
  eliminatePlants(e); 
  stopEliminatingPlants();
});

document.addEventListener("mousedown", function(e) { grabHandle(e); startEliminatingPlants(); });
document.addEventListener("mousemove", function(e) {  updateMouse(e); moveHandle(e); eliminatePlants(e); });
document.addEventListener("mouseup", function() {  dropHandle(); stopEliminatingPlants(); });

document.addEventListener("touchstart", function(e) { grabHandle(e); startEliminatingPlants(); });
document.addEventListener("touchmove", function(e) {  moveHandle(e); eliminatePlants(e); });
document.addEventListener("touchup", function() {  dropHandle(); stopEliminatingPlants(); });




/////---UPDATE---/////

///updates UI (runs every iteration)
function updateUI() {
  attachHeaderAndFooter();
  if ( useSunShades ) { renderSunShades(); }
  renderHeightMarker();
  displayEliminatePlantIconWithCursor();
  $("#year_count").text( currentYear );
  $("#season").text( currentSeason );
  updateSeasonPieChart();
  $("#height_number").text( Math.floor( highestRedFlowerPct ) );
}





