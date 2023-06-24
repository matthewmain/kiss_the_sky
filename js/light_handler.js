


///////// LIGHT HANDLER /////////




/////---OBJECTS---/////


///sun ray constructor
function SunRay() {
  this.saveTagClass = "sunRay";
  this.id = sunRayCount;
  this.x = xValFromPct( this.id );
  this.intensity = sunRayIntensity;
  this.leafContacts = [];  // (as array of objects: { y: <leaf contact y value>, plant: <plant> })
}

///shadow constructor
function Shadow( segment ) {
  this.s = segment;
  this.p1t = segment.spLf1.p2;
  this.p2t = segment.spLf1.p1;
  this.p3t = segment.spLf2.p1;
  this.p4t = segment.spLf2.p2;
  this.p1b = { cx: this.p1t.cx, cy: yValFromPct( 100 ) };
  this.p2b = { cx: this.p2t.cx, cy: yValFromPct( 100 ) };
  this.p3b = { cx: this.p3t.cx, cy: yValFromPct( 100 ) };
  this.p4b = { cx: this.p4t.cx, cy: yValFromPct( 100 ) };
}




/////---FUNCTIONS---/////


///creates a new sun ray (one for each x value as an integer percentage of the canvas's width)
function createSunRays() {
  for ( var i=0; i<101; i++ ) {
    sunRays.push( new SunRay() );
    sunRayCount++;
  }
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
    //first, reduces a sun ray's intensity if it intersects a sun shade (see ui.js for sun shades)
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
function addLeafShadows( segment ) {
  shadows.push( new Shadow( segment ) );
}

///renders shadows (from highest to lowest elevation)
function renderLeafShadows() {
  for ( var i=0; i<shadows.length; i++ ) {
    var sh = shadows[i];
    ctx.fillStyle = "rgba("+sh.s.clLS.r+","+sh.s.clLS.g+","+sh.s.clLS.b+","+sh.s.clLS.a+")";
    ctx.beginPath();  // left leaf
    ctx.moveTo( sh.p1b.cx, sh.p1b.cy );
    ctx.lineTo( sh.p1t.cx, sh.p1t.cy );
    ctx.lineTo( sh.p2t.cx, sh.p2t.cy );
    ctx.lineTo( sh.p2b.cx, sh.p2b.cy );
    ctx.fill();
    ctx.beginPath();  // between leaves
    ctx.fillStyle = "rgba("+sh.s.clLS.r+","+sh.s.clLS.g+","+sh.s.clLS.b+","+sh.s.clLS.a+")";
    ctx.moveTo( sh.p2b.cx, sh.p2b.cy );
    ctx.lineTo( sh.p2t.cx, sh.p2t.cy );
    ctx.lineTo( sh.p3t.cx, sh.p3t.cy );
    ctx.lineTo( sh.p3b.cx, sh.p3b.cy );
    ctx.fill();
    ctx.beginPath();  // right leaf
    ctx.fillStyle = "rgba("+sh.s.clLS.r+","+sh.s.clLS.g+","+sh.s.clLS.b+","+sh.s.clLS.a+")";
    ctx.moveTo( sh.p3b.cx, sh.p3b.cy );
    ctx.lineTo( sh.p3t.cx, sh.p3t.cy );
    ctx.lineTo( sh.p4t.cx, sh.p4t.cy );
    ctx.lineTo( sh.p4b.cx, sh.p4b.cy );
    ctx.fill();
  }
  //resets shadows
  shadows = []; shadowCount = 0;
}




