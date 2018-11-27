



///////////////////////////////////////////////////////////////// 
////////////     Plant Evolution App: Prototype 1     /////////// 
//////////////////////////////////////////////////?//////////////





////---INITIATION---////

var plants = [], plantCount = 0;




////---(TESTING)---////

for (i=0;i<1;i++) {
  createPlant();
}




////---OBJECTS---////


///plant constructor
function Plant( originX ) {
  this.id = plantCount;
  this.segments = []; this.segmentCount = 0;
  //settings
  this.originX = 50;//originX;
  this.fgr = gravity * 30;//5;//Tl.rfb(28,32);  // forward growth rate (rate of cross spans increase per frame)
  this.ogr = this.fgr * Tl.rfb(0.18,0.22);  // outward growth rate (rate forward span widens per frame)
  this.msw = 50;//Tl.rfb(11,13);  // maximum segment width, in pixels
  this.mts = 8;//Tl.rib(13,17);  // maximum total number of segments
  //base segment
  this.bp1 = addPt( this.originX - 0.1, 100 );  // base point 1
  this.bp2 = addPt( this.originX + 0.1, 100 );  // base point 2
  this.bp1.fixed = this.bp2.fixed = true;  // fixes base points to ground
  this.spanB = addSp( this.bp1.id, this.bp2.id );  // adds base span
  createSegment( this, null, this.bp1, this.bp2 );  // creates the base segment
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
  this.fgrv = Tl.rfb(0.95,1.05);//(0.95,1.05);  // forward growth rate variation
  //points
  this.bp1 = basePoint1;  // base point 1
  this.bp2 = basePoint2;  // base point 2
  var originX = (this.bp1.cx + this.bp2.cx) / 2;  // center of base points x values
  var originY = (this.bp1.cy + this.bp2.cy) / 2;  // center of base points y values
  this.ep1 = addPt( pctFromXVal(originX) - 0.1, pctFromYVal(originY) - 0.1 );  // extension point 1
  this.ep2 = addPt( pctFromXVal(originX) + 0.1, pctFromYVal(originY) - 0.1 );  // extension point 2
  this.l1p;  // leaf point 1 (leaf tip)
  this.l2p;  // leaf point 2 (leaf tip)  
  //spans
  this.spanL = addSp( this.bp1.id, this.ep1.id );  // left span
  this.spanR = addSp( this.bp2.id, this.ep2.id );  // right span
  this.spanF = addSp( this.ep1.id, this.ep2.id );  // forward span
  this.spanCd = addSp( this.ep1.id, this.bp2.id );  // downward (l to r) cross span
  this.spanCu = addSp( this.bp1.id, this.ep2.id );  // new upward (l to r) cross span
  if (!this.isBaseSegment) {
    this.spanCdP = addSp( this.ep1.id, this.parentSegment.bp2.id ); // downward (l to r) cross span to parent
    this.spanCuP = addSp( this.parentSegment.bp1.id, this.ep2.id ); // upward (l to r) cross span to parent
  }
  this.spanLf1;  // leaf 1 Span
  this.spanLf2;  // leaf 2 Span
  //skins
  addSk( [ this.ep1.id, this.ep2.id, this.bp2.id, this.bp1.id ], "green" );
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
      if ( segment.spanF.l < plant.msw && plant.segments.length < plant.mts) { 
        if (segment.isBaseSegment) {
          segment.bp1.cx -= plant.ogr / 2;
          segment.bp2.cx += plant.ogr / 2;
          plant.spanB.l = distance( segment.bp1, segment.bp2 );
          segment.spanCd.l = distance( segment.ep1, segment.bp2 ) + plant.fgr / 3;
          segment.spanCu.l = segment.spanCd.l;
        } else {
          segment.spanCdP.l = distance( segment.ep1, segment.parentSegment.bp2 ) + plant.fgr;
          segment.spanCuP.l = segment.spanCdP.l * segment.fgrv;
          segment.spanCd.l = distance( segment.ep1, segment.bp2 );
          segment.spanCu.l = distance( segment.bp1, segment.ep2 );
        } 
        segment.spanF.l += plant.ogr;
        segment.spanL.l = distance( segment.bp1, segment.ep1 );
        segment.spanR.l = distance( segment.bp2, segment.ep2 );
      }
      //generates new segment
      if ( readyForChildSegment( plant, segment ) ) {
        createSegment( plant, segment, segment.ep1, segment.ep2 ); 
      }
      //handles leaves
      if ( !segment.hasLeaves ) { 
        generateLeaves( plant, segment ); 
      } else {
        growLeaves( plant, segment );
        displayLeaves( plant, segment );
      }
    }
  }
}

//checks whether a segment is ready to generate a child segment
function readyForChildSegment( plant, segment ) {
  return segment.spanF.l > plant.msw * 0.333 && 
         !segment.hasChildSegment && 
         plant.segments.length < plant.mts;
}












//generates leaves
function generateLeaves ( plant, segment ) {
  if (segment.id > 2 && segment.spanF.l > plant.msw * 0.1) {
    var fsmp = smp( segment.spanF );  // forward span mid point ( { x: <value>, y: <value> } )
    segment.l1p = addPt( pctFromXVal( fsmp.x ), pctFromYVal( fsmp.y ) );  // leaf 1 tip point (left)
    segment.l2p = addPt( pctFromXVal( fsmp.x ), pctFromYVal( fsmp.y ) );  // leaf 2 tip point (right)
    segment.spanLf1 = addSp( segment.bp1.id, segment.l1p.id );  // leaf 1 span (left)
    segment.spanLf2 = addSp( segment.bp2.id, segment.l2p.id );  // leaf 2 span (right)
    segment.leafTipTetherSpan = addSp( segment.l1p.id, segment.l2p.id );  // leaf tip tether span
    segment.hasLeaves = true;
  }
}

//grows leaves
function growLeaves( plant, segment ) {
  var maxLeafLength = segment.spanF.l * 6;
  var leafGrowthRate = plant.fgr * 1.5;
  if ( segment.spanLf1.l < maxLeafLength ) {
    segment.spanLf1.l = segment.spanLf2.l += leafGrowthRate;
    if ( segment.spanF.l > plant.msw * 0.5 && !segment.hasLeafConstraints ) {
      removeSpan(segment.leafTipTetherSpan.id);
    }
  }
}


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
  displayLeaf( plant, segment.spanLf1 );
  displayLeaf( plant, segment.spanLf2 );
}
















////---DISPLAY---////


function display() {
  runVerlet();
  growPlants();
  window.requestAnimationFrame(display);
}

display();





