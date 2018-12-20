



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
var viewPods = true;  // (pod visibilty)
var restrictGrowthByEnergy = true;  // restricts plant growth by energy level (if false, plants grow freely)
var sunRayIntensity = 1;  // total energy units per sun ray per iteration
var photosynthesisRatio = 1;  // ratio of available sun ray energy stored by a leaf when a ray contacts it
var seedsPerFlower = 2;  // number of seeds produced by a fertilized flower
var groEnExp = 0.5;  // growth energy expenditure rate (rate energy is expended for growth)
var livEnExp = 0.2;  // living energy expenditure rate (rate energy is expended for living)
var energyStoreFactor = 1000;  // a plant's maximum storable energy units per segment
var oldAge = 30000;  // (age when plant starts dying of old age, in worldtime units)
var agingFactor = oldAge/10;  // (factor of energy decrease per iteration after old age reached)
var unhealthyEnergyLevelRatio = 0.075;  // ratio of maximum energy when plant becomes unhealthy (starts yellowing)
var flowerFadeEnergyLevelRatio = -0.025;  // ratio of maximum energy when flower begins to fade
var polinatorPadFadeEnergyLevelRatio = -0.075;  // ratio of maximum energy when polinator pad begins to fade
var sickEnergyLevelRatio = -0.2;  // ratio of maximum energy when plant becomes sick (starts darkening)
var podOpenEnergyLevelRatio = -0.4;//-0.5; // ratio of maximum energy when seed pod disperses seeds
var deathEnergyLevelRatio = -0.6;//-1;  // ratio of maximum energy when plant dies (fully darkened)
var collapseEnergyLevelRatio = -0.7;//-1.1;  // ratio of maximum energy when plant collapses




////---(TESTING)---////

// livEnExp = 3;
// energyStoreFactor = 20000;

