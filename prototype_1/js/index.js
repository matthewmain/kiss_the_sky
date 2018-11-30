



///////////////////////////////////////////////////////////////// 
////////////     Plant Evolution App: Prototype 1     /////////// 
//////////////////////////////////////////////////?//////////////





////---INITIATION---////


var plants = [], plantCount = 0;




////---(TESTING)---////


for ( var i=0; i<5; i++ ) {
  createPlant();
}



/// LIGHT & SHADOWS /////////////////////////////////////////////////////////////////////////////////////////////////

var sunRays = [], sunRayCount = 0;

///sunray constructor
function SunRay() {
  this.id = sunRayCount;
  this.x = xValFromPct(this.id);
  this.intensity = 1;
  this.leafContacts = [];  // (as array of objects: { y: <leaf contanct y value>, plant: <plant instance> })
}

///creates a sun ray for each x value as a percentage of the canvas's width 
function createSunRays() {
  for ( var i=0; i<101; i++ ) {
    sunRays.push( new SunRay() );
    sunRayCount++;
  }
}
createSunRays();

///sheds sunlight
function shedSunlight() {

  //gets each leaf span's y values at integer x values as points where sun rays contact leaf
  for ( var i=0; i<plants.length; i++ ) {
    var p = plants[i];
    for ( var j=0; j<p.segments.length; j++ ) {
      var s = p.segments[j];
      if ( s.hasLeaves ) {
        var p1, p2;

        //leaf 1
        //assigns p1 as leftmost leaf span point and p2 as rightmost leaf span point
        if ( s.ptLf1.cx < s.ptB1.cx ) { p1 = s.ptLf1; p2 = s.ptB1; } else { p1 = s.ptB1; p2 = s.ptLf1; }  
        //loops through leaf span's integer x values
        var xPctMin = Math.ceil( pctFromXVal( p1.cx ) );
        var xPctMax = Math.floor( pctFromXVal( p2.cx ) );
        for ( var lcx=xPctMin; lcx<=xPctMax; lcx++ ) {  // leaf contact x value
          var lcy = p1.cy + (xValFromPct(lcx)-p1.cx) * (p2.cy-p1.cy) / (p2.cx-p1.cx);  // leaf contact y value
          //pushes corresponding y value and plant instance to associated sun ray instance
          sunRays[lcx].leafContacts.push( { y: lcy, plant: p } );
        }

        //leaf 2
        if ( s.ptLf2.cx < s.ptB2.cx ) { p1 = s.ptLf2; p2 = s.ptB2; } else { p1 = s.ptB2; p2 = s.ptLf2; }
        xPctMin = Math.ceil( pctFromXVal( p1.cx ) );
        xPctMax = Math.floor( pctFromXVal( p2.cx ) );  
        for ( lcx=xPctMin; lcx<=xPctMax; lcx++ ) {  // leaf contact x value
          lcy = p1.cy + (xValFromPct(lcx)-p1.cx) * ( p2.cy - p1.cy) / ( p2.cx - p1.cx ); // leaf contact y value
          sunRays[lcx].leafContacts.push( { y: lcy, plant: p } );
        }

      }
    } 
  }

  //transfers energy from sun rays to leaves
  for ( var i=0; i<sunRays.length; i++ ) {
    var sr = sunRays[i];  // sun ray
    //sorts leaf contact points from highest to lowest elevation (increasing y value)
    sr.leafContacts.sort( function( a, b ) { return a.y - b.y } );
    //when a sun ray hits a leaf, transfers half of the ray's intensity to the plant as energy
    for ( var j=0; j<sr.leafContacts.length; j++) {
      var lc = sr.leafContacts[j];  // leaf contact
      sr.intensity /= 2;  
      lc.plant.energy += sr.intensity;
    }
    //resets sun ray's leaf contact points & intensity for next iteration
    sr.leafContacts = [];
    sr.intensity = 1;
  }

}

///casts shadows
function castShadows() {

}





















////---OBJECTS---////


