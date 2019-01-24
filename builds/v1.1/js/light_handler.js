


///////// LIGHT HANDLER /////////


///interaction variables
var mouseCanvasXPct;
var mouseCanvasYPct;
var sunShadeY = yValFromPct(8);  // sun shade elevation as canvas Y value
var sunShadeHandleRadiusPct = 1.75;  // sun shade handle radius as percentage of canvas width
var grabbedHandle = null;  // grabbed handle object (assigned when handle is clicked/touched)




/////---OBJECTS---/////


///sun ray constructor
function SunRay() {
  this.id = sunRayCount;
  this.x = xValFromPct( this.id );
  this.intensity = sunRayIntensity;
  this.leafContacts = [];  // (as array of objects: { y: <leaf contact y value>, plant: <plant> })
}

///shadow constructor
function Shadow( leafSpan ) {
  this.p1 = leafSpan.p1;
  this.p2 = leafSpan.p2;
  this.p3 = { cx: this.p2.cx, cy: yValFromPct( 100 ) };
  this.p4 = { cx: this.p1.cx, cy: yValFromPct( 100 ) };
}

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


///creates a new sun ray (one for each x value as an integer percentage of the canvas's width)
function createSunRays() {
  for ( var i=0; i<101; i++ ) {
    sunRays.push( new SunRay() );
    sunRayCount++;
  }
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

///sheds sunlight
function shedSunlight() {
  markRayLeafIntersections();
  photosynthesize(); 
}

///marks points where sun rays intersect with leaves 
function markRayLeafIntersections() {
  for ( var i=0; i<plants.length; i++ ) {
    var p = plants[i];
    if ( p.isAlive ) {
      for ( var j=0; j<p.segments.length; j++ ) {
        var s = p.segments[j];
        if ( s.hasLeaves ) {
          var p1, p2, lcy;
          //leaf 1
          //(assigns p1 as leftmost leaf span point and p2 as rightmost leaf span point)
          if ( s.ptLf1.cx < s.ptB1.cx ) { p1 = s.ptLf1; p2 = s.ptB1; } else { p1 = s.ptB1; p2 = s.ptLf1; }
          var xPctMin = Math.ceil( pctFromXVal( p1.cx ) );
          var xPctMax = Math.floor( pctFromXVal( p2.cx ) );
          for ( var lcx=xPctMin; lcx<=xPctMax; lcx++ ) {  // leaf contact x value
            lcy = p1.cy + (xValFromPct(lcx)-p1.cx) * (p2.cy-p1.cy) / (p2.cx-p1.cx);  // leaf contact y value
            //pushes corresponding y value and plant instance to associated sun ray instance
            sunRays[lcx].leafContacts.push( { y: lcy, plant: p } );
          }
          //leaf 2
          //(assigns p2 as leftmost leaf span point and p1 as rightmost leaf span point)
          if ( s.ptLf2.cx < s.ptB2.cx ) { p1 = s.ptLf2; p2 = s.ptB2; } else { p1 = s.ptB2; p2 = s.ptLf2; }
          xPctMin = Math.ceil( pctFromXVal( p1.cx ) );
          xPctMax = Math.floor( pctFromXVal( p2.cx ) );  
          for ( lcx=xPctMin; lcx<=xPctMax; lcx++ ) {  // leaf contact x value
            lcy = p1.cy + (xValFromPct(lcx)-p1.cx) * ( p2.cy - p1.cy) / ( p2.cx - p1.cx ); // leaf contact y value
            //pushes corresponding y value and plant instance to associated sun ray instance
            sunRays[lcx].leafContacts.push( { y: lcy, plant: p } );
          }
        }
      } 
    }
  }
}

///transfers energy from sun rays to leaves
function photosynthesize() {
  for ( var i=0; i<sunRays.length; i++ ) {
    var sr = sunRays[i];  // sun ray
    //first, reduces a sun ray's intensity if it intersects a sun shade
    for ( var j=0; j<sunShades.length; j++ ) {
      var ss = sunShades[j];
      var lhx = ss.h1.x <= ss.h2.x ? ss.h1.x : ss.h2.x;  // leftmost handle x value
      var rhx = ss.h1.x <= ss.h2.x ? ss.h2.x : ss.h1.x;  // rightmost handle x value
      if ( sr.x >= lhx && sr.x <= rhx ) { sr.intensity *= 0.0; }
    }
    //sorts leaf contact points from highest to lowest elevation (increasing y value)
    sr.leafContacts.sort( function( a, b ) { return a.y - b.y; } );
    //when a sun ray hits a leaf, transfers half of the ray's intensity to the plant as energy
    for ( var k=0; k<sr.leafContacts.length; k++) {
      var lc = sr.leafContacts[k];  // leaf contact ({ y: <leaf contact y value>, plant: <plant> })
      sr.intensity *= 0.5;
      lc.plant.energy += sr.intensity * photosynthesisRatio;
    }
    sr.leafContacts = []; sr.intensity = sunRayIntensity;  // resets sun ray's leaf contact points & intensity
  }
}

///marks shadow positions (based on position of leaf spans)
function markLeafShadowPositions( segment ) {
  shadows.push( new Shadow( segment.spLf1 ) );
  shadows.push( new Shadow( segment.spLf2 ) );
}

///renders shadows (from highest to lowest elevation)
function renderLeafShadows() {
  shadows.sort( function( a, b ) { return a.p2.cy - b.p2.cy; } );
  for ( var i=0; i<shadows.length; i++ ) {
    var sh = shadows[i];
    ctx.beginPath();
    ctx.moveTo( sh.p1.cx, sh.p1.cy );
    ctx.lineTo( sh.p2.cx, sh.p2.cy ); 
    ctx.lineTo( sh.p3.cx, sh.p3.cy );
    ctx.lineTo( sh.p4.cx, sh.p4.cy );
    ctx.lineTo( sh.p1.cx, sh.p1.cy );
    ctx.fillStyle = "rgba( 0, 0, 0, 0.1 )";
    ctx.fill();  
  }
  //resets shadows
  shadows = []; shadowCount = 0;
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


//grabs handle on click/touch
function grabHandle(e) {
  var canvasWidthOnScreen = parseFloat(canvasContainerDiv.style.width);
  var canvasHeightOnScreen = parseFloat(canvasContainerDiv.style.height);
  mouseCanvasXPct = (e.pageX-canvasPositionLeft)*100/canvasWidthOnScreen;  // mouse canvas x percent
  mouseCanvasYPct = (e.pageY-canvasPositionTop)*100/canvasHeightOnScreen;  // mouse canvas y percent
  for ( var i=0; i<sunShadeHandles.length; i++ ) {
    var h = sunShadeHandles[i];
    var x_diff = pctFromXVal( h.x ) - mouseCanvasXPct;
    var y_diff = pctFromYVal( h.y ) - mouseCanvasYPct;
    var dist = Math.sqrt( x_diff*x_diff + y_diff*y_diff );
    if ( dist <= sunShadeHandleRadiusPct ) {
      grabbedHandle = h;
    }
  }
}

//moves handle
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

//drops handle
function dropHandle() {
  grabbedHandle = null;
}



///---EVENTS---///

document.addEventListener("mousedown", grabHandle);
document.addEventListener("mousemove", moveHandle);
document.addEventListener("mouseup", dropHandle);

document.addEventListener("touchstart", grabHandle);
document.addEventListener("touchmove", moveHandle);
document.addEventListener("touchend", dropHandle);














