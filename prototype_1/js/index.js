



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
  this.fgr = gravity * Tool.rfb(20,20);//(5,7);  // forward growth rate (rate of cross spans increase per frame)
  this.ogr = this.fgr * Tool.rfb(0.45,0.55);  // outward growth rate (rate forward span widens per frame)
  this.msw = Tool.rfb(50,50);//(16,18);  // maximum segment width, in pixels
  this.mts = Tool.rib(18,18);//(15,25);  // maximum total number of segments
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
  this.hasRightLeaf = this.hasLeftLeaf = false;
  //settings
  this.fgrv = Tool.rfb(0.95,1.05);  // forward growth rate variation
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
  if (this.isBaseSegment) {
    this.spanCd = addSp( this.ep1.id, this.bp2.id );  // downward (l to r) cross span, for base
    this.spanCu = addSp( this.bp1.id, this.ep2.id );  // new upward (l to r) cross span, for base
  } else {
    this.spanCd = addSp( this.ep1.id, this.parentSegment.bp2.id ); // downward (l to r) cross span, for all others
    this.spanCu = addSp( this.parentSegment.bp1.id, this.ep2.id ); // upward (l to r) cross span, for all others
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
          segment.spanCd.l = distance( segment.ep1, segment.bp2 ) + plant.fgr*0.75;
          segment.spanCu.l = segment.spanCd.l;
        } else {
          segment.spanCd.l = distance( segment.ep1, segment.parentSegment.bp2 ) + plant.fgr;
          segment.spanCu.l = segment.spanCd.l * segment.fgrv;
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
      if ( segment.id % 5 === 0 && !segment.hasRightLeaf && segment.spanF.l > plant.msw * 0) { 
        generateLeaf( plant, segment ); 
      } 
      if ( segment.hasRightLeaf && segment.leafSpanCf.l < segment.spanF.l * 4 ) { 
        growLeaf( plant, segment );
      }

    }
  }
}

//checks whether a segment is ready to generate a child segment
function readyForChildSegment( plant, segment ) {
  return segment.spanF.l > plant.msw * 0.333 && !segment.hasChildSegment && plant.segments.length < plant.mts;
}

//generates leaf
function generateLeaf ( plant, segment ) {
  segment.leafPointR = addPt( pctFromXVal(segment.ep2.cx), pctFromYVal(segment.ep2.cy) );  // leaf point right
  segment.leafSpanCf = addSp( segment.bp1.id, segment.leafPointR.id );  // leaf span center front
  segment.leafSpanU = addSp( segment.ep2.id, segment.leafPointR.id, "hidden" );  // leaf span upper
  segment.hasRightLeaf = true;
}

//grows leaf
function growLeaf( plant, segment ) {
  segment.leafPointR.px = segment.leafPointR.cx += plant.fgr;
  segment.leafPointR.py = segment.leafPointR.cy = segment.ep2.cy;
  segment.leafSpanCf.l = distance( segment.bp1, segment.leafPointR );
  segment.leafSpanU.l = distance( segment.ep2, segment.leafPointR );
}




////---DISPLAY---////


function display() {
  runVerlet();
  growPlants();
  window.requestAnimationFrame(display);
}

display();






