



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
  this.fgr = gravity * 30;//Tool.rfb(28,32);  // forward growth rate (rate of cross spans increase per frame)
  this.ogr = this.fgr * Tool.rfb(0.18,0.22);  // outward growth rate (rate forward span widens per frame)
  this.msw = Tool.rfb(11,13);  // maximum segment width, in pixels
  this.mts = Tool.rib(13,17);  // maximum total number of segments
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
  //settings
  this.fgrv = Tool.rfb(0.95,1.05);//(0.95,1.05);  // forward growth rate variation
  //points
  this.bp1 = basePoint1;  // base point 1
  this.bp2 = basePoint2;  // base point 2
  var originX = (this.bp1.cx + this.bp2.cx) / 2;  // center of base points x values
  var originY = (this.bp1.cy + this.bp2.cy) / 2;  // center of base points y values
  this.ep1 = addPt( pctFromXVal(originX) - 0.1, pctFromYVal(originY) - 0.1 );  // extension point 1
  this.ep2 = addPt( pctFromXVal(originX) + 0.1, pctFromYVal(originY) - 0.1 );  // extension point 2
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
  //skins
  addSk( [ this.ep1.id, this.ep2.id, this.bp2.id, this.bp1.id ], "green" );
}




////---FUNCTIONS---////


//creates a new plant
function createPlant() {
  plantCount++;
  plants.push( new Plant(Tool.rib(1,99)) );
}

//creates a new segment
function createSegment(plant, parentSegment, basePoint1, basePoint2) {
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
      if ( segment.id % 1 === 0 && !segment.hasLeaves) { 
        generateLeaves( plant, segment ); 
      } 
      if ( segment.hasLeaves && segment.leafSpanR.l < segment.spanF.l * 6 ) { 
        growLeaves( plant, segment );
      }
      if ( segment.hasLeaves ) {
        displayLeaves( plant, segment, segment.leafSpanL );
        displayLeaves( plant, segment, segment.leafSpanR );
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
  var fsmp = smp( segment.spanF );  // forward span mid point ( { x: <value>, y: <value> } )
  segment.leafTipL = addPt( pctFromXVal( fsmp.x ), pctFromYVal( fsmp.y ) );  // leaf tip left
  segment.leafTipR = addPt( pctFromXVal( fsmp.x ), pctFromYVal( fsmp.y ) );  // leaf tip right
  segment.leafSpanL = addSp( segment.bp1.id, segment.leafTipL.id );  // leaf span left
  segment.leafSpanR = addSp( segment.bp2.id, segment.leafTipR.id );  // leaf span right
  segment.hasLeaves = true;
}

//grows leaves
function growLeaves( plant, segment ) {
  segment.leafSpanL.l = segment.leafSpanR.l += plant.fgr;
}

//displays leaves

function displayLeaves( plant, segment, leafSpan ) {
  var p1x = leafSpan.p1.cx;
  var p1y = leafSpan.p1.cy;
  var p2x = leafSpan.p2.cx;
  var p2y = leafSpan.p2.cy;
  var mpx = ( p1x + p2x ) / 2;  // mid point x
  var mpy = ( p1y + p2y ) / 2;  // mid point y
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = "darkgreen";
  ctx.fillStyle = "green";
  var ah = 0.4;  // arc height
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





////---DISPLAY---////


function display() {
  runVerlet();
  growPlants();
  window.requestAnimationFrame(display);
}

display();