///plant constructor
function Plant( xLocation ) {
  this.id = plantCount;
  this.segments = []; this.segmentCount = 0;
  this.energy = 100;
  this.xLocation = xLocation;
  //settings
  this.forwardGrowthRate = gravity * Tl.rfb(18,22);  // (rate of cross spans increase per frame)
  this.outwardGrowthRate = this.forwardGrowthRate * Tl.rfb(0.18,0.22);  // (rate forward span widens per frame)
  this.maxSegmentWidth = Tl.rfb(11,13);  // maximum segment width (in pixels)
  this.maxTotalSegments = Tl.rib(13,20);  // maximum total number of segments
  this.firstLeafSegment = Tl.rib(2,4);  // (segment on which first leaf set grows)
  this.leafFrequency = Tl.rib(2,3);  // (number of segments until next leaf set)
  this.maxLeaflength = this.maxSegmentWidth * Tl.rfb(4,7);  // maximum leaf length at maturity
  this.leafGrowthRate = this.forwardGrowthRate * Tl.rfb(1.4,1.6);  // leaf growth rate
  //base segment
  this.ptB1 = addPt( this.xLocation - 0.1, 100 );  // base point 1
  this.ptB2 = addPt( this.xLocation + 0.1, 100 );  // base point 2
  this.ptB1.fixed = this.ptB2.fixed = true;  // fixes base points to ground
  this.spB = addSp( this.ptB1.id, this.ptB2.id );  // adds base span
  createSegment( this, null, this.ptB1, this.ptB2 );  // creates the base segment (with "null" parent)
}


///segment constructor
function Segment( plant, parentSegment, basePoint1, basePoint2 ) {
  this.plantId = plant.id;
  this.id = plant.segmentCount;
  this.childSegment = null;
  this.hasChildSegment = false;
  this.parentSegment = parentSegment;
  this.isBaseSegment = false; if (this.parentSegment === null) { this.isBaseSegment = true; }
  this.hasLeaves = false;
  this.hasLeafScaffolding = false;
  //settings
  this.forwardGrowthRateVariation = Tl.rfb(0.95,1.05);//(0.95,1.05);  // forward growth rate variation
  this.mass = 1;  // mass of the segment stalk portion ( divided between the two extension points)
  this.strength = 1.5;  // as multiple of global rigidity (higher values effect performance)
  //base points
  this.ptB1 = basePoint1;  // base point 1
  this.ptB2 = basePoint2;  // base point 2
  //extension points
  var originX = ( this.ptB1.cx + this.ptB2.cx ) / 2;  // center of base points x values
  var originY = ( this.ptB1.cy + this.ptB2.cy ) / 2;  // center of base points y values
  this.ptE1 = addPt( pctFromXVal( originX ) - 0.1, pctFromYVal( originY ) - 0.1 );  // extension point 1
  this.ptE2 = addPt( pctFromXVal( originX ) + 0.1, pctFromYVal( originY ) - 0.1 );  // extension point 2
  this.ptE1.mass = this.mass / 2;
  this.ptE2.mass = this.mass / 2;
  //spans
  this.spL = addSp( this.ptB1.id, this.ptE1.id );  // left span
  this.spR = addSp( this.ptB2.id, this.ptE2.id );  // right span
  this.spF = addSp( this.ptE1.id, this.ptE2.id );  // forward span
  this.spCd = addSp( this.ptE1.id, this.ptB2.id );  // downward (l to r) cross span
  this.spCu = addSp( this.ptB1.id, this.ptE2.id );  // new upward (l to r) cross span
  this.spL.rigidity = this.strength;
  this.spR.rigidity = this.strength;
  this.spF.rigidity = this.strength;
  this.spCd.rigidity = this.strength;
  this.spCu.rigidity = this.strength;
  //base segment
  if (!this.isBaseSegment) {
    this.spCdP = addSp( this.ptE1.id, this.parentSegment.ptB2.id ); // downward (l to r) cross span to parent
    this.spCuP = addSp( this.parentSegment.ptB1.id, this.ptE2.id ); // upward (l to r) cross span to parent
    this.spCdP.rigidity = this.strength;
    this.spCdP.rigidity = this.strength;
  }
  //leaves
  this.ptLf1 = null;  // leaf point 1 (leaf tip)
  this.ptLf2 = null;  // leaf point 2 (leaf tip)  
  this.spLf1 = null;  // leaf 1 Span
  this.spLf2 = null;  // leaf 2 Span
  this.lightReceptors = [];  // light receptors along each leaf span  ///////////////////////////////////////////
  //skins
  this.skins = [];
  this.skins.push( addSk( [ this.ptE1.id, this.ptE2.id, this.ptB2.id, this.ptB1.id ], "darkgreen" ) );
}




