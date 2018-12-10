



///////////////////////////////////////////////////////////////// 
////////////     Plant Evolution App: Prototype 2     /////////// 
/////////////////////////////////////////////////////////////////

//file:///Users/matthewwmain/Development/projects/plant_evolution_app/prototype_2/index.html



////---INITIATION---////


///trackers
var seeds = [], seedCount = 0;
var plants = [], plantCount = 0;
var sunRays = [], sunRayCount = 0;
var shadows = [], shadowCount = 0;

///settings
var worldSpeed = 1;//5;  // (as frames per iteration: higher is slower) (does not affect physics iterations)
var viewShadows = false;  // (shadow visibility)
var viewStalks = true;  // (stalk visibility) 
var viewLeaves = true;  // (leaf visibility)
var viewFlowers = true;  // (flower visibility)
var restrictGrowthByEnergy = true;  // restricts plant growth by energy level (if false, plants grow freely)
var sunRayIntensity = 1;  // total energy units per sun ray per iteration
var photosynthesisRatio = 1;  // ratio of available sun ray energy stored by a leaf when a ray contacts it
var groEnExp = 0.5;  // growth energy expenditure rate (rate energy is expended for growth)
var livEnExp = 0.2;  // living energy expenditure rate (rate energy is expended for living)
var energyStoreFactor = 1000;  // a plant's maximum storable energy units per segment
var unhealthyEnergyLevelRatio = 0.075;  // ratio of maximum energy when plant becomes unhealthy (starts yellowing)
var sickEnergyLevelRatio = -0.2;  // ratio of maximum energy when plant becomes sick (starts darkening)
var deathEnergyLevelRatio = -1;  // ratio of maximum energy when plant dies (fully darkened)




////---(TESTING)---////

//livEnExp = 2;
energyStoreFactor = 8000;


for ( var i=0; i<5; i++ ) {
  createSeed();
}





////---OBJECTS---////


///colors
var C = {
  //fills
  hdf: { r: 0, g: 100, b: 0, a: 1 },  // healthy dark fill color (dark green)
  hlf: { r: 0, g: 128, b: 0, a: 1 },  // healthy light fill color (green)
  yf: { r: 206, g: 171, b: 45, a: 1 },  // yellowed fill color (sickly yellow)
  df: { r: 94, g: 77, b: 21, a: 1 },  // dead fill color (dark brown)
  //outlines
  hol: { r: 42, g: 32, b: 0, a: 1 },  // healthy outline color (very dark brown)
  yol: { r: 107, g: 90, b: 31, a: 1 },  // yellowed outline color (slightly darker sickly yellow than leaf fill) 
  dol: { r: 42, g: 32, b: 0, a: 1 },  // dead outline color (very dark brown)
  //inner lines
  hil: { r: 0, g: 112, b: 0, a: 1 },  // healthy inner line color (slightly darker green than leaf fill)
  yil: { r: 107, g: 90, b: 31, a: 1 },  // yellowed inner line color (slightly darker sickly yellow than leaf fill) 
  dil: { r: 56, g: 47, b: 12, a: 1 }  // dead inner line color (slightly darker brown than leaf fill)
};

///seed constructor
function Seed() {
  this.sw = 14;  // seed width (universal size reference unit for seed)
  if ( worldTime === 0 ) {
    this.p1 = addPt( Tl.rib(33,66), Tl.rib(5,25) );  // seed point 1 (placed in air for scattering at initiation)
  } else {
    //...place seed inside flower...
  }
  this.p1.width = this.sw*1; 
  this.p1.mass = 5;
  this.p2 = addPt( pctFromXVal( this.p1.cx + this.sw*1.6 ), pctFromYVal( this.p1.cy ) );  // seed point 2
  this.p2.width = this.sw*0.35; this.p2.mass = 5; 
  this.p2.materiality = "immaterial";
  this.sp = addSp( this.p1.id, this.p2.id );  // seed span
  this.sp.strength = 1;
  this.opacity = 1;
  this.planted = false;
  this.hasGerminated = false;
  this.resultingPlant = createPlant( this );
  if ( worldTime === 0 ) { scatterSeed( this ); }  // scatters seeds at initiation
}

///plant constructor
function Plant( sourceSeed ) {
  this.sourceSeed = sourceSeed;
  this.id = plantCount;
  this.segments = []; this.segmentCount = 0;
  this.flowers = []; this.flowerCount = 0;
  this.xLocation = null;
  this.seedEnergy = energyStoreFactor * Tl.rfb(8,12);  // energy level from seed at plant initiation
  this.energy = this.seedEnergy;  // energy (starts with seed energy at germination)
  this.maxEnergyLevel = this.segmentCount * energyStoreFactor;
  this.hasFlowers = false;
  this.isAlive = true;
  //settings
  this.forwardGrowthRate = gravity * Tl.rfb(18,22);  // (rate of cross spans increase per frame)
  this.outwardGrowthRate = this.forwardGrowthRate * Tl.rfb(0.18,0.22);  // (rate forward span widens per frame)
  this.maxSegmentWidth = Tl.rfb(10,12);  // maximum segment width (in pixels)
  this.maxTotalSegments = 10;//Tl.rib(10,25);  // maximum total number of segments at maturity
  this.firstLeafSegment = Tl.rib(2,3);  // (segment on which first leaf set grows)
  this.leafFrequency = Tl.rib(2,3);  // (number of segments until next leaf set)
  this.maxLeaflength = this.maxSegmentWidth * Tl.rfb(4,7);  // maximum leaf length at maturity
  this.leafGrowthRate = this.forwardGrowthRate * Tl.rfb(1.4,1.6);  // leaf growth rate
  //base segement (values assigned at source seed germination)
  this.xLocation = null;  // x value where plant is rooted to the ground
  this.ptB1 = null;  // base point 1
  this.ptB2 = null;  // base point 2
  this.spB = null;  // adds base span
}

