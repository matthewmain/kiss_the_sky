


//////////////////// UI ////////////////////////


var headerDiv = document.getElementById("header_div");
var footerDiv = document.getElementById("footer_div");

var mouseCanvasXPct;
var mouseCanvasYPct;

var sunShadeY = yValFromPct(8);  // sun shade elevation as canvas Y value
var sunShadeHandleRadiusPct = 1.75;  // sun shade handle radius as percentage of canvas width
var grabbedHandle = null;  // grabbed handle object (assigned when handle is clicked/touched)

var plantGrabRadiusPct = 5; 
var plantsAreBeingMoved = false;  // (assigned when mousedown or touchstart events are active)



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

///updates UI (runs every iteration)
function updateUI() {
  attachHeaderAndFooter();
  renderSunShades();
  $("#year_count").text( currentYear );
  $("#season").text( currentSeason );
  updateSeasonPieChart();
  $("#highest_height").text( highestFlowerPct );
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




/////---INTERACTION---/////


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
  var canvasWidthOnScreen = parseFloat(canvasContainerDiv.style.width);
  var canvasHeightOnScreen = parseFloat(canvasContainerDiv.style.height);
  mouseCanvasXPct = (e.pageX-canvasPositionLeft)*100/canvasWidthOnScreen;  // mouse canvas x percent
  mouseCanvasYPct = (e.pageY-canvasPositionTop)*100/canvasHeightOnScreen;  // mouse canvas y percent
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
    var canvasWidthOnScreen = parseFloat(canvasContainerDiv.style.width);
    mouseCanvasXPct = (e.pageX-canvasPositionLeft)*100/canvasWidthOnScreen;  // mouse canvas x percent
    //updates grabbed handle x position according to mouse x position
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




/// plant interaction XXXXX {{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
//grabs plants
function grabPlants(e) {
  var canvasWidthOnScreen = parseFloat(canvasContainerDiv.style.width);
  var canvasHeightOnScreen = parseFloat(canvasContainerDiv.style.height);
  mouseCanvasXPct = (e.pageX-canvasPositionLeft)*100/canvasWidthOnScreen;  // mouse canvas x percent
  mouseCanvasYPct = (e.pageY-canvasPositionTop)*100/canvasHeightOnScreen;  // mouse canvas y percent
  for ( var i=0; i<points.length; i++ ) {
    var p = points[i];
    var xDiffPct = pctFromXVal( p.cx ) - mouseCanvasXPct;
    var yDiffPct = pctFromYVal( p.cy ) - mouseCanvasYPct;
    var distancePct = Math.sqrt( xDiffPct*xDiffPct + yDiffPct*yDiffPct );
    if ( distancePct <= plantGrabRadiusPct ) {
      p.grabbed = true;
      p.mxd = xDiffPct;
      p.myd = yDiffPct;
    }
  }
  plantsAreBeingMoved = true;
}

//moves plants
function movePlants(e) {
  if ( plantsAreBeingMoved ) {
    var canvasWidthOnScreen = parseFloat(canvasContainerDiv.style.width);
    var canvasHeightOnScreen = parseFloat(canvasContainerDiv.style.height);
    mouseCanvasXPct = (e.pageX-canvasPositionLeft)*100/canvasWidthOnScreen;  // mouse canvas x percent
    mouseCanvasYPct = (e.pageY-canvasPositionTop)*100/canvasHeightOnScreen;  // mouse canvas y percent
    //(drops plants if mouse leaves canvas)
    if (  mouseCanvasXPct < 0 || mouseCanvasXPct > 100 || 
          mouseCanvasYPct < 0 || mouseCanvasYPct > 100) { 
      dropPlants(); 
    }
    //updates grabbed points according to mouse position
    for (var i=0; i<points.length; i++) {
      var p = points[i];
      if (p.grabbed === true /*&& p.fixed === false*/) {
        p.cx = p.px = xValFromPct( mouseCanvasXPct + p.mxd );
        p.cy = p.py = xValFromPct( mouseCanvasYPct + p.myd );
      }
    }
  }
}

//drops plants
function dropPlants() {
  for (var i=0; i<points.length; i++) {
    points[i].grabbed = false;
  }
  plantsAreBeingMoved = false;
}



/////---EVENTS---/////

document.addEventListener("mousedown", function(e) { grabHandle(e); grabPlants(e); });
document.addEventListener("mousemove", function(e) {  moveHandle(e); movePlants(e); });
document.addEventListener("mouseup", function() {  dropHandle(); dropPlants(); });

document.addEventListener("touchstart", function(e) { grabHandle(e); grabPlants(e); });
document.addEventListener("touchmove", function(e) {  moveHandle(e); movePlants(e); });
document.addEventListener("touchup", function() {  dropHandle(); dropPlants(); });