////---FUNCTIONS---////


//creates a new plant
function createPlant() {
  plantCount++;
  plants.push( new Plant(Tl.rib(1,99)) );
}

///creates a new segment
function createSegment( plant, parentSegment, basePoint1, basePoint2 ) {
  plant.segmentCount++;
  plant.segments.unshift( new Segment( plant, parentSegment, basePoint1, basePoint2 ) );
  if (parentSegment !== null) {
    parentSegment.childSegment = plant.segments[plant.segments.length-1];
    parentSegment.hasChildSegment = true;
  }
}

///grows all plants
function growPlants() {
  for (var i=0; i<plants.length; i++) {
    for (var j=0; j<plants[i].segments.length; j++) {
      var plant = plants[i];
      var segment = plants[i].segments[j];
      //lengthens spans
      if ( segment.spF.l < plant.maxSegmentWidth && plant.segments.length < plant.maxTotalSegments) { 
        if (segment.isBaseSegment) {
          segment.ptB1.cx -= plant.outwardGrowthRate / 2;
          segment.ptB2.cx += plant.outwardGrowthRate / 2;
          plant.spB.l = distance( segment.ptB1, segment.ptB2 );
          segment.spCd.l = distance( segment.ptE1, segment.ptB2 ) + plant.forwardGrowthRate / 3;
          segment.spCu.l = segment.spCd.l;
        } else {
          segment.spCdP.l = distance( segment.ptE1, segment.parentSegment.ptB2 ) + plant.forwardGrowthRate;
          segment.spCuP.l = segment.spCdP.l * segment.forwardGrowthRateVariation;
          segment.spCd.l = distance( segment.ptE1, segment.ptB2 );
          segment.spCu.l = distance( segment.ptB1, segment.ptE2 );
        } 
        segment.spF.l += plant.outwardGrowthRate;
        segment.spL.l = distance( segment.ptB1, segment.ptE1 );
        segment.spR.l = distance( segment.ptB2, segment.ptE2 );
      }
      //handles leaves
      if ( !segment.hasLeaves ) { 
        generateLeavesWhenReady( plant, segment ); 
      } else if ( plant.segments.length < plant.maxTotalSegments ) {
        growLeaves( plant, segment );
      }
      //generates new segment
      if ( readyForChildSegment( plant, segment ) ) { 
        createSegment( plant, segment, segment.ptE1, segment.ptE2 ); 
      }
      //displays stalks and leaves
      renderStalks( plant, segment );
      renderLeaves( plant, segment );
    }
  }
}

///checks whether a segment is ready to generate a child segment
function readyForChildSegment( plant, segment ) {
  return segment.spF.l > plant.maxSegmentWidth * 0.333 && 
         !segment.hasChildSegment && 
         plant.segments.length < plant.maxTotalSegments;
}