///segment constructor
function Segment( plant, parentSegment, basePoint1, basePoint2 ) {
  this.plantId = plant.id;
  this.id = plant.segmentCount;
  this.child = null;
  this.hasChild = false;
  this.parentSegment = parentSegment;
  this.isBaseSegment = false; if (this.parentSegment === null) { this.isBaseSegment = true; }
  this.hasLeaves = false;
  this.hasLeafScaffolding = false;
  //settings
  this.forwardGrowthRateVariation = Tl.rfb(0.95,1.05);  // for left & right span length variation
  this.mass = 1;  // mass of the segment stalk portion ( divided between the two extension points)
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
  this.spCu = addSp( this.ptB1.id, this.ptE2.id );  // upward (l to r) cross span
  if (!this.isBaseSegment) {
    this.spCdP = addSp( this.ptE1.id, this.parentSegment.ptB2.id ); // downward (l to r) cross span to parent
    this.spCuP = addSp( this.parentSegment.ptB1.id, this.ptE2.id ); // upward (l to r) cross span to parent
  }
  //skins
  this.skins = [];
  this.skins.push( addSk( [ this.ptE1.id, this.ptE2.id, this.ptB2.id, this.ptB1.id ], "darkgreen" ) );
  //leaves
  this.ptLf1 = null;  // leaf point 1 (leaf tip)
  this.ptLf2 = null;  // leaf point 2 (leaf tip)  
  this.spLf1 = null;  // leaf 1 Span
  this.spLf2 = null;  // leaf 2 Span
  //colors
  this.clS = C.hdf;  // stalk color (dark green when healthy)
  this.clL = C.hlf;  // leaf color (green when healthy)
  this.clO = C.hol;  // outline color (very dark brown when healthy)
  this.clI = C.hil;  // inner line color (slightly darker green than leaf fill when healthy) 
}

