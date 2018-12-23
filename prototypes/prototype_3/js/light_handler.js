

///////// LIGHT HANDLER /////////



///creates a new sun ray (one for each x value as an integer percentage of the canvas's width)
function createSunRays() {
  for ( var i=0; i<101; i++ ) {
    sunRays.push( new SunRay() );
    sunRayCount++;
  }
}

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

///sheds sunlight
function shedSunlight() {
  markRayLeafIntersections();
  photosynthesize(); 
}

///marks points where sun rays intersect with leaves 
function markRayLeafIntersections() {
  for ( var i=0; i<plants.length; i++ ) {
    var p = plants[i];
    if (p.isActive) {
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
    //sorts leaf contact points from highest to lowest elevation (increasing y value)
    sr.leafContacts.sort( function( a, b ) { return a.y - b.y; } );
    //when a sun ray hits a leaf, transfers half of the ray's intensity to the plant as energy
    for ( var j=0; j<sr.leafContacts.length; j++) {
      var lc = sr.leafContacts[j];  // leaf contact ({ y: <leaf contact y value>, plant: <plant> })
      sr.intensity /= 2;
      lc.plant.energy += sr.intensity * photosynthesisRatio;
    }
    sr.leafContacts = []; sr.intensity = sunRayIntensity;  // resets sun ray's leaf contact points & intensity
  }
}

///marks shadow positions (based on position of leaf spans)
function markShadowPositions( segment ) {
  shadows.push( new Shadow( segment.spLf1 ) );
  shadows.push( new Shadow( segment.spLf2 ) );
}

///renders shadows (from highest to lowest elevation)
function renderShadows() {
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

