///generates leaves when segment is ready
function generateLeavesWhenReady ( plant, segment ) {
  var p = plant;
  var s = segment;
  if (  s.id >= p.firstLeafSegment && 
        s.id % p.leafFrequency === 0 && 
        s.spF.l > p.maxSegmentWidth * 0.1 ||
        s.id === p.maxTotalSegments-1 ) {
    var fsmp = smp( s.spF );  // forward span mid point ( { x: <value>, y: <value> } )
    s.ptLf1 = addPt( pctFromXVal( fsmp.x ), pctFromYVal( fsmp.y - 1 ) );  // leaf 1 tip point (left)
    s.ptLf2 = addPt( pctFromXVal( fsmp.x ), pctFromYVal( fsmp.y - 1 ) );  // leaf 2 tip point (right)
    s.spLf1 = addSp( s.ptB1.id, s.ptLf1.id );  // leaf 1 span (left)
    s.spLf2 = addSp( s.ptB2.id, s.ptLf2.id );  // leaf 2 span (right)
    s.leafTipsTetherSpan = addSp( s.ptLf1.id, s.ptLf2.id );  // leaf tip tether span
    s.hasLeaves = true;
  }
}

///add leaf scaffolding
function addLeafScaffolding( plant, segment ) {
  var p = plant;
  var s = segment;
  //remove leaf tips tether
  removeSpan(s.leafTipsTetherSpan.id);
  //apply leaf-unfold boosters
  s.ptLf1.cx -= gravity * 100;
  s.ptLf2.cx += gravity * 100;
  //add scaffolding points
  //(leaf 1)
  var x = s.ptE1.cx + ( s.ptE1.cx - s.ptE2.cx ) * 0.5;
  var y = s.ptE1.cy + ( s.ptE1.cy - s.ptE2.cy ) * 0.5;
  s.ptLf1ScA = addPt( pctFromXVal( x ), pctFromXVal( y ), "immaterial" ); s.ptLf1ScA.mass = 0;
  x = ( s.ptLf1.cx + s.ptLf1ScA.cx ) / 2 ;
  y = ( s.ptLf1.cy + s.ptLf1ScA.cy ) / 2 ;
  s.ptLf1ScB = addPt( pctFromXVal( x ), pctFromXVal( y ), "immaterial" ); s.ptLf1ScB.mass = 0;
  //(leaf 2)
  x = s.ptE2.cx + ( s.ptE2.cx - s.ptE1.cx ) * 0.5;
  y = s.ptE2.cy + ( s.ptE2.cy - s.ptE1.cy ) * 0.5;
  s.ptLf2ScA = addPt( pctFromXVal( x ), pctFromXVal( y ), "immaterial" ); s.ptLf2ScA.mass = 0;
  x = ( s.ptLf2.cx + s.ptLf2ScA.cx ) / 2 ;
  y = ( s.ptLf2.cy + s.ptLf2ScA.cy ) / 2 ;
  s.ptLf2ScB = addPt( pctFromXVal( x ), pctFromXVal( y ), "immaterial" ); s.ptLf2ScB.mass = 0;
  //add scaffolding spans
  //(leaf 1)
  s.spLf1ScA = addSp( s.ptE1.id, s.ptLf1ScA.id, "hidden" );
  s.spLf1ScB = addSp( s.ptB1.id, s.ptLf1ScA.id, "hidden" ); 
  s.spLf1ScC = addSp( s.ptLf1ScA.id, s.ptLf1ScB.id, "hidden" ); 
  s.spLf1ScD = addSp( s.ptLf1ScB.id, s.ptLf1.id, "hidden" ); 
  //(leaf 2)
  s.spLf2ScA = addSp( s.ptE2.id, s.ptLf2ScA.id, "hidden" ); 
  s.spLf2ScB = addSp( s.ptB2.id, s.ptLf2ScA.id, "hidden" ); 
  s.spLf2ScC = addSp( s.ptLf2ScA.id, s.ptLf2ScB.id, "hidden" ); 
  s.spLf2ScD = addSp( s.ptLf2ScB.id, s.ptLf2.id, "hidden" );
  s.hasLeafScaffolding = true;
}