///flower constructor {{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
function Flower( plant, parentSegment, basePoint1, basePoint2 ) {
  this.plantId = plant.id;
  this.id = plant.flowerCount;
  this.parentSegment = parentSegment;
  this.mass = 0;
  //ovule points
  this.ptBL = basePoint1;  // base point left
  this.ptBR = basePoint2;  // base point right
  //hex points
  var pfsmp = spanMidPoint( this.parentSegment.spF );  // parent forward span mid point
  var pbsmp = midPoint( this.parentSegment.ptB1, this.parentSegment.ptB2 );  // parent base span mid point
  var hexOriginX = pfsmp.x + ( pfsmp.x - pbsmp.x ) * 0.25;  // hex's origin x position ahead of growth
  var hexOriginY = pfsmp.y + ( pfsmp.y - pbsmp.y ) * 0.25;  // hex's origin y position ahead of growth
  this.ptHbL = addPt( pctFromXVal( hexOriginX ), pctFromYVal( hexOriginY ) );  // hex bottom left point
  this.ptHbR = addPt( pctFromXVal( hexOriginX ), pctFromYVal( hexOriginY ) );  // hex bottom right point
  this.ptHoL = addPt( pctFromXVal( hexOriginX ), pctFromYVal( hexOriginY ) );  // hex outer left point
  this.ptHoR = addPt( pctFromXVal( hexOriginX ), pctFromYVal( hexOriginY ) );  // hex outer right point
  this.ptHtL = addPt( pctFromXVal( hexOriginX ), pctFromYVal( hexOriginY ) );  // hex top left point
  this.ptHtR = addPt( pctFromXVal( hexOriginX ), pctFromYVal( hexOriginY ) );  // hex top right point
  this.ptHbL.mass = this.ptHbR.mass = this.mass;
  this.ptHoL.mass = this.ptHoR.mass = this.mass;
  this.ptHtL.mass = this.ptHtR.mass = this.mass;
  //ovule spans
  this.spOiL = addSp( this.ptBL.id, this.ptHbL.id );  // ovule inner left span
  this.spOiR = addSp( this.ptBR.id, this.ptHbR.id );  // ovule inner right span
  this.spCd = addSp( this.ptHbL.id, this.ptBR.id );  // downward (l to r) cross span
  this.spCu = addSp( this.ptBL.id, this.ptHbR.id );  // upward (l to r) cross span
  this.spCdP = addSp( this.ptHbL.id, this.parentSegment.ptB2.id );  // downward (l to r) cross span to parent
  this.spCuP = addSp( this.parentSegment.ptB1.id, this.ptHbR.id );  // upward (l to r) cross span to parent
  this.spOoL = addSp( this.ptBL.id, this.ptHoL.id );  // ovule outer left span 
  this.spOoR = addSp( this.ptBR.id, this.ptHoR.id );  // ovule outer right span 
  //hex (polinator pad) spans
  this.spHbM = addSp( this.ptHbL.id, this.ptHbR.id );  // hex bottom middle span
  this.spHbL = addSp( this.ptHbL.id, this.ptHoL.id );  // hex bottom left span
  this.spHbR = addSp( this.ptHbR.id, this.ptHoR.id );  // hex bottom right span
  this.spHtL = addSp( this.ptHoL.id, this.ptHtL.id );  // hex top left span
  this.spHtR = addSp( this.ptHtR.id, this.ptHoR.id );  // hex top right span
  this.spHtM = addSp( this.ptHtL.id, this.ptHtR.id );  // hex top middle span
  this.spHcH = addSp( this.ptHoL.id, this.ptHoR.id );  // hex cross horizontal span
  this.spHcDB = addSp( this.ptHtL.id, this.ptBR.id );  // hex cross downward span to flower base
  this.spHcUB = addSp( this.ptBL.id, this.ptHtR.id );  // hex cross upward span to flower base
  //bud tip point & scaffolding
  var htmmp = spanMidPoint( this.spHtM );  // hex top middle span mid point
  this.ptBudTip = addPt( pctFromXVal( htmmp.x ), pctFromYVal( htmmp.y ), "immaterial" );  // bud tip point
  this.ptBudTip.mass = this.mass;
  this.spBTSL = addSp( this.ptBudTip.id, this.ptHoL.id, "hidden" );  // bud tip scaffolding left span
  this.spBTSR = addSp( this.ptBudTip.id, this.ptHoR.id, "hidden" );  // bud tip scaffolding right span

  // //petals
  // // (top left petal)
  // this.ptPtL = addPt( pctFromXVal(this.ptBudTip.cx), pctFromYVal(this.ptBudTip.cy) );  // petal top left point  
  // this.ptPtL.mass = this.mass;
  // this.spPtLS = addSp( this.ptPtL.id, this.ptBudTip.id );  // petal top left scaffolding span to (bud tip point)
  // // (top middle petal)
  // this.ptPtM = addPt( pctFromXVal(this.ptBudTip.cx), pctFromYVal(this.ptBudTip.cy) );  // petal top middle point  
  // this.ptPtM.mass = this.mass;
  // this.spPtMS = addSp( this.ptPtM.id, this.ptBudTip.id );  // petal top middle scaffolding span to (bud tip point)
  // // (top right petal)
  // this.ptPtR = addPt( pctFromXVal(this.ptBudTip.cx), pctFromYVal(this.ptBudTip.cy) );  // petal top right point  
  // this.ptPtR.mass = this.mass;
  // this.spPtRS = addSp( this.ptPtR.id, this.ptBudTip.id );  // petal top right scaffolding span to (bud tip point)
  // // (bottom left petal)
  // this.ptPbL = addPt( pctFromXVal(this.ptBudTip.cx), pctFromYVal(this.ptBudTip.cy) );  // petal bottom left point  
  // this.ptPbL.mass = this.mass;
  // this.spPbLS = addSp( this.ptPbL.id, this.ptBudTip.id );  // petal bottom left scaffolding span to (bud tip point)
  // // (bottom middle petal)
  // this.ptPbM = addPt( pctFromXVal(this.ptBudTip.cx), pctFromYVal(this.ptBudTip.cy) );  // petal bottom middle point  
  // this.ptPbM.mass = this.mass;
  // this.spPbMS = addSp( this.ptPbM.id, this.ptBudTip.id );  // petal bottom middle scaffolding span to (bud tip point)
  // // (bottom right petal)
  // this.ptPbR = addPt( pctFromXVal(this.ptBudTip.cx), pctFromYVal(this.ptBudTip.cy) );  // petal bottom right point  
  // this.ptPbR.mass = this.mass;
  // this.spPbRS = addSp( this.ptPbR.id, this.ptBudTip.id );  // petal bottom right scaffolding span to (bud tip point)


  //colors
  this.clB = C.hdf;  // bud color (dark green when healthy)
  this.clO = C.hol;  // outline color (very dark brown when healthy)
  this.clI = C.hil;  // inner line color (slightly darker green than leaf fill when healthy) 
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




////---FUNCTIONS---////


/// Instance Creators ///

///creates a new seed
function createSeed() {
  seedCount++;
  seeds.push( new Seed() );
  return seeds[seeds.length-1];
}

///creates a new plant
function createPlant( sourceSeed ) {
  plantCount++;
  plants.push( new Plant( sourceSeed ) );
  return plants[plants.length-1];
}

///creates a new segment
function createSegment( plant, parentSegment, basePoint1, basePoint2 ) {
  plant.segmentCount++;
  plant.maxEnergyLevel = plant.segmentCount * energyStoreFactor;
  plant.segments.unshift( new Segment( plant, parentSegment, basePoint1, basePoint2 ) );
  if (parentSegment !== null) {
    parentSegment.child = plant.segments[0];
    parentSegment.hasChild = true;
  }
}

///creates a new flower {{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
function createFlower( plant, parentSegment, basePoint1, basePoint2 ) {
  plant.flowerCount++;
  plant.flowers.push( new Flower( plant, parentSegment, basePoint1, basePoint2 ) );
  plant.hasFlowers = true;
  parentSegment.child = plant.flowers[plant.flowers.length-1];
  parentSegment.hasChild = true;
}

///creates a new sun ray (one for each x value as an integer percentage of the canvas's width)
function createSunRays() {
  for ( var i=0; i<101; i++ ) {
    sunRays.push( new SunRay() );
    sunRayCount++;
  }
}


/// Component Functions ///

///scatters seeds (for initiation)
function scatterSeed( seed ) {
  seed.p1.px += Tl.rfb(-5,5); seed.p1.py += Tl.rfb(-5,5);
  seed.p2.px += Tl.rfb(-5,5); seed.p2.py += Tl.rfb(-5,5);
}

///plants seed (secures its position to ground)
function plantSeed( seed ) {
  seed.p1.fixed = true;
  seed.p1.materiality = "immaterial"; 
  if ( seed.p1.cy < canvas.height-1 ) {
    seed.p1.cy += 1.5;
    seed.p2.cy += 1.5; 
  } else { 
    seed.planted = true;
  }
}

///germinates seeds when ready (after it's been planted)
function germinateSeedWhenReady( seed ) {
  // if ( seed.p2.cy > canvas.height + seed.sp.l - seed.p1.width/2 && !seed.planted ) {
  if ( seed.p1.cy > canvas.height-seed.p1.width/2-0.5 && !seed.planted ) {    
    plantSeed( seed );
  }
  if ( seed.planted && !seed.hasGerminated ) {
    germinateSeed( seed );
  }
  if ( seed.hasGerminated && seed.opacity > 0 ) {
    fadeSeedOut( seed );  // slowly hides seen after germination
  }
}

///germinates seed and establishes plant's base segment, setting growth in motion
function germinateSeed( seed ) {
  var plant = seed.resultingPlant;
  plant.xLocation = pctFromXVal( seed.p1.cx );
  plant.ptB1 = addPt( plant.xLocation - 0.1, 100 );  // base point 1
  plant.ptB2 = addPt( plant.xLocation + 0.1, 100 );  // base point 2
  plant.ptB1.fixed = plant.ptB2.fixed = true;  // fixes base points to ground
  plant.spB = addSp( plant.ptB1.id, plant.ptB2.id );  // adds base span
  createSegment( plant, null, plant.ptB1, plant.ptB2 );  // creates the base segment (with "null" parent)
  seed.hasGerminated = true;
}

///fades out seed visibility gradually after germination
function fadeSeedOut( seed ) {
  seed.opacity -= 0.0015;
}

///lengthens segment spans for growth
function lengthenSegmentSpans( plant, segment ) {
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

///checks whether a segment is ready to generate a child segment
function readyForChildSegment( plant, segment ) {
  return segment.spF.l > plant.maxSegmentWidth * 0.333 && 
         !segment.hasChild && 
         plant.segmentCount < plant.maxTotalSegments;
}

///generates leaves when segment is ready
function generateLeavesWhenReady( plant, segment ) {
  var p = plant;
  var s = segment;
  if (  s.id === p.firstLeafSegment || 
        (s.id-p.firstLeafSegment) > 0 &&
        (s.id-p.firstLeafSegment) % p.leafFrequency === 0 && 
        s.spF.l > p.maxSegmentWidth * 0.1 ) {
    var fsmp = spanMidPoint( s.spF );  // forward span mid point
    var pbsmp = midPoint( s.parentSegment.ptB1, s.parentSegment.ptB2 );  // parent base span mid point
    var xTip = fsmp.x + ( fsmp.x - pbsmp.x ) * 0.25;  // new leaf tip x location
    var yTip = fsmp.y + ( fsmp.y - pbsmp.y ) * 0.25;  // new leaf tip y location
    s.ptLf1 = addPt( pctFromXVal( xTip ), pctFromYVal( yTip ) );  // leaf 1 tip point (left)
    s.ptLf2 = addPt( pctFromXVal( xTip ), pctFromYVal( yTip ) );  // leaf 2 tip point (right)
    s.spLf1 = addSp( s.ptB1.id, s.ptLf1.id );  // leaf 1 span (left)
    s.spLf2 = addSp( s.ptB2.id, s.ptLf2.id );  // leaf 2 span (right)
    s.leafTipsTetherSpan = addSp( s.ptLf1.id, s.ptLf2.id );  // leaf tip tether span
    s.hasLeaves = true;
  }
}

///adds leaf scaffolding (so leaves stay more or less horizontal, depending on stalk angle)
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

///checks whether a segment is ready to generate a flower  {{{{{{{{{{{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}}}}}}
function readyForFlower( plant, segment ) {
  return  segment.id === plant.maxTotalSegments && 
          !plant.hasFlowers && 
          segment.spF.l > plant.maxSegmentWidth*0.333; 
}

///lengthens flower spans for bud growth & blooming  {{{{{{{{{{{{{{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
function growFlower( plant, flower ) {
  var p = plant, f = flower;
  var pfgr = p.forwardGrowthRate;  // plant forward growth rate
  var fbw = p.maxSegmentWidth;  // flower base width (at maturity)
  var bhgr = f.spHbM.l < fbw*0.3 ? pfgr*1.5 : pfgr*0.5; // bud height growth rate (slows when stability established)
  var fogr = p.outwardGrowthRate*1.5; // flower outward growth rate
  if ( f.spHbM.l < fbw ) {
    //ovule
    f.spOiL.l = distance( f.ptBL, f.ptHbL);  // ovule inner left span
    f.spOiR.l = f.spOiL.l;  // ovule inner rightspan
    f.spCd.l = distance( f.ptHbL, f.ptBR );  // downward cross span
    f.spCu.l = f.spCd.l;  // upward cross span
    f.spCdP.l = distance( f.ptHbL, f.parentSegment.ptB2 ) + pfgr;  // downward cross span to parent
    f.spCuP.l = f.spCdP.l;  // upward cross span to parent
    f.spOoL.l = distance( f.ptBL, f.ptHoL );  // ovule outer left span 
    f.spOoR.l = f.spOoL.l;  // ovule outer right span  
    //hex (polinator pad)
    f.spHbM.l += fogr;  // hex bottom middle span
    f.spHbL.l = f.spHbM.l;  // hex lower left span
    f.spHbR.l = f.spHbM.l;  // hex lower right span
    f.spHtL.l = f.spHbM.l;  // hex top left span
    f.spHtR.l = f.spHbM.l;  // hex top right span
    f.spHtM.l = f.spHbM.l;  // hex top middle span
    f.spHcH.l = f.spHbM.l*2.5;  // hex cross horizontal span
    f.spHcDB.l = distance( f.ptHtL, f.ptBR ) + bhgr;  // hex cross downward span to flower base
    f.spHcUB.l = f.spHcDB.l;  // hex cross upward span to flower base
    //bud tip point & scaffolding
    var htmmp = spanMidPoint( f.spHtM );  // hex top middle span mid point
    var hbmmp = spanMidPoint( f.spHbM );  // hex bottom middle span mid point
    var budTipX = htmmp.x + ( htmmp.x - hbmmp.x ) * 1.5;  // bud tip x value
    var budTipY = htmmp.y + ( htmmp.y - hbmmp.y ) * 1.5;  // bud tip y value
    f.ptBudTip.cx = budTipX;  // bud tip x value
    f.ptBudTip.cy = budTipY;  // bud tip y value
    f.spBTSL.l = distance( f.ptBudTip, f.ptHoL );  // petal bottom middle left span
    f.spBTSR.l = distance( f.ptBudTip, f.ptHoR );  // petal bottom middle right span

    // //petals
    // // (top left petal)
    // f.ptPtL.cx = budTipX; f.ptPtL.cy = budTipY;  // syncs top left petal tip with bud tip during bud growth
    // // (top middle petal)
    // f.ptPtM.cx = budTipX; f.ptPtM.cy = budTipY;  // syncs top petal tip with bud tip during bud growth
    // // (top right petal)
    // f.ptPtR.cx = budTipX; f.ptPtR.cy = budTipY;  // syncs top right petal tip with bud tip during bud growth
    // // (bottom left petal)
    // f.ptPbL.cx = budTipX; f.ptPbL.cy = budTipY;  // syncs bottom left petal tip with bud tip during bud growth
    // // (bottom middle petal)
    // f.ptPbM.cx = budTipX; f.ptPbM.cy = budTipY;  // syncs bottom petal tip with bud tip during bud growth
    // // (bottom right petal)
    // f.ptPbR.cx = budTipX; f.ptPbR.cy = budTipY;  // syncs bottom right petal tip with bud tip during bud growth

  }
}

///grows all plants
function growPlants() {
  for (var i=0; i<plants.length; i++) {
    var plant = plants[i];
    germinateSeedWhenReady( plant.sourceSeed );  // germinates a planted seed
    if ( plant.energy > plant.segmentCount*energyStoreFactor && plant.energy>plant.seedEnergy ) {
      plant.energy = plant.segmentCount*energyStoreFactor;  // caps plant max energy level based on segment count
    }
    if ( plant.energy > 0 || !restrictGrowthByEnergy ) {  // checks if plant has energy for growth (>0)
      for (var j=0; j<plant.segments.length; j++) {
        var segment = plant.segments[j];
        if ( segment.spF.l < plant.maxSegmentWidth /*&& plant.segments.length < plant.maxTotalSegments*/ ) { 
          lengthenSegmentSpans( plant, segment );  // lengthens segment spans until segment fully grown
          plant.energy -= segment.spCd.l * groEnExp;  // reduces energy by segment size
        }
        if ( readyForChildSegment( plant, segment ) ) { 
          createSegment( plant, segment, segment.ptE1, segment.ptE2 );  // generates new segment
        }
        if ( !segment.hasLeaves ) { 
          generateLeavesWhenReady( plant, segment );  // generates new leaf set
        } else if ( /*plant.segments.length < plant.maxTotalSegments*/true ) {
          growLeaves( plant, segment );  // grows leaves until leaves are fully grown
          plant.energy -= ( segment.spLf1.l + segment.spLf2.l ) * groEnExp;  // reduces energy by leaf length
        }

        //{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
        if ( readyForFlower( plant, segment ) ) {
          createFlower( plant, segment, segment.ptE1, segment.ptE2 );        }
      }

      //{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
      if ( plant.hasFlowers ) {
        for ( var k=0; k<plant.flowers.length; k++ ) {
          var flower = plant.flowers[k];
          growFlower( plant, flower );
        }
      }

    }
    plant.energy -= plant.segmentCount * livEnExp;  // cost of living: reduces energy by a ratio of segment count 
    if ( plant.energy < plant.maxEnergyLevel*deathEnergyLevelRatio && restrictGrowthByEnergy ) {
      killPlant( plant );  // plant dies if energy level falls below minimum to be alive
    }
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
    for ( var j=0; j<p.segments.length; j++ ) {
      var s = p.segments[j];
      if ( s.hasLeaves ) {
        var p1, p2, lcy;
        //leaf 1
        //assigns p1 as leftmost leaf span point and p2 as rightmost leaf span point
        if ( s.ptLf1.cx < s.ptB1.cx ) { p1 = s.ptLf1; p2 = s.ptB1; } else { p1 = s.ptB1; p2 = s.ptLf1; }  
        //loops through leaf span's integer x values
        var xPctMin = Math.ceil( pctFromXVal( p1.cx ) );
        var xPctMax = Math.floor( pctFromXVal( p2.cx ) );
        for ( var lcx=xPctMin; lcx<=xPctMax; lcx++ ) {  // leaf contact x value
          lcy = p1.cy + (xValFromPct(lcx)-p1.cx) * (p2.cy-p1.cy) / (p2.cx-p1.cx);  // leaf contact y value
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

///shifts a color between start and end colors scaled proportionally to start and end plant energy levels
function colorShift( plant, startColor, endColor, startEnergy, endEnergy ) {
  var p = plant;
  var curEn = p.energy;  // current energy level
  var r = endColor.r - ( (curEn-endEnergy) * (endColor.r-startColor.r) / (startEnergy-endEnergy) );  // redshift
  var g = endColor.g - ( (curEn-endEnergy) * (endColor.g-startColor.g) / (startEnergy-endEnergy) );  // greenshift
  var b = endColor.b - ( (curEn-endEnergy) * (endColor.b-startColor.b) / (startEnergy-endEnergy) );  // blueshift
  return { r: r, g: g, b: b, a: 1 };
}

///changes plant colors based on plant health
function applyHealthColoration( plant, segment ) {
  var p = plant;
  var s = segment;
  var cel = p.energy;  // current energy level
  var uel = p.maxEnergyLevel * unhealthyEnergyLevelRatio;  // unhealthy energy level ( starts yellowing)
  var sel = p.maxEnergyLevel * sickEnergyLevelRatio;  // sick energy level (starts darkening)
  var fel = p.maxEnergyLevel * deathEnergyLevelRatio;  // fatal energy level (fully darkened; dead)
  if ( cel <= uel && cel > sel )  {  // unhealthy energy levels (yellowing)
    s.clS = colorShift( p, C.hdf, C.yf, uel, sel );  // stalks (dark fills)
    s.clL = colorShift( p, C.hlf, C.yf, uel, sel );  // leaves (light fills)
    s.clO = colorShift( p, C.hol, C.yol, uel, sel );  // outlines
    s.clI = colorShift( p, C.hil, C.yil, uel, sel );  // inner lines
  } else if ( cel <= sel && cel > fel ) {  // sick energy levels (darkening)
    s.clS = colorShift( p, C.yf, C.df, sel, fel );  // stalks 
    s.clL = colorShift( p, C.yf, C.df, sel, fel );  // leaves
    s.clO = colorShift( p, C.yol, C.dol, sel, fel );  // outlines
    s.clI = colorShift( p, C.yil, C.dil, sel, fel );  // inner lines
  }
  if ( p.hasFlowers && s.id === 1 ) {
    for ( var i=0; i<p.flowers.length; i++ ) {
      var f = p.flowers[i];
      f.clB = s.clS;  // flower bud fills
      f.clO = s.clO;  // flower bud outlines
    }
  }
}

/// kills plant if its energy level falls below minimum to be alive
function killPlant( plant ) {
  var p = plant;
  plant.isAlive = false;  
  for (var i=0; i<plant.segments.length; i++) {
    var s = plant.segments[i];
    if ( s.hasLeaves && s.spLf1.l > plant.maxLeaflength/3 ) {  
      // removes large leaf bud tethers 
      removeSpan( s.leafTipsTetherSpan.id );
    }
    if ( s.hasLeafScaffolding ) {  
      // removes leaf scaffolding 
      removeSpan(s.spLf1ScA.id);
      removeSpan(s.spLf2ScA.id);
    }
    if ( s.hasLeaves && s.ptLf1.cy>s.ptB1.cy && s.ptLf2.cy>s.ptB2.cy ) {  
      // prevents dead leaves from swinging like pendulums
      s.ptLf1.mass = s.ptLf2.mass = 0.5;
      if ( s.ptLf1.cy < s.ptLf1.py ) { s.ptLf1.cy = s.ptLf1.py; s.ptLf1.cx = s.ptLf1.px; }
      if ( s.ptLf2.cy < s.ptLf2.py ) { s.ptLf2.cy = s.ptLf2.py; s.ptLf2.cx = s.ptLf2.px; }
    }
    // //removes inner spans for total collapse (*currently too clunky; revisit & improve during stylization)
    // removeSpan(s.spCd.id);  // downward (l to r) cross span
    // removeSpan(s.spCu.id);  // upward (l to r) cross span
    // if (!s.isBaseSegment) {
    //   removeSpan(s.spCdP.id);  // downward (l to r) cross span to parent
    //   removeSpan(s.spCuP.id);  // upward (l to r) cross span to parent
    // }
  }
}

/// Renderers ///

///renders seeds
function renderSeed( resultingPlant ) {
  var seed = resultingPlant.sourceSeed;
  //point instances (centers of the two component circles)
  var p1 = seed.p1;
  var p2 = seed.p2;
  var sp = seed.sp;
  var p1x = p1.cx; 
  var p1y = p1.cy;
  var p2x = p2.cx; 
  var p2y = p2.cy;
  //references points (polar points)
  var r1x = p1.cx - ( p2.cx - p1.cx ) * (p1.width*0.5 / sp.l );
  var r1y = p1.cy - ( p2.cy - p1.cy ) * (p1.width*0.5 / sp.l );
  var r2x = p2.cx + ( p2.cx - p1.cx ) * (p2.width*0.5 / sp.l );
  var r2y = p2.cy + ( p2.cy - p1.cy ) * (p2.width*0.5 / sp.l );
  //bezier handle lengths
  var h1l = seed.sw*0.85;
  var h2l = seed.sw*0.35;
  //top bezier handles points
  var h1x = r1x + h1l * ( p1y - r1y ) / (p1.width*0.5);
  var h1y = r1y - h1l * ( p1x - r1x ) / (p1.width*0.5);
  var h2x = r2x - h2l * ( p2y - r2y ) / (p2.width*0.5);
  var h2y = r2y - h2l * ( r2x - p2x ) / (p2.width*0.5);
  //bottom bezier handles points
  var h3x = r2x + h2l * ( p2y - r2y ) / (p2.width*0.5);
  var h3y = r2y + h2l * ( r2x - p2x ) / (p2.width*0.5);
  var h4x = r1x - h1l * ( p1y - r1y ) / (p1.width*0.5);
  var h4y = r1y + h1l * ( p1x - r1x ) / (p1.width*0.5);
  //draws seeds
  ctx.lineWidth = 0;
  ctx.strokeStyle = "rgba( 0, 0, 0, "+seed.opacity+" )";
  ctx.fillStyle = "rgba( 81, 64, 20, "+seed.opacity+" )";
  ctx.beginPath();
  ctx.moveTo( r1x, r1y );
  ctx.bezierCurveTo( h1x, h1y, h2x, h2y, r2x, r2y );
  ctx.bezierCurveTo( h3x, h3y, h4x, h4y, r1x, r1y );
  ctx.stroke();
  ctx.fill();
  //checks seeds while iterating
}

///renders leaf
function renderLeaf( plant, segment, leafSpan ) {
  var p = plant, s = segment, lSp = leafSpan;
  var p1x = lSp.p1.cx;
  var p1y = lSp.p1.cy;
  var p2x = lSp.p2.cx;
  var p2y = lSp.p2.cy;
  var mpx = ( p1x + p2x ) / 2;  // mid point x
  var mpy = ( p1y + p2y ) / 2;  // mid point y
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba("+s.clO.r+","+s.clO.g+","+s.clO.b+","+s.clO.a+")";
  ctx.fillStyle = "rgba("+s.clL.r+","+s.clL.g+","+s.clL.b+","+s.clL.a+")";
  var ah = 0.35;  // arc height (as ratio of leaf length)
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
  ctx.strokeStyle = "rgba("+s.clI.r+","+s.clI.g+","+s.clI.b+","+s.clI.a+")";
  ctx.moveTo(p1x,p1y);
  ctx.lineTo(p2x,p2y);
  ctx.stroke();
}

///renders leaves
function renderLeaves( plant, segment ) {
  if ( segment.hasLeaves ) {
    renderLeaf( plant, segment, segment.spLf1 );
    renderLeaf( plant, segment, segment.spLf2 );
    if ( viewShadows ) { markShadowPositions( segment ); }
  }
}

///renders stalks
function renderStalks( plant, segment ) {
  var sg = segment;
  for (var i=0; i<sg.skins.length; i++) {
    var sk = segment.skins[i];
    //fills
    ctx.beginPath();
    ctx.fillStyle = "rgba("+sg.clS.r+","+sg.clS.g+","+sg.clS.b+","+sg.clS.a+")";
    ctx.lineWidth = 1;
    ctx.strokeStyle = ctx.fillStyle;
    ctx.moveTo(sk.points[0].cx, sk.points[0].cy);
    for(var j=1; j<sk.points.length; j++) { ctx.lineTo(sk.points[j].cx, sk.points[j].cy); }
    ctx.lineTo(sk.points[0].cx, sk.points[0].cy);
    ctx.stroke();
    ctx.fill(); 
    //outlines
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba("+sg.clO.r+","+sg.clO.g+","+sg.clO.b+","+sg.clO.a+")";
    ctx.moveTo(sk.points[3].cx, sk.points[3].cy);
    ctx.lineTo(sk.points[0].cx, sk.points[0].cy);
    ctx.moveTo(sk.points[2].cx, sk.points[2].cy);
    ctx.lineTo(sk.points[1].cx, sk.points[1].cy);
    ctx.stroke();
    if ( !segment.hasChild ) {
      ctx.beginPath();
      ctx.moveTo(sk.points[3].cx, sk.points[3].cy);
      ctx.lineTo(sk.points[2].cx, sk.points[2].cy);
      ctx.stroke();
    }
  }
}

///renders flowers {{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
function renderFlowers( plant ) {
  if ( plant.hasFlowers ) {
    for ( var i=0; i<plant.flowers.length; i++) {
      var f = plant.flowers[i];
      //top petals
      ctx.beginPath();
      ctx.fillStyle = "rgba("+f.clB.r+","+f.clB.g+","+f.clB.b+","+f.clB.a+")";  // dark green
      ctx.strokeStyle = "rgba("+f.clO.r+","+f.clO.g+","+f.clO.b+","+f.clO.a+")";  // dark brown
      ctx.lineWidth = 1;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.moveTo(f.ptHoL.cx, f.ptHoL.cy);
      ctx.lineTo(f.ptBudTip.cx, f.ptBudTip.cy);
      ctx.lineTo(f.ptHtL.cx, f.ptHtL.cy);
      ctx.lineTo(f.ptBudTip.cx, f.ptBudTip.cy);
      ctx.lineTo(f.ptHtR.cx, f.ptHtR.cy);
      ctx.lineTo(f.ptBudTip.cx, f.ptBudTip.cy);
      ctx.lineTo(f.ptHoR.cx, f.ptHoR.cy);
      ctx.fill();
      ctx.stroke();
      //hex (polinator pad)
      ctx.beginPath();
      ctx.fillStyle = "yellow";
      ctx.moveTo(f.ptHtR.cx, f.ptHtR.cy);
      ctx.lineTo(f.ptHoR.cx, f.ptHoR.cy);
      ctx.lineTo(f.ptHbR.cx, f.ptHbR.cy);
      ctx.lineTo(f.ptHbL.cx, f.ptHbL.cy);
      ctx.lineTo(f.ptHoL.cx, f.ptHoL.cy);
      ctx.lineTo(f.ptHtL.cx, f.ptHtL.cy);
      ctx.fill();
      ctx.beginPath();
      ctx.strokeStyle = "rgba("+f.clO.r+","+f.clO.g+","+f.clO.b+","+f.clO.a+")";  // dark brown
      ctx.lineWidth = 1;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.moveTo(f.ptHoL.cx, f.ptHoL.cy);
      ctx.lineTo(f.ptHtL.cx, f.ptHtL.cy);
      ctx.lineTo(f.ptHtR.cx, f.ptHtR.cy);
      ctx.lineTo(f.ptHoR.cx, f.ptHoR.cy);
      ctx.stroke();
      //bottom petals & ovule
      ctx.beginPath();
      ctx.fillStyle = "rgba("+f.clB.r+","+f.clB.g+","+f.clB.b+","+f.clB.a+")";  // dark green
      ctx.strokeStyle = "rgba("+f.clO.r+","+f.clO.g+","+f.clO.b+","+f.clO.a+")";  // dark brown
      ctx.lineWidth = 1;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.moveTo(f.ptBL.cx, f.ptBL.cy);
      ctx.lineTo(f.ptHoL.cx, f.ptHoL.cy);
      ctx.lineTo(f.ptBudTip.cx, f.ptBudTip.cy);
      ctx.lineTo(f.ptHbL.cx, f.ptHbL.cy);
      ctx.lineTo(f.ptBudTip.cx, f.ptBudTip.cy);
      ctx.lineTo(f.ptHbR.cx, f.ptHbR.cy);
      ctx.lineTo(f.ptBudTip.cx, f.ptBudTip.cy);
      ctx.lineTo(f.ptHoR.cx, f.ptHoR.cy);
      ctx.lineTo(f.ptBR.cx, f.ptBR.cy);
      ctx.fill();
      ctx.stroke();
    }
  }
}

///renders plants (sequentially)
function renderPlants() {
  for (var i=0; i<plants.length; i++) {
    var plant = plants[i];
    if ( viewFlowers ) { renderFlowers( plant ); }
    for (var j=0; j<plants[i].segments.length; j++) {
      var segment = plant.segments[j];
      if ( restrictGrowthByEnergy ) { applyHealthColoration( plant, segment ); }
      if ( viewStalks ) { renderStalks( plant, segment ); }
      if ( viewLeaves ) { renderLeaves( plant, segment ); }
    }
    renderSeed( plant );
  }
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




////---DISPLAY---////


function display() {
  runVerlet();
  if ( worldTime % worldSpeed === 0 ) { 
    shedSunlight();
    growPlants(); 
  }
  renderPlants();
  if ( viewShadows ) { renderShadows(); }
  window.requestAnimationFrame(display);


              ///////// TESTING /////////
              // if ( worldTime % 120 === 0 && plants[0].segments.length > 0) { 
              //   var p = plants[0], s = p.segments[0];
              //   console.log(p.id+" fatal energy level: "+p.maxEnergyLevel*deathEnergyLevelRatio);
              //   console.log(p.id+" current energy level: "+p.energy);
              //   console.log(p.id+" leaf fill color: "+s.clL.r+", "+s.clL.g+", "+s.clL.b);
              // }


}

createSunRays();
display();