for ( var i=0; i<25; i++ ) {
  createSeed(null);
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
function Seed( parentFlower ) {
  this.parentFlower = parentFlower;
  if ( parentFlower === null ) {
    this.sw = 14;  // seed width (universal size reference unit for seed)
    this.p1 = addPt( Tl.rib(33,66), Tl.rib(5,25) );  // seed point 1 (placed in air for scattering at initiation)
    this.p2 = addPt( pctFromXVal( this.p1.cx + this.sw*1.6 ), pctFromYVal( this.p1.cy ) );  // seed point 2
  } else {
    this.sw = this.parentFlower.spHcH.l/2;
    var p1 = spanMidPoint( this.parentFlower.spHbM );  // positions seed p1 at bottom of parent flower's hex
    this.p1 = addPt( pctFromXVal(p1.x), pctFromYVal(p1.y) );  // seed point 1
    var p2 = spanMidPoint( this.parentFlower.spHtM );  // positions seed p2 at top of parent flower's hex
    this.p2 = addPt( pctFromXVal(p2.x), pctFromYVal(p2.y) );  // seed point 2
  }
  this.p1.width = this.sw*1; 
  this.p1.mass = 5;
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
  this.ph = Tl.rib( 0, 260 ); if ( this.ph > 65 && this.ph < 165) { this.ph += 100; }  // petal hue
  this.ps = Tl.rib( 50, 100 );  // petal saturation
  this.pl = Tl.rib( 35, 70 );  // petal lightness
  this.age = 0;  // plant age in worldtime units
  this.isAlive = true;
  this.hasCollapsed = false;
  //settings
  this.forwardGrowthRate = gravity * Tl.rfb(18,22);  // (rate of cross spans increase per frame)
  this.outwardGrowthRate = this.forwardGrowthRate * Tl.rfb(0.18,0.22);  // (rate forward span widens per frame)
  this.maxSegmentWidth = Tl.rfb(10,12);  // maximum segment width (in pixels)
  this.maxTotalSegments = Tl.rib(8,15);  // maximum total number of segments at maturity
  this.firstLeafSegment = Tl.rib(2,3);  // (segment on which first leaf set grows)
  this.leafFrequency = Tl.rib(2,3);  // (number of segments until next leaf set)
  this.maxLeaflength = this.maxSegmentWidth * Tl.rfb(4,7);  // maximum leaf length at maturity
  this.leafGrowthRate = this.forwardGrowthRate * Tl.rfb(1.4,1.6);  // leaf growth rate
  this.flowerBudHeight = 1;  // bud height ( from hex top, in units of hex heights )
  this.flowerColor = { h: this.ph, s: this.ps, l: this.pl };  // flower color
  this.pollenPadColor = { r: 255, g: 217, b: 102, a: 1 };  // pollen pad color
  this.maxFlowerBaseWidth = 1;  // max flower base width, in units of plant max segment width
  //base segment (values assigned at source seed germination)
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

///flower constructor 
function Flower( plant, parentSegment, basePoint1, basePoint2 ) {
  this.plantId = plant.id;
  this.id = plant.flowerCount;
  this.parentSegment = parentSegment;
  this.seeds = [];
  this.mass = 0;
  this.bloomRatio = 0; 
  this.podOpenRatio = 0;
  this.podOpacity = 0;
  this.visible = true;
  this.hasFullyBloomed = false;
  this.isFertilized = false;
  this.hasFullyClosed = false;
  this.hasSeeds = false;
  this.seedPodIsMature = false;
  this.podHasOpened = false;
  this.hasReleasedSeeds = false;
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
  //petals
  this.ptPtL = addPt( pctFromXVal(this.ptBudTip.cx), pctFromYVal(this.ptBudTip.cy) );  // petal top left point  
  this.ptPtM = addPt( pctFromXVal(this.ptBudTip.cx), pctFromYVal(this.ptBudTip.cy) );  // petal top middle point  
  this.ptPtR = addPt( pctFromXVal(this.ptBudTip.cx), pctFromYVal(this.ptBudTip.cy) );  // petal top right point  
  this.ptPbL = addPt( pctFromXVal(this.ptBudTip.cx), pctFromYVal(this.ptBudTip.cy) );  // petal bottom left point  
  this.ptPbM = addPt( pctFromXVal(this.ptBudTip.cx), pctFromYVal(this.ptBudTip.cy) );  // petal bottom middle point  
  this.ptPbR = addPt( pctFromXVal(this.ptBudTip.cx), pctFromYVal(this.ptBudTip.cy) );  // petal bottom right point  
  this.ptPtL.mass = this.ptPtM.mass = this.ptPtR.mass = this.mass;
  this.ptPbL.mass = this.ptPbM.mass = this.ptPbR.mass = this.mass;
  //pod
  this.ptPodTipL = addPt( pctFromXVal(this.ptBudTip.cx), pctFromYVal(this.ptBudTip.cy) );  // pod tip left point 
  this.ptPodTipR = addPt( pctFromXVal(this.ptBudTip.cx), pctFromYVal(this.ptBudTip.cy) );  // pod tip right point
  this.ptPodTipL.mass = this.ptPodTipR.mass = this.mass;
  //colors
  this.clP = plant.flowerColor; // petal color (hsl)
  this.clH = plant.pollenPadColor;  // hex (pollen pad) color
  this.clOv = C.hdf;  // ovule color (dark green when healthy)
  this.clO = C.hol;  // outline color (very dark brown when healthy)
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
function createSeed( parentFlower ) {
  seedCount++;
  seeds.push( new Seed( parentFlower ) );
  if ( parentFlower !== null ) { parentFlower.seeds.push( seeds[seeds.length-1] ); }
  return seeds[seeds.length-1];
}

///creates a new plant
function createPlant( sourceSeed ) {
  plantCount++;
  //if the source seed is an initiating seed, add the new plant to the end of the plants array and return it
  if ( sourceSeed.parentFlower === null ) {
    plants.push( new Plant( sourceSeed ) );  // places new plant at end of plants array
    return plants[plants.length-1];  // returns new plant as last item of plants array
  //otherwise, add the new plant right before its parent plant in plants array (maintains render ordering)
  } else {
    for ( var i=0; i<plants.length; i++) { 
      if ( sourceSeed.parentFlower.plantId === plants[i].id ) {  // finds seed's parent plant by id
        plants.splice( i, 0, new Plant( sourceSeed ) );  // places new plant before parent plant in plants array
        return plants[i];  // returns new plant (the plant before its parent plant in plants array)
      }
    }
  }
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

///creates a new flower
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

///creates arc between two points
function arcFromTo( startPoint, endPoint, arcHeight ) {
  var ah = arcHeight;  // arc height as ratio of distance between points
  var p1 = { x: startPoint.cx, y: startPoint.cy };
  var p2 = { x: endPoint.cx, y: endPoint.cy };
  var mp = { x: ( p1.x + p2.x ) / 2, y: ( p1.y + p2.y ) / 2 } ;  // mid point
  var ccp = { x: mp.x + ( p2.y - p1.y ) * ah, y: mp.y + ( p1.x - p2.x ) * ah };  // curve control point
  return ctx.quadraticCurveTo( ccp.x, ccp.y, p2.x, p2.y );
}

///scatters seeds (for initiation)
function scatterSeed( seed ) {
  seed.p1.px += Tl.rfb(-5,5); seed.p1.py += Tl.rfb(-5,5);
  seed.p2.px += Tl.rfb(-5,5); seed.p2.py += Tl.rfb(-5,5);
}

///drops seeds (for releasing seed from pod)
function dropSeed( seed ) {
  seed.p2.px += Tl.rfb(-3,3);
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

///checks whether a segment is ready to generate a flower
function readyForFlower( plant, segment ) {
  return  segment.id === plant.maxTotalSegments && 
          !plant.hasFlowers && 
          segment.spF.l > plant.maxSegmentWidth*0.333; 
}

///expands flower bud
function expandFlowerBud( plant, flower) {
  var p = plant;
  var f = flower;
  var pfgr = p.forwardGrowthRate;  // plant forward growth rate
  var fbw = p.maxSegmentWidth * p.maxFlowerBaseWidth;  // flower base width (at maturity)
  var bhgr = f.spHbM.l < fbw*0.3 ? pfgr*1.5 : pfgr*0.5;  // bud height growth rate (slows when stability established)
  var fogr = p.outwardGrowthRate*1.5;  // flower outward growth rate
  var htmp = spanMidPoint( f.spHtM );  // hex top middle span mid point
  var hbmp = spanMidPoint( f.spHbM );  // hex bottom middle span mid point
  var hcp = spanMidPoint( f.spHcH );  // hex center point
  var budTipX = htmp.x + ( htmp.x - hbmp.x ) * p.flowerBudHeight;  // bud tip x value
  var budTipY = htmp.y + ( htmp.y - hbmp.y ) * p.flowerBudHeight;  // bud tip y value
  // (ovule)
  f.spOiL.l = distance( f.ptBL, f.ptHbL);  // ovule inner left span
  f.spOiR.l = f.spOiL.l;  // ovule inner rightspan
  f.spCd.l = distance( f.ptHbL, f.ptBR );  // downward cross span
  f.spCu.l = f.spCd.l;  // upward cross span
  f.spCdP.l = distance( f.ptHbL, f.parentSegment.ptB2 ) + pfgr;  // downward cross span to parent
  f.spCuP.l = f.spCdP.l;  // upward cross span to parent
  f.spOoL.l = distance( f.ptBL, f.ptHoL );  // ovule outer left span 
  f.spOoR.l = f.spOoL.l;  // ovule outer right span  
  // (hex/polinator pad)
  f.spHbM.l += fogr;  // hex bottom middle span
  f.spHbL.l = f.spHbM.l;  // hex lower left span
  f.spHbR.l = f.spHbM.l;  // hex lower right span
  f.spHtL.l = f.spHbM.l;  // hex top left span
  f.spHtR.l = f.spHbM.l;  // hex top right span
  f.spHtM.l = f.spHbM.l;  // hex top middle span
  f.spHcH.l = f.spHbM.l*2;  // hex cross horizontal span
  f.spHcDB.l = distance( f.ptHtL, f.ptBR ) + bhgr;  // hex cross downward span to flower base
  f.spHcUB.l = f.spHcDB.l;  // hex cross upward span to flower base
  // (bud tip point & scaffolding)
  f.ptBudTip.cx = budTipX;  // bud tip x value
  f.ptBudTip.cy = budTipY;  // bud tip y value
  f.spBTSL.l = distance( f.ptBudTip, f.ptHoL );  // petal bottom middle left span
  f.spBTSR.l = distance( f.ptBudTip, f.ptHoR );  // petal bottom middle right span
  // (petals)
  f.ptPtL.cx = budTipX; f.ptPtL.cy = budTipY;  // syncs top left petal tip with bud tip during bud growth
  f.ptPtL.px = f.ptPtL.cx; f.ptPtL.py = f.ptPtL.cy;
  f.ptPtM.cx = budTipX; f.ptPtM.cy = budTipY;  // syncs top middle petal tip with bud tip during bud growth
  f.ptPtM.px = f.ptPtM.cx; f.ptPtM.py = f.ptPtM.cy;
  f.ptPtR.cx = budTipX; f.ptPtR.cy = budTipY;  // syncs top right petal tip with bud tip during bud growth
  f.ptPtR.px = f.ptPtR.cx; f.ptPtR.py = f.ptPtR.cy;
  f.ptPbL.cx = budTipX; f.ptPbL.cy = budTipY;  // syncs bottom left petal tip with bud tip during bud growth
  f.ptPbL.px = f.ptPbL.cx; f.ptPbL.py = f.ptPbL.cy;
  f.ptPbM.cx = budTipX; f.ptPbM.cy = budTipY;  // syncs bottom middle petal tip with bud tip during bud growth
  f.ptPbM.px = f.ptPbM.cx; f.ptPbM.py = f.ptPbM.cy;
  f.ptPbR.cx = budTipX; f.ptPbR.cy = budTipY;  // syncs bottom right petal tip with bud tip during bud growth
  f.ptPbR.px = f.ptPbR.cx; f.ptPbR.py = f.ptPbR.cy;
  // (pod)
  f.ptPodTipL.cx = budTipX; f.ptPodTipL.cy = budTipY;  // syncs left pod tip with bud tip during bud growth
  f.ptPodTipL.px = f.ptPodTipL.cx; f.ptPodTipL.py = f.ptPodTipL.cy;
  f.ptPodTipR.cx = budTipX; f.ptPodTipR.cy = budTipY;  // syncs right pod tip with bud tip during bud growth
  f.ptPodTipR.px = f.ptPodTipR.cx; f.ptPodTipR.py = f.ptPodTipR.cy;
}

///adjusts petal arc throughout flower bloom
function petalArcAdjustment( flower, basePoint1, basePoint2, petalTipPoint, expansionStart, arcHeightEnd) {
  var f = flower;
  var a = basePoint1;  // point a (leftmost petal base point)
  var b = basePoint2;  // point b (rightmost petal base point)
  var c = petalTipPoint;  // point c (petal tip point)
  if ( (b.cy - a.cy)*(c.cx-b.cx) - (c.cy-b.cy)*(b.cx-a.cx) >= 0 ) {  // counterclockwise point orientation
    return f.bloomRatio < expansionStart ? arcHeightEnd * expansionStart : arcHeightEnd * f.bloomRatio;
  } else {  // clockwise point orientation
    return f.bloomRatio < expansionStart ? -arcHeightEnd * expansionStart : -arcHeightEnd * f.bloomRatio;
  }
}

///unfolds petals ( xShift and yShift are in units of hex height in relation to bud tip )
function positionPetal( plant, flower, petalTipPoint, xShift, yShift ) {
  var p = plant;
  var f = flower;
  var ptp = petalTipPoint;
  var hexHeight = distance( f.ptHtL, f.ptHbL );
  var htmp = spanMidPoint( f.spHtM );  // hex top middle span mid point
  var hbmp = spanMidPoint( f.spHbM );  // hex bottom middle span mid point
  var hcp = spanMidPoint( f.spHcH );  // hex center point
  var bh = p.flowerBudHeight;  // bud height
  var budTip = { x: ( htmp.x + ( htmp.x - hbmp.x ) * bh ), y: (htmp.y + ( htmp.y - hbmp.y ) * bh) };  // bud tip
  var fullBloomX = hbmp.x + (hexHeight*-xShift) * (hcp.y-hbmp.y)/(hexHeight*0.5) + (hbmp.x-hcp.x)*(yShift-2.5)*2;
  var fullBloomY = hbmp.y - (hexHeight*-xShift) * (hcp.x-hbmp.x)/(hexHeight*0.5) + (hbmp.y-hcp.y)*(yShift-2.5)*2;
  ptp.cx = ptp.px = budTip.x + (fullBloomX - budTip.x) * f.bloomRatio;
  ptp.cy = ptp.py = budTip.y + (fullBloomY - budTip.y) * f.bloomRatio;
}

///positions all petals
function positionAllPetals( plant, flower ) {
  positionPetal( plant, flower, flower.ptPtL, -1.75, 1 );  // top left petal
  positionPetal( plant, flower, flower.ptPtM, 0, 0.25 );  // top middle petal
  positionPetal( plant, flower, flower.ptPtR, 1.75, 1 );  // top right petal
  positionPetal( plant, flower, flower.ptPbL, -1.75, 3 );  // bottom left petal
  positionPetal( plant, flower, flower.ptPbM, 0, 3.75 );  // bottom middle petal
  positionPetal( plant, flower, flower.ptPbR, 1.75, 3 );  // bottom right petal
}

///places seeds in pod
function placeSeedsInPod( flower ) {
  if ( !flower.hasSeeds ) {
    for ( var i=0; i<seedsPerFlower; i++ ) { createSeed( flower ); }
    flower.hasSeeds = true;
  }
}

function keepSeedsInPod( flower) {
  if ( flower.hasSeeds ) {
    for ( var j=0; j<flower.seeds.length; j++ ) {
      var seed = flower.seeds[j];
      seed.p1.cx = seed.p1.px = spanMidPoint(flower.spHbM).x;
      seed.p1.cy = seed.p1.py = spanMidPoint(flower.spHbM).y;
      seed.p2.cx = seed.p2.px = spanMidPoint(flower.spHtM).x;
      seed.p2.cy = seed.p2.py = spanMidPoint(flower.spHtM).y;
    }
  }
}

///checks if pod is ready to release seeds
function podReadyToOpen( plant ) {
  return plant.energy < plant.maxEnergyLevel*podOpenEnergyLevelRatio;
}

///unfolds pod halves ( xShift and yShift are in units of hex height in relation to bud tip )
function positionPodHalf( plant, flower, podTipPoint, xShift, yShift ) {
  var p = plant;
  var f = flower;
  var ptp = podTipPoint;
  var hexHeight = distance( f.ptHtL, f.ptHbL );
  var htmp = spanMidPoint( f.spHtM );  // hex top middle span mid point
  var hbmp = spanMidPoint( f.spHbM );  // hex bottom middle span mid point
  var hcp = spanMidPoint( f.spHcH );  // hex center point
  var bh = p.flowerBudHeight;  // bud height
  var budTip = { x: ( htmp.x + ( htmp.x - hbmp.x ) * bh ), y: (htmp.y + ( htmp.y - hbmp.y ) * bh) };  // bud tip
  var fullyOpenX = hbmp.x + (hexHeight*-xShift) * (hcp.y-hbmp.y)/(hexHeight*0.5) + (hbmp.x-hcp.x)*(yShift-2.5)*2;
  var fullyOpenY = hbmp.y - (hexHeight*-xShift) * (hcp.x-hbmp.x)/(hexHeight*0.5) + (hbmp.y-hcp.y)*(yShift-2.5)*2;
  ptp.cx = ptp.px = budTip.x + (fullyOpenX - budTip.x) * f.podOpenRatio;
  ptp.cy = ptp.py = budTip.y + (fullyOpenY - budTip.y) * f.podOpenRatio;
}

///positions pod halves
function positionBothPodHalves( plant, flower ) {
  positionPodHalf( plant, flower, flower.ptPodTipL, -0.5, 0.5 );  // left pod half
  positionPodHalf( plant, flower, flower.ptPodTipR, 0.5, 0.5 );  // right pod half
}

///lengthens flower spans for bud growth & blooming
function developFlower( plant, flower ) {
  var p = plant;
  var f = flower;
  //if bud is not fully grown and has enough energy for growth, it continues to grow until mature
  if ( !f.budHasFullyMatured && plant.energy > 0 ) {
    expandFlowerBud( p, f);
    f.budHasFullyMatured = flower.spHbM.l < plant.maxSegmentWidth*plant.maxFlowerBaseWidth ? false : true;
  //otherwise, if bud has not fully bloomed, it continues to bloom
  } else if ( f.budHasFullyMatured && !f.hasFullyBloomed && plant.energy > 0) {
    if ( f.bloomRatio < 1 ) { f.bloomRatio += 0.01; } else { f.hasFullyBloomed = true; }
    if ( f.hasFullyBloomed ) { f.isFertilized = true; } //[[[[[[[[[[[[[[[[ update when fertilization added ]]]]}]]]] 
  //otherwise, if flower is fertilized, has not fully closed, and has reached a "sick" energy level, it closes
  } else if ( f.isFertilized && !f.hasFullyClosed && p.energy < p.maxEnergyLevel*sickEnergyLevelRatio ) { 
    if ( f.bloomRatio > 0 ) { f.bloomRatio -= 0.01; } else { f.hasFullyClosed = true; } // closes petals
  //otherise, if flower has fully closed, it develops into a seed pod 
  } else if ( f.hasFullyClosed && !f.seedPodIsMature ) {
    placeSeedsInPod( f );
    keepSeedsInPod( f );
    f.podOpacity = f.podOpacity < 1 ? f.podOpacity + 0.005 : 1;
    if ( f.podOpacity === 1 ) { f.visible = false; f.seedPodIsMature = true; }
  //otherwise, if seed pod is mature but not ready to release seeds, the seeds stay in the pod
  } else if ( f.seedPodIsMature && !podReadyToOpen(p) ) {
    keepSeedsInPod( f );
  //otherwise, if the seed pod hasn't released seeds and pod is ready to open, it opens
  } else if ( !f.podHasOpened && podReadyToOpen(p) ) {
    if ( f.podOpenRatio < 1 ) { f.podOpenRatio += 0.001; } else { f.podHasOpened = true; } // opens pod 
    keepSeedsInPod( f );
  //otherwise, if the plant is still alive, hold seeds in the opened pod
  } else if ( p.isAlive ) {
    keepSeedsInPod( f );
  //otherwise, if the pod has opened, the seeds haven't been released, and the plant is dead, releases seeds
  } else if ( !f.hasReleasedSeeds ) {
    for ( var i=0; i<f.seeds.length; i++ ) { dropSeed( flower.seeds[i] ); }
    f.hasReleasedSeeds = true;
  }
}

///grows all plants
function growPlants() {
  for (var i=0; i<plants.length; i++) {
    var plant = plants[i];
    plant.age++;
    germinateSeedWhenReady( plant.sourceSeed );  // germinates a planted seed
    if ( plant.energy > plant.segmentCount*energyStoreFactor && plant.energy>plant.seedEnergy ) {
      plant.energy = plant.segmentCount*energyStoreFactor;  // caps plant max energy level based on segment count
    }
    if ( plant.hasFlowers ) {  // checks plant for flowers
      for ( var j=0; j<plant.flowers.length; j++ ) {
        var flower = plant.flowers[j];
        developFlower( plant, flower );  // grows flower
      }
    }
    if ( plant.energy > 0 || !restrictGrowthByEnergy ) {  // checks if plant has energy for growth (>0)
      for (var k=0; k<plant.segments.length; k++) {  // checks each plant segment
        var segment = plant.segments[k];
        if ( segment.spF.l < plant.maxSegmentWidth ) { 
          lengthenSegmentSpans( plant, segment );  // lengthens segment spans until segment fully grown
          plant.energy -= segment.spCd.l * groEnExp;  // reduces energy by segment size
        }
        if ( readyForChildSegment( plant, segment ) ) { 
          createSegment( plant, segment, segment.ptE1, segment.ptE2 );  // generates new segment
        }
        if ( !segment.hasLeaves ) { 
          generateLeavesWhenReady( plant, segment );  // generates new leaf set
        } else {
          growLeaves( plant, segment );  // grows leaves until leaves are fully grown
          plant.energy -= ( segment.spLf1.l + segment.spLf2.l ) * groEnExp;  // reduces energy by leaf length
        }
        if ( !plant.hasFlowers && readyForFlower( plant, segment ) ) {
          createFlower( plant, segment, segment.ptE1, segment.ptE2 );  // generates a new flower
        }
      }
    } 
    if ( plant.sourceSeed.hasGerminated ) {
      plant.energy -= plant.segmentCount * livEnExp;  // cost of living: reduces energy by a ratio of segment count
    } 
    if ( plant.age > oldAge ) {
      plant.energy -= plant.age/agingFactor; // plant starts dying of old age (*remove when seasons added...)
    } 
    if ( plant.energy < plant.maxEnergyLevel*deathEnergyLevelRatio && restrictGrowthByEnergy ) {
      killPlant( plant );  // plant dies if energy level falls below minimum to be alive
    }
    if ( plant.energy < plant.maxEnergyLevel*collapseEnergyLevelRatio && restrictGrowthByEnergy ) {
      collapsePlant( plant );  // plant collapses if energy level falls below minimum to stay standing
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

///shifts an rgba color between start and end colors scaled proportionally to start and end plant energy levels
function rgbaColorShift( plant, startColor, endColor, startEnergy, endEnergy ) {
  var p = plant;
  var curEn = p.energy;  // current energy level
  var r = endColor.r - ( (curEn-endEnergy) * (endColor.r-startColor.r) / (startEnergy-endEnergy) );  // redshift
  var g = endColor.g - ( (curEn-endEnergy) * (endColor.g-startColor.g) / (startEnergy-endEnergy) );  // greenshift
  var b = endColor.b - ( (curEn-endEnergy) * (endColor.b-startColor.b) / (startEnergy-endEnergy) );  // blueshift
  return { r: r, g: g, b: b, a: 1 };
}

///shifts an hsl color between start and end colors scaled proportionally to start and end plant energy levels
function hslColorShift( plant, startColor, endColor, startEnergy, endEnergy ) {
  var p = plant;
  var curEn = p.energy;  // current energy level
  var h = endColor.h - ( (curEn-endEnergy) * (endColor.h-startColor.h) / (startEnergy-endEnergy) );  // redshift
  var s = endColor.s - ( (curEn-endEnergy) * (endColor.s-startColor.s) / (startEnergy-endEnergy) );  // greenshift
  var l = endColor.l - ( (curEn-endEnergy) * (endColor.l-startColor.l) / (startEnergy-endEnergy) );  // blueshift
  return { h: h, s: s, l: l };
}

///changes plant colors based on plant health
function applyHealthColoration( plant, segment ) {
  var p = plant;
  var s = segment;
  var cel = p.energy;  // current energy level
  var uel = p.maxEnergyLevel * unhealthyEnergyLevelRatio;  // unhealthy energy level ( starts yellowing)
  var sel = p.maxEnergyLevel * sickEnergyLevelRatio;  // sick energy level (starts darkening)
  var del = p.maxEnergyLevel * deathEnergyLevelRatio;  // death energy level (fully darkened; dead)
  if ( cel <= uel && cel > sel )  {  // unhealthy energy levels (yellowing)
    s.clS = rgbaColorShift( p, C.hdf, C.yf, uel, sel );  // stalks (dark fills)
    s.clL = rgbaColorShift( p, C.hlf, C.yf, uel, sel );  // leaves (light fills)
    s.clO = rgbaColorShift( p, C.hol, C.yol, uel, sel );  // outlines
    s.clI = rgbaColorShift( p, C.hil, C.yil, uel, sel );  // inner lines
  } else if ( cel <= sel && cel > del ) {  // sick energy levels (darkening)
    s.clS = rgbaColorShift( p, C.yf, C.df, sel, del );  // stalks 
    s.clL = rgbaColorShift( p, C.yf, C.df, sel, del );  // leaves
    s.clO = rgbaColorShift( p, C.yol, C.dol, sel, del );  // outlines
    s.clI = rgbaColorShift( p, C.yil, C.dil, sel, del );  // inner lines
  }
  if ( p.hasFlowers && s.id === 1 ) {
    for ( var i=0; i<p.flowers.length; i++ ) {
      var f = p.flowers[i];
      f.clOv = s.clS;  // flower ovule color (matches stalk color)
      f.clO = s.clO;  // outline color (matches plant dark outline color)
      var fc = plant.flowerColor;
      //(petals)
      var ffel = p.maxEnergyLevel * flowerFadeEnergyLevelRatio;  // flower fade energy level
      if ( cel <= ffel && cel > sel ) {  // unhealthy energy levels (flower starts fading)
        f.clP = hslColorShift( p, fc, {h:fc.h,s:50,l:98}, ffel, sel );  // petal color
      } else if ( cel <= sel && cel > del ) {  // sick energy levels (darkening)
        f.clP = hslColorShift( p, {h:48,s:50,l:98}, {h:44,s:100,l:15 }, sel, del );  // petal color
      }      
      //(polinator pad)
      var ppfel = p.maxEnergyLevel * polinatorPadFadeEnergyLevelRatio;  // polinator pad fade energy level
      if ( cel <= ppfel && cel > sel ) {  // a little above sick energy levels (fading)
        f.clH = rgbaColorShift( p, p.pollenPadColor, {r:77,g:57,b:0,a:1}, ppfel, sel );  // polinator pad color
      } else if ( cel <= sel && cel > del ) {  // sick energy levels (darkening)
        f.clH = rgbaColorShift( p, {r:77,g:57,b:0,a:1}, {r:51,g:37,b:0,a:1}, sel, del );  // polinator pad color
      }
    }
  }
}

///kills plant if its energy level falls below minimum to be alive
function killPlant( plant ) {
  var p = plant;
  p.isAlive = false;  
  for (var i=0; i<plant.segments.length; i++) {
    var s = plant.segments[i];
    if ( s.hasLeaves && s.spLf1.l > plant.maxLeaflength/3 ) {  
      removeSpan( s.leafTipsTetherSpan.id );  // removes large leaf bud tethers 
    }
    if ( s.hasLeafScaffolding ) {  
      removeSpan(s.spLf1ScA.id); removeSpan(s.spLf2ScA.id);  // removes leaf scaffolding 
    }
    if ( s.hasLeaves && s.ptLf1.cy>s.ptB1.cy && s.ptLf2.cy>s.ptB2.cy ) {  // prevents dead leaves from swinging
      s.ptLf1.mass = s.ptLf2.mass = 0.5;
      if ( s.ptLf1.cy < s.ptLf1.py ) { s.ptLf1.cy = s.ptLf1.py; s.ptLf1.cx = s.ptLf1.px; }
      if ( s.ptLf2.cy < s.ptLf2.py ) { s.ptLf2.cy = s.ptLf2.py; s.ptLf2.cx = s.ptLf2.px; }
    }
  }
}

///collapses plant (*currently very clunky; revisit & improve during stylization)  {{{{{{{{{{{{{{ xxx }}}}}}}}}}}}}}
function collapsePlant( plant ) {
  var p = plant;
  p.hasCollapsed = true;  
  for (var i=0; i<plant.segments.length; i++) {
    var s = plant.segments[i];
    removeSpan(s.spCd.id);  // downward (l to r) cross span
    removeSpan(s.spCu.id);  // upward (l to r) cross span
    if (!s.isBaseSegment) {
      removeSpan(s.spCdP.id);  // downward (l to r) cross span to parent
      removeSpan(s.spCuP.id);  // upward (l to r) cross span to parent
    }
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
  ctx.fillStyle = "rgba( 73, 5, 51, "+seed.opacity+" )";
  ctx.beginPath();
  ctx.moveTo( r1x, r1y );
  ctx.bezierCurveTo( h1x, h1y, h2x, h2y, r2x, r2y );
  ctx.bezierCurveTo( h3x, h3y, h4x, h4y, r1x, r1y );
  ctx.stroke();
  ctx.fill();
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

///renders flowers
function renderFlowers( plant ) {
  var p = plant;
  if ( p.hasFlowers ) {
    for ( var i=0; i<p.flowers.length; i++) {
      var f = p.flowers[i];
      positionBothPodHalves(p,f);  // ensures pod half positions are updated every iteration
      if ( f.visible ) {
        var pah;  // petal arc height
        positionAllPetals(p,f);  // ensures flower petal positions are updated every iteration
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineWidth = 1;
        //top petals
        ctx.fillStyle = "hsl("+f.clP.h+","+f.clP.s+"%,"+f.clP.l+"%)";  // violet
        ctx.strokeStyle = "rgba("+f.clO.r+","+f.clO.g+","+f.clO.b+","+f.clO.a+")";  // dark brown
        ctx.beginPath();  // top middle petal
        ctx.moveTo( f.ptHtL.cx, f.ptHtL.cy ); 
        pah = petalArcAdjustment( f, f.ptHtL, f.ptHtR, f.ptPtM, 0.2, 0.45);
        arcFromTo( f.ptHtL, f.ptPtM, pah ); arcFromTo( f.ptPtM, f.ptHtR, pah );
        ctx.fill(); ctx.stroke();
        ctx.beginPath();  // top left petal
        ctx.moveTo( f.ptHoL.cx, f.ptHoL.cy );
        pah = petalArcAdjustment( f, f.ptHoL, f.ptHtL, f.ptPtL, 0.2, 0.35);
        arcFromTo( f.ptHoL, f.ptPtL, pah ); arcFromTo( f.ptPtL, f.ptHtL, pah );
        ctx.fill(); ctx.stroke();
        ctx.beginPath();  // top right petal
        ctx.moveTo(f.ptHtR.cx, f.ptHtR.cy); 
        pah = petalArcAdjustment( f, f.ptHtR, f.ptHoR, f.ptPtR, 0.2, 0.35);
        arcFromTo( f.ptHtR, f.ptPtR, pah ); arcFromTo( f.ptPtR, f.ptHoR, pah );
        ctx.fill(); ctx.stroke();
        //ovule
        ctx.beginPath();
        ctx.fillStyle = "rgba("+f.clOv.r+","+f.clOv.g+","+f.clOv.b+","+f.clOv.a+")";  // dark green
        ctx.strokeStyle = "rgba("+f.clO.r+","+f.clO.g+","+f.clO.b+","+f.clO.a+")";  // dark brown
        ctx.moveTo(f.ptBL.cx, f.ptBL.cy);
        arcFromTo( f.ptBL, f.ptHoL, 0.1 );
        ctx.lineTo(f.ptHoR.cx, f.ptHoR.cy);
        arcFromTo( f.ptHoR, f.ptBR, 0.1 );
        ctx.fill();
        ctx.stroke();     
        //hex (polinator pad)
        ctx.beginPath();
        ctx.fillStyle = "rgba("+f.clH.r+","+f.clH.g+","+f.clH.b+","+f.clH.a+")";  // yellow
        ctx.moveTo(f.ptHtR.cx, f.ptHtR.cy);
        ctx.lineTo(f.ptHoR.cx, f.ptHoR.cy);
        ctx.lineTo(f.ptHbR.cx, f.ptHbR.cy);
        ctx.lineTo(f.ptHbL.cx, f.ptHbL.cy);
        ctx.lineTo(f.ptHoL.cx, f.ptHoL.cy);
        ctx.lineTo(f.ptHtL.cx, f.ptHtL.cy);
        ctx.fill();
        ctx.beginPath();
        ctx.strokeStyle = "rgba("+f.clO.r+","+f.clO.g+","+f.clO.b+","+f.clO.a+")";  // dark brown
        ctx.moveTo(f.ptHoL.cx, f.ptHoL.cy);
        ctx.lineTo(f.ptHtL.cx, f.ptHtL.cy);
        ctx.lineTo(f.ptHtR.cx, f.ptHtR.cy);
        ctx.lineTo(f.ptHoR.cx, f.ptHoR.cy);
        ctx.lineTo(f.ptHbR.cx, f.ptHbR.cy);
        ctx.lineTo(f.ptHbR.cx, f.ptHbR.cy);
        ctx.lineTo(f.ptHbL.cx, f.ptHbL.cy);
        ctx.lineTo(f.ptHoL.cx, f.ptHoL.cy);
        ctx.stroke();
        //bottom petals
        ctx.fillStyle = "hsl("+f.clP.h+","+f.clP.s+"%,"+f.clP.l+"%)";  // white
        ctx.strokeStyle = "rgba("+f.clO.r+","+f.clO.g+","+f.clO.b+","+f.clO.a+")";  // dark brown
        ctx.beginPath();  // bottom left petal
        ctx.moveTo( f.ptHoL.cx, f.ptHoL.cy );
        pah = petalArcAdjustment( f, f.ptHoL, f.ptHbL, f.ptPbL, 0.35, 0.35);
        arcFromTo( f.ptHoL, f.ptPbL, pah ); arcFromTo( f.ptPbL, f.ptHbL, pah );
        ctx.fill(); ctx.stroke();
        ctx.beginPath();  // bottom right petal
        ctx.moveTo(f.ptHbR.cx, f.ptHbR.cy);
        pah = petalArcAdjustment( f, f.ptHbR, f.ptHoR, f.ptPbR, 0.35, 0.35);
        arcFromTo( f.ptHbR, f.ptPbR, pah ); arcFromTo( f.ptPbR, f.ptHoR, pah );
        ctx.fill(); ctx.stroke();
        ctx.beginPath();  // bottom middle petal
        ctx.moveTo( f.ptHbL.cx, f.ptHbL.cy );
        pah = petalArcAdjustment( f, f.ptHbL, f.ptHbR, f.ptPbM, 0.2, 0.45);
        arcFromTo( f.ptHbL, f.ptPbM, pah ); arcFromTo( f.ptPbM, f.ptHbR, pah );
        ctx.fill(); ctx.stroke();
      }
      //pods
      if ( viewPods ) { renderPods( f ); }
    }
  }
}

///renders pods
function renderPods( flower ) {
  var f = flower;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.lineWidth = 2.5;
  ctx.fillStyle = "rgba("+f.clOv.r+","+f.clOv.g+","+f.clOv.b+","+f.podOpacity+")";  // dark green
  ctx.strokeStyle = "rgba("+f.clO.r+","+f.clO.g+","+f.clO.b+","+f.podOpacity+")";  // dark brown
  ctx.beginPath();
  ctx.moveTo(f.ptBL.cx, f.ptBL.cy);
  arcFromTo( f.ptBL, f.ptHoL, 0.1 );
  arcFromTo( f.ptHoL, f.ptPodTipL, 0.07 );
  if ( flower.podOpenRatio > 0 ) {
    var hp = spanMidPoint( f.spHbM );  // hinge point
    ctx.lineTo( hp.x, hp.y );
    ctx.lineTo( f.ptPodTipR.cx, f.ptPodTipR .cy );
  }
  arcFromTo( f.ptPodTipR, f.ptHoR, 0.1 );
  arcFromTo( f.ptHoR, f.ptBR, 0.07 );
  ctx.stroke();
  ctx.fill();
}

///renders plants (sequentially)
function renderPlants() {
  for (var i=0; i<plants.length; i++) {
    var plant = plants[i];
    for (var j=0; j<plants[i].segments.length; j++) {
      var segment = plant.segments[j];
      if ( restrictGrowthByEnergy ) { applyHealthColoration( plant, segment ); }
      if ( viewStalks ) { renderStalks( plant, segment ); }
      if ( viewFlowers && segment.id === plants[i].segments.length ) { renderFlowers( plant ); }
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
}

createSunRays();
display();








