



///////////////////////////////////////////////////////////////// 
////////////     Plant Evolution App: Prototype 1     /////////// 
//////////////////////////////////////////////////?//////////////





////---INITIATION---////

var plants = [], plantCount = 0;




////---(TESTING)---////

for (i=0;i<1;i++) {
  createPlant();
}

// // point mass and span strength testing
// var p1 = addPt(5,0); p1.mass = 1; p1.fixed = true;
// var p2 = addPt(5,5); p2.mass = 50000;
// var s1 = addSp(p1.id,p2.id); s1.strength = 0.3;
// var p3 = addPt(10,0); p3.mass = 1; p3.fixed = true;
// var p4 = addPt(10,5); p4.mass = 50000;
// var s2 = addSp(p3.id,p4.id); s2.strength = 0.1;




////---OBJECTS---////


///plant constructor
function Plant( originX ) {
  this.id = plantCount;
  this.segments = []; this.segmentCount = 0;
  //settings
  this.originX = 50;//originX;
  this.forwardGrowthRate = gravity * 30;//5;//Tl.rfb(28,32);  // (rate of cross spans increase per frame)
  this.outwardGrowthRate = this.forwardGrowthRate * Tl.rfb( 0.18, 0.22 );  // (rate forward span widens per frame)
  this.maxSegmentWidth = 50;//Tl.rfb(11,13);  // maximum segment width (in pixels)
  this.maxTotalSegments = 8;//Tl.rib(13,17);  // maximum total number of segments
  this.maxLeaflength = this.maxSegmentWidth * Tl.rfb( 5, 7 );  // maximum leaf length at maturity
  this.leafGrowthRate = this.forwardGrowthRate * Tl.rfb( 1.4, 1.6 );  // leaf growth rate
  //base segment
  this.ptB1 = addPt( this.originX - 0.1, 100 );  // base point 1
  this.ptB2 = addPt( this.originX + 0.1, 100 );  // base point 2
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
  this.hasLeafConstraints = false;
  //settings
  this.forwardGrowthRateVariation = Tl.rfb(0.95,1.05);//(0.95,1.05);  // forward growth rate variation
  //points
  this.ptB1 = basePoint1;  // base point 1
  this.ptB2 = basePoint2;  // base point 2
  var originX = (this.ptB1.cx + this.ptB2.cx) / 2;  // center of base points x values
  var originY = (this.ptB1.cy + this.ptB2.cy) / 2;  // center of base points y values
  this.ptE1 = addPt( pctFromXVal(originX) - 0.1, pctFromYVal(originY) - 0.1 );  // extension point 1
  this.ptE2 = addPt( pctFromXVal(originX) + 0.1, pctFromYVal(originY) - 0.1 );  // extension point 2
  this.ptLf1;  // leaf point 1 (leaf tip)
  this.ptLf2;  // leaf point 2 (leaf tip)  
  //spans
  this.spL = addSp( this.ptB1.id, this.ptE1.id );  // left span
  this.spR = addSp( this.ptB2.id, this.ptE2.id );  // right span
  this.spF = addSp( this.ptE1.id, this.ptE2.id );  // forward span
  this.spCd = addSp( this.ptE1.id, this.ptB2.id );  // downward (l to r) cross span
  this.spCu = addSp( this.ptB1.id, this.ptE2.id );  // new upward (l to r) cross span
  if (!this.isBaseSegment) {
    this.spCdP = addSp( this.ptE1.id, this.parentSegment.ptB2.id ); // downward (l to r) cross span to parent
    this.spCuP = addSp( this.parentSegment.ptB1.id, this.ptE2.id ); // upward (l to r) cross span to parent
  }
  this.spLf1;  // leaf 1 Span
  this.spLf2;  // leaf 2 Span
  //skins
  addSk( [ this.ptE1.id, this.ptE2.id, this.ptB2.id, this.ptB1.id ], "green" );
}

////---FUNCTIONS---////


//creates a new plant
function createPlant() {
  plantCount++;
  plants.push( new Plant(Tl.rib(1,99)) );
}

//creates a new segment
function createSegment( plant, parentSegment, basePoint1, basePoint2 ) {
  plant.segmentCount++;
  plant.segments.push( new Segment( plant, parentSegment, basePoint1, basePoint2 ) );
  if (parentSegment !== null) {
    parentSegment.childSegment = plant.segments[plant.segments.length-1];
    parentSegment.hasChildSegment = true;
  }
}

//grows all plants
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
        //handles leaves
        if ( !segment.hasLeaves ) { 
          generateLeavesWhenReady( plant, segment ); 
        } else {
          growLeaves( plant, segment );
        }
      }
      //generates new segment
      if ( readyForChildSegment( plant, segment ) ) { createSegment( plant, segment, segment.ptE1, segment.ptE2 ); }
      //displays leaves
      if ( segment.hasLeaves ) { displayLeaves( plant, segment ); }
    }
  }
}

//checks whether a segment is ready to generate a child segment
function readyForChildSegment( plant, segment ) {
  return segment.spF.l > plant.maxSegmentWidth * 0.333 && 
         !segment.hasChildSegment && 
         plant.segments.length < plant.maxTotalSegments;
}












//generates leaves
function generateLeavesWhenReady ( plant, segment ) {
  if ( segment.id>2 && segment.spF.l>plant.maxSegmentWidth*0.1 ) {
    var fsmp = smp( segment.spF );  // forward span mid point ( { x: <value>, y: <value> } )
    segment.ptLf1 = addPt( pctFromXVal( fsmp.x ), pctFromYVal( fsmp.y ) );  // leaf 1 tip point (left)
    segment.ptLf2 = addPt( pctFromXVal( fsmp.x ), pctFromYVal( fsmp.y ) );  // leaf 2 tip point (right)
    segment.spLf1 = addSp( segment.ptB1.id, segment.ptLf1.id );  // leaf 1 span (left)
    segment.spLf2 = addSp( segment.ptB2.id, segment.ptLf2.id );  // leaf 2 span (right)
    segment.leafTipTetherSpan = addSp( segment.ptLf1.id, segment.ptLf2.id );  // leaf tip tether span
    segment.hasLeaves = true;
  }
}

//grows leaves
function growLeaves( plant, segment ) {
  if ( segment.spLf1.l < plant.maxLeaflength ) {
    segment.spLf1.l = segment.spLf2.l += plant.leafGrowthRate;
    if ( segment.spF.l > plant.maxSegmentWidth*0.5 && !segment.hasLeafConstraints ) {
      removeSpan(segment.leafTipTetherSpan.id);
    }
  }
}

console.log(plants[0]);

//displays leaf
function displayLeaf( plant, leafSpan ) {
  var p1x = leafSpan.p1.cx;
  var p1y = leafSpan.p1.cy;
  var p2x = leafSpan.p2.cx;
  var p2y = leafSpan.p2.cy;
  var mpx = ( p1x + p2x ) / 2;  // mid point x
  var mpy = ( p1y + p2y ) / 2;  // mid point y
  ctx.lineWidth = 0;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = "darkgreen";
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
}

//displays leaves
function displayLeaves( plant, segment ) {
  displayLeaf( plant, segment.spLf1 );
  displayLeaf( plant, segment.spLf2 );
}
















////---DISPLAY---////


function display() {
  runVerlet();
  growPlants();
  window.requestAnimationFrame(display);
}

display();