///grows leaves
function growLeaves( plant, segment ) {
  var p = plant;
  var s = segment;
  if ( s.spLf1.l < p.maxLeaflength ) {
    //extend leaves
    s.spLf1.l = s.spLf2.l += p.leafGrowthRate;
    if ( s.spF.l > p.maxSegmentWidth*0.6 && !s.hasLeafScaffolding ) {
      // add scaffolding when leaves unfold
      addLeafScaffolding( plant, segment );
    } else if ( s.hasLeafScaffolding ) {
      //extend scaffolding if present
      //(leaf 1)
      s.spLf1ScA.l += p.leafGrowthRate * 1.25;
      s.spLf1ScB.l += p.leafGrowthRate * 1.5;
      s.spLf1ScC.l += p.leafGrowthRate * 0.06;
      s.spLf1ScD.l += p.leafGrowthRate * 0.06;
      //(leaf 2)
      s.spLf2ScA.l += p.leafGrowthRate * 1.25;
      s.spLf2ScB.l += p.leafGrowthRate * 1.5;
      s.spLf2ScC.l += p.leafGrowthRate * 0.06;
      s.spLf2ScD.l += p.leafGrowthRate * 0.06;
    }
  }
}

///displays leaf
function renderLeaf( plant, leafSpan ) {
  var p1x = leafSpan.p1.cx;
  var p1y = leafSpan.p1.cy;
  var p2x = leafSpan.p2.cx;
  var p2y = leafSpan.p2.cy;
  var mpx = ( p1x + p2x ) / 2;  // mid point x
  var mpy = ( p1y + p2y ) / 2;  // mid point y
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = "#003000";
  ctx.fillStyle = "green";
  var ah = 0.35;  // arc height
  //leaf top
  var ccpx = mpx + ( p2y - p1y ) * ah;  // curve control point x
  var ccpy = mpy + ( p1x - p2x ) * ah;  // curve control point y
  ctx.beginPath();
  ctx.moveTo(p1x,p1y);
  ctx.quadraticCurveTo(ccpx,ccpy,p2x,p2y);
  ctx.stroke();
  ctx.fill();
  //leaf bottom
  ccpx = mpx + ( p1y - p2y ) * ah;  // curve control point x
  ccpy = mpy + ( p2x - p1x ) * ah;  // curve control point y
  ctx.beginPath();
  ctx.moveTo(p1x,p1y);
  ctx.quadraticCurveTo(ccpx,ccpy,p2x,p2y);
  ctx.stroke();
  ctx.fill();
  //leaf center
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#007000";
  ctx.moveTo(p1x,p1y);
  ctx.lineTo(p2x,p2y);
  ctx.stroke();
}

///displays leaves
function renderLeaves( plant, segment ) {
  if ( segment.hasLeaves ) {
    renderLeaf( plant, segment.spLf1 );
    renderLeaf( plant, segment.spLf2 );
  }
}

///renders plants sequentially
function renderStalks( plant, segment ) {
  for (var i=0; i<segment.skins.length; i++) {
    var s = segment.skins[i];
    //fills
    ctx.beginPath();
    ctx.fillStyle = s.color;
    ctx.lineWidth = 1;
    ctx.strokeStyle = "darkgreen";
    ctx.moveTo(s.points[0].cx, s.points[0].cy);
    for(var j=1; j<s.points.length; j++) { ctx.lineTo(s.points[j].cx, s.points[j].cy); }
    ctx.lineTo(s.points[0].cx, s.points[0].cy);
    ctx.stroke();
    ctx.fill(); 
    //outlines
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#2A2000";
    ctx.moveTo(s.points[3].cx, s.points[3].cy);
    ctx.lineTo(s.points[0].cx, s.points[0].cy);
    ctx.moveTo(s.points[2].cx, s.points[2].cy);
    ctx.lineTo(s.points[1].cx, s.points[1].cy);
    ctx.stroke();
    if ( !segment.hasChildSegment ) {
      ctx.beginPath();
      ctx.moveTo(s.points[3].cx, s.points[3].cy);
      ctx.lineTo(s.points[2].cx, s.points[2].cy);
      ctx.stroke();
    }
  }
}




////---DISPLAY---////


function display() {
  runVerlet();
  growPlants();

  shedSunlight();  ////////////////////////////////////////////////////////////////////////////////////////

  window.requestAnimationFrame(display);
}

display();






