


/////////////////// FLOWER HANDLER /////////////////////




/////---TRACKERS---/////


var pollinationAnimations = []; pollinationAnimationCount = 0;

var readyForNextMilestoneAnnouncement = true;
var milestoneFirstRedHasBeenRun = false;
var milestoneThirdHasBeenRun = false;
var milestoneHalfHasBeenRun = false;
var milestoneTwoThirdsHasBeenRun = false;
var milestone90HasBeenRun = false;




/////---OBJECTS---/////


///flower constructor 
function Flower( plant, parentSegment, basePoint1, basePoint2 ) {
  this.id = plant.flowerCount;
  this.plantId = plant.id;
  this.generation = Tl.obById( plants, this.plantId ).generation;
  this.parentSegmentId = parentSegment.id;
  this.zygoteGenotypes = [];
  this.seeds = [];
  this.mass = 0;
  this.bloomRatio = 0; 
  this.podOpenRatio = 0;
  this.podOpacity = 0;
  this.visible = true;
  this.hasFullyBloomed = false;
  this.ageSinceBlooming = 0;  // flower age since blooming in worldtime units
  this.pollenDispersalAnimationTimeTracker = 0;  // pollen dispersal animation time tracker
  this.isPollinated = false;
  this.hasReachedMaxSeeds = false;
  this.hasFullyClosed = false;
  this.hasSeeds = false;
  this.seedPodIsMature = false;
  this.podHasOpened = false;
  this.hasReleasedSeeds = false;
  //ovule points
  this.ptBL = basePoint1;  // base point left
  this.ptBR = basePoint2;  // base point right
  //hex (polinator pad) points
  var pfsmp = spanMidPoint( Tl.obById( plant.segments, this.parentSegmentId ).spF );  // parent forward span mid point
  var pbsmp = midPoint( Tl.obById( plant.segments, this.parentSegmentId ).ptB1, Tl.obById( plant.segments, this.parentSegmentId ).ptB2 );  // parent base span mid point
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
  this.spCdP = addSp( this.ptHbL.id, Tl.obById( plant.segments, this.parentSegmentId ).ptB2.id );  // downward (l to r) cross span to parent
  this.spCuP = addSp( Tl.obById( plant.segments, this.parentSegmentId ).ptB1.id, this.ptHbR.id );  // upward (l to r) cross span to parent
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
  this.clP = plant.flowerColor; // petal color (hue & lightness)
  this.clH = plant.pollenPadColor;  // hex (pollen pad) color
  this.clOv = C.hdf;  // ovule color (dark green when healthy)
  this.clO = C.hol;  // outline color (very dark brown when healthy)
  this.isRed = checkForRedPetals( this.clP );  // true if petals are a red hue
}

///pollination animation object constructor
function PollinationAnimation( pollinatorFlower, pollinatedFlower ) {
  this.saveTagClass = "pollinationAnimation";
  this.id = pollinationAnimationCount;
  this.f1 = pollinatorFlower;  // flower 1 (pollinator)
  this.f2 = pollinatedFlower;  // flower 2 (pollinated)
  this.bls = [];  // burst lines collection
  this.pls = [];  // pollination lines collection
  this.op = 0.9;  // pollination animation opacity (base number)
  this.burstOrigin = spanMidPoint( this.f1.spHcH );
  this.burstDuration = 120;  // pollen burst animation duration in iterations
  this.iterationCount = 0;  // number of iterations since beginning of animation
  this.glowIterationCount = 0;  // number of iterations since pollination glow began
  this.pollenBurstComplete = false; 
  this.pollinatorLinesHaveArrived = false;
  this.pollenPadGlowHasBegun = false;
  this.pollenPadGlowComplete = false;
  //burst lines (pollen lines that burst randomly from flower 1)
  for ( var i=0; i<3; i++) {  // creates a burst line each iteration
    var totalDistance = Tl.rfb( canvas.width*0.1, canvas.width*0.2 );  // total distance burst line will travel
    var xVal = Tl.rfb( 0, totalDistance );  // base x value (random)
    var xDist = Tl.rib(1,2) == 1 ? xVal : -xVal;  // x distance burst line will travel 
    var yVal = Math.sqrt( totalDistance*totalDistance - xDist*xDist );  // base y value (based on x total distance)
    var yDist = Tl.rib(1,2) == 1 ? yVal : -yVal;  // y distance burst line will travel
    var blxa = [];  // burst line x positions array 
    var blya = [];  // burst line y positions array 
    for ( var j=0; j<8; j++ ) {  // populates burst line x & y positions arrays
      blxa.push( this.burstOrigin.x ); 
      blya.push( this.burstOrigin.y ); 
    }
    this.bls.push({  // burst line instances
      dist: totalDistance,  // total distance burst point will travel
      dx: this.burstOrigin.x + xDist,  // destination x position of burst line
      dy: this.burstOrigin.y + yDist,  // destination y position of burst line
      xa: blxa,  // x positions array 
      ya: blya,  // y positions array 
    });
  }
  //pollination lines (pollen lines that travel from flower 1 to flower 2)
  for ( var k=0; k<1; k++) {  // creates a pollination line each iteration
    var plxa = [];  // pollination line x positions array 
    var plya = [];  // pollination line y positions array
    for ( var l=0; l<3; l++ ) {  // populates pollination line x & y positions arrays
      plxa.push( this.burstOrigin.x ); 
      plya.push( this.burstOrigin.y ); 
    }
    this.pls.push({  // pollination line instances
      xa: plxa,  // x positions array 
      ya: plya,  // y positions array 
    });
  }
}

var heightMarker = {
  w: canvas.width*0.025,  // marker width 
  h: canvas.width*0.025,  // marker height
  y: canvas.height,  // marker position y value (at point)
  chrfx: null,  // current highest red flower x value
  baa: false,  // bounce animation active
  bat: 0,  // bounce animation time
  laa: false,  // line animation active
  lat: 0,  // line animation time
};



/////---FUNCTIONS---/////


///creates a new flower
function createFlower( plant, parentSegment, basePoint1, basePoint2 ) {
  plant.flowerCount++;
  plant.flowers.push( new Flower( plant, parentSegment, basePoint1, basePoint2 ) );
  plant.hasFlowers = true;
  parentSegment.hasChild = true;
}

///creates a new pollination animation
function createPollinationAnimation( pollinatorFlower, pollinatedFlower ) {
  pollinationAnimationCount++;
  pollinationAnimations.push( new PollinationAnimation( pollinatorFlower, pollinatedFlower ) );
}

///checks whether a segment is ready to generate a flower
function readyForFlower( plant, segment ) {
  var segmentIsLastSegment = segment.id === plant.maxTotalSegments;
  var plantDoesNotHaveFlowers = !plant.hasFlowers;
  var segmentIsReadyForFlowerBud = segment.spF.l > plant.maxSegmentWidth*0.333;
  return segmentIsLastSegment && plantDoesNotHaveFlowers && segmentIsReadyForFlowerBud;
}

///checks whether a flower's petals are red
function checkForRedPetals( color ) {  // color as hue & lightness object: { h: <value>, l: <value> }
  var hq = color.h <= 15 || color.h >= 345;  // hue qualifies
  var lq = color.l >= 30 && color.l <= 50;  // lightness qualifies
  return hq && lq;
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
  f.spOiR.l = f.spOiL.l;  // ovule inner right span
  f.spCd.l = distance( f.ptHbL, f.ptBR );  // downward cross span
  f.spCu.l = f.spCd.l;  // upward cross span
  f.spCdP.l = distance( f.ptHbL, Tl.obById( plant.segments, f.parentSegmentId ).ptB2 ) + pfgr;  // downward cross span to parent
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
  var hcp = midPoint( f.ptHoL, f.ptHoR );  // hex center point
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

///readies flower to accept pollination
function acceptPollination( pollinatedFlower ) { 
  var availablePollinatorFlowers = [];
  if ( Tl.rib( 1, Math.round(suL/pollinationFrequency) ) === 1 ) {
    for ( var i=0; i<plants.length; i++ ) {
      for ( var j=0; j<plants[i].flowers.length; j++ ) {
        var ppf = plants[i].flowers[j];  // potential pollinator flower
        var ppfIsElegible = allowSelfPollination || ppf != pollinatedFlower;
        var ppfIsReady = ppf.bloomRatio === 1 && plants[i].energy > plants[i].maxEnergyLevel*minPollEnLevRatio;
        if ( ppfIsElegible && ppfIsReady ) { availablePollinatorFlowers.push( ppf ); }
      }
    }
  }
  if ( availablePollinatorFlowers.length > 0 ) {
    var pollinatorFlower = Tl.refa( availablePollinatorFlowers );
    pollinateFlower( pollinatedFlower, pollinatorFlower );
  }
  var maxSeeds = Math.floor( Tl.obById( plants, pollinatedFlower.plantId).maxTotalSegments * maxSeedsPerFlowerRatio ); 
  maxSeeds = maxSeeds < 3 ? 3 : maxSeeds > 7 ? 7 : maxSeeds;
  if ( pollinatedFlower.zygoteGenotypes.length === maxSeeds ) { pollinatedFlower.hasReachedMaxSeeds = true; }
}

///pollinates flower
function pollinateFlower( pollinatedFlower, pollinatorFlower ) {
  if ( runPollinationAnimations ) { createPollinationAnimation( pollinatorFlower, pollinatedFlower ); }
  var species = EV.species.skyPlant;
  var parentGenotype1 = Tl.obById( plants, pollinatedFlower.plantId).genotype;
  var parentGenotype2 = Tl.obById( plants, pollinatorFlower.plantId).genotype;
  var zygoteGenotype = EV.meiosis( species, parentGenotype1, parentGenotype2 );
  pollinatedFlower.zygoteGenotypes.push( zygoteGenotype );
  pollinatedFlower.isPollinated = true;
}

///places seeds in pod
function placeSeedsInPod( flower ) {
  if ( !flower.hasSeeds ) {
    for ( var i=0; i<flower.zygoteGenotypes.length; i++ ) {
      createSeed( flower, flower.zygoteGenotypes[i] ); 
    }
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
  var hcp = midPoint( f.ptHoL, f.ptHoR );
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
  if ( f.hasFullyBloomed ) { f.ageSinceBlooming++; } 
  //if bud is not fully grown and has enough energy for growth, it continues to grow until mature
  if ( !f.budHasFullyMatured && p.energy > 0 ) {
    expandFlowerBud( p, f );
    f.budHasFullyMatured = f.spHbM.l >= p.maxSegmentWidth*p.maxFlowerBaseWidth;
  //otherwise, if bud has not fully bloomed, it continues to bloom
  } else if ( f.budHasFullyMatured && !f.hasFullyBloomed && p.energy > p.maxEnergyLevel*minBloomEnLevRatio ) {
    if ( f.bloomRatio < 1 ) { 
      f.bloomRatio += 0.01; 
    } else { 
      f.bloomRatio = 1;
      f.hasFullyBloomed = true; }
  //otherwise, if fully bloomed, flower accepts pollination until zygote count reaches max seed count
  } else if ( f.hasFullyBloomed && p.energy > p.maxEnergyLevel*minPollEnLevRatio && !f.hasReachedMaxSeeds ) {    
    acceptPollination( f );
  //otherwise, if flower is pollinated and has not fully closed, it closes
  } else if ( f.isPollinated && !f.hasFullyClosed ) { 
    if ( f.bloomRatio > 0 ) { f.bloomRatio -= 0.03; } else { f.hasFullyClosed = true; } // closes petals
  //otherise, if flower has fully closed, it develops into a seed pod
  } else if ( f.hasFullyClosed && !f.seedPodIsMature ) {
    placeSeedsInPod( f );
    keepSeedsInPod( f );
    f.podOpacity = f.podOpacity < 1 ? f.podOpacity + 0.1 : 1;
    if ( f.podOpacity === 1 ) { f.visible = false; f.seedPodIsMature = true; }
  //otherwise, if seed pod is mature but not ready to release seeds, the seeds stay in the pod
  } else if ( f.seedPodIsMature && !podReadyToOpen( p ) ) {
    keepSeedsInPod( f );
  //otherwise, if the seed pod hasn't released seeds and pod is ready to open, it opens
  } else if ( !f.podHasOpened && podReadyToOpen( p ) ) {
    if ( f.podOpenRatio < 1 ) { f.podOpenRatio += 0.1; } else { f.podHasOpened = true; } // opens pod 
    keepSeedsInPod( f );
  //otherwise, if the plant is still alive, hold seeds in the opened pod
  } else if ( p.isAlive ) {
    keepSeedsInPod( f );
  //otherwise, if the pod has opened, the seeds haven't been released, and the plant is dead, release seeds
  } else if ( !f.hasReleasedSeeds ) {
    for ( var i=0; i<f.seeds.length; i++ ) { dropSeed( flower.seeds[i] ); }
    f.hasReleasedSeeds = true;
  }
}

///track highest flower heights
function trackMaxRedFlowerHeights( flower ) {
  var f = flower;
  if ( f.isRed && f.bloomRatio === 1 ) {
    var heightPct = (canvas.height-f.ptPtM.cy)*100/canvas.height ;
    if ( heightPct > highestRedFlowerPct ) { 
      highestRedFlowerPct = heightPct; 
      if ( highestRedFlowerPct > 100 ) { highestRedFlowerPct = 100; }  // caps highest red flower percentage at 100%
      heightMarker.chrfx = f.ptPtM.cx;  // updates flower's top petal tip x value
    }
  }
}

///removes a polination animation by id
function removePollinationAnimation( id ) {
  for ( var i=0; i<pollinationAnimations.length; i++){ 
    if ( pollinationAnimations[i].id === id) { pollinationAnimations.splice(i,1); }
  }
}

///removes all flower points & spans
function removeAllflowerPointsAndSpans( plant ) {
  for ( var i=0; i<plant.flowers.length; i++ ) {
    var f = plant.flowers[i];
    if ( f.ptHbL ) { removePoint( f.ptHbL.id ); }  // flower hex bottom left point
    if ( f.ptHbR ) { removePoint( f.ptHbR.id ); }  // flower hex bottom right point
    if ( f.ptHoL ) { removePoint( f.ptHoL.id ); }  // flower hex outer left point
    if ( f.ptHoR ) { removePoint( f.ptHoR.id ); }  // flower hex outer right point
    if ( f.ptHtL ) { removePoint( f.ptHtL.id ); }  // flower hex top left point
    if ( f.ptHtR ) { removePoint( f.ptHtR.id ); }  // flower hex top right point
    if ( f.ptBudTip ) { removePoint( f.ptBudTip.id ); }  // flower bud tip point
    if ( f.ptPtL ) { removePoint( f.ptPtL.id ); }  // flower petal top left point  
    if ( f.ptPtM ) { removePoint( f.ptPtM.id ); }  // flower petal top middle point  
    if ( f.ptPtR ) { removePoint( f.ptPtR.id ); }  // flower petal top right point  
    if ( f.ptPbL ) { removePoint( f.ptPbL.id ); }  // flower petal bottom left point  
    if ( f.ptPbM ) { removePoint( f.ptPbM.id ); }  // flower petal bottom middle point  
    if ( f.ptPbR ) { removePoint( f.ptPbR.id ); }  // flower petal bottom right point  
    if ( f.ptPodTipL ) { removePoint( f.ptPodTipL.id ); }  // flower pod tip left point 
    if ( f.ptPodTipR ) { removePoint( f.ptPodTipR.id ); }  // flower pod tip right point
    if ( f.spOiL ) { removeSpan( f.spOiL.id ); }  // flower ovule inner left span
    if ( f.spOiR ) { removeSpan( f.spOiR.id ); }  // flower ovule inner right span
    if ( f.spCd ) { removeSpan( f.spCd.id ); }  // flower downward (l to r) cross span
    if ( f.spCu ) { removeSpan( f.spCu.id ); }  // flower upward (l to r) cross span
    if ( f.spCdP ) { removeSpan( f.spCdP.id ); }  // flower downward (l to r) cross span to parent
    if ( f.spCuP ) { removeSpan( f.spCuP.id ); }  // flower upward (l to r) cross span to parent
    if ( f.spOoL ) { removeSpan( f.spOoL.id ); }  // flower ovule outer left span 
    if ( f.spOoR ) { removeSpan( f.spOoR.id ); }  // flower ovule outer right span 
    if ( f.spHbM ) { removeSpan( f.spHbM.id ); }  // flower hex bottom middle span
    if ( f.spHbL ) { removeSpan( f.spHbL.id ); }  // flower hex bottom left span
    if ( f.spHbR ) { removeSpan( f.spHbR.id ); }  // flower hex bottom right span
    if ( f.spHtL ) { removeSpan( f.spHtL.id ); }  // flower hex top left span
    if ( f.spHtR ) { removeSpan( f.spHtR.id ); }  // flower hex top right span
    if ( f.spHtM ) { removeSpan( f.spHtM.id ); }  // flower hex top middle span
    if ( f.spHcH ) { removeSpan( f.spHcH.id ); }  // flower hex cross horizontal span
    if ( f.spHcDB ) { removeSpan( f.spHcDB.id ); }  // flower hex cross downward span to flower base
    if ( f.spHcUB ) { removeSpan( f.spHcUB.id ); }  // flower hex cross upward span to flower base
    if ( f.spBTSL ) { removeSpan( f.spBTSL.id ); }  // flower bud tip scaffolding left span
    if ( f.spBTSR ) { removeSpan( f.spBTSR.id ); }  // flower bud tip scaffolding right span
  }
}




/////---RENDERERS---/////


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
        //pulsing indicator showing that flower color qualifies as red
        if ( viewRedFlowerIndicator && f.isRed && f.bloomRatio === 1 && p.isAlive && p.energy > 0 ) {
          var fcp = spanMidPoint( f.spHcH );  // flower center point (center of hex)
          var pt = 100;  // pulse time (in worldTime units) 
          var ir = f.spHcH.l * (worldTime%pt)*0.011 + f.spHcH.l*0.75;  // indicator radius
          var ia = 1-(worldTime%pt)/pt;  // indicator alpha
          ctx.strokeStyle = "rgba(255,0,0,"+ia+")";
          ctx.beginPath();
          ctx.lineWidth = f.spHcH.l*0.2;
          ctx.arc( fcp.x, fcp.y, ir, 0, 2*Math.PI );
          ctx.stroke();
        }
        //top petals
        ctx.lineWidth = 1;
        ctx.fillStyle = "hsla("+f.clP.h+",100%,"+f.clP.l+"%,"+p.opacity+")"; 
        ctx.strokeStyle = "rgba("+f.clO.r+","+f.clO.g+","+f.clO.b+","+p.opacity+")";
        ctx.beginPath();  // top middle petal
        ctx.moveTo( f.ptHtL.cx, f.ptHtL.cy ); 
        pah = petalArcAdjustment( f, f.ptHtL, f.ptHtR, f.ptPtM, 0.2, 0.45);
        Tl.arcFromTo( f.ptHtL, f.ptPtM, pah ); Tl.arcFromTo( f.ptPtM, f.ptHtR, pah );
        ctx.fill(); ctx.stroke();
        ctx.beginPath();  // top left petal
        ctx.moveTo( f.ptHoL.cx, f.ptHoL.cy );
        pah = petalArcAdjustment( f, f.ptHoL, f.ptHtL, f.ptPtL, 0.2, 0.35);
        Tl.arcFromTo( f.ptHoL, f.ptPtL, pah ); Tl.arcFromTo( f.ptPtL, f.ptHtL, pah );
        ctx.fill(); ctx.stroke();
        ctx.beginPath();  // top right petal
        ctx.moveTo(f.ptHtR.cx, f.ptHtR.cy); 
        pah = petalArcAdjustment( f, f.ptHtR, f.ptHoR, f.ptPtR, 0.2, 0.35);
        Tl.arcFromTo( f.ptHtR, f.ptPtR, pah ); Tl.arcFromTo( f.ptPtR, f.ptHoR, pah );
        ctx.fill(); ctx.stroke();
        //ovule
        ctx.beginPath();
        ctx.fillStyle = "rgba("+f.clOv.r+","+f.clOv.g+","+f.clOv.b+","+p.opacity+")"; 
        ctx.strokeStyle = "rgba("+f.clO.r+","+f.clO.g+","+f.clO.b+","+p.opacity+")";  
        ctx.moveTo(f.ptBL.cx, f.ptBL.cy);
        Tl.arcFromTo( f.ptBL, f.ptHoL, 0.1 );
        ctx.lineTo(f.ptHoR.cx, f.ptHoR.cy);
        Tl.arcFromTo( f.ptHoR, f.ptBR, 0.1 );
        ctx.fill();
        ctx.stroke();     
        //hex (polinator pad)
        ctx.beginPath();
        ctx.fillStyle = "rgba("+ Math.round(f.clH.r)+","+
                                 Math.round(f.clH.g)+","+
                                 Math.round(f.clH.b)+","+
                                 p.opacity+")"; 
        ctx.moveTo(f.ptHtR.cx, f.ptHtR.cy);
        ctx.lineTo(f.ptHoR.cx, f.ptHoR.cy);
        ctx.lineTo(f.ptHbR.cx, f.ptHbR.cy);
        ctx.lineTo(f.ptHbL.cx, f.ptHbL.cy);
        ctx.lineTo(f.ptHoL.cx, f.ptHoL.cy);
        ctx.lineTo(f.ptHtL.cx, f.ptHtL.cy);
        ctx.fill();
        ctx.beginPath();
        ctx.strokeStyle = "rgba("+f.clO.r+","+f.clO.g+","+f.clO.b+","+p.opacity+")";  
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
        ctx.fillStyle = "hsla("+f.clP.h+",100%,"+f.clP.l+"%,"+p.opacity+")";  
        ctx.strokeStyle = "rgba("+f.clO.r+","+f.clO.g+","+f.clO.b+","+p.opacity+")";
        ctx.beginPath();  // bottom left petal
        ctx.moveTo( f.ptHoL.cx, f.ptHoL.cy );
        pah = petalArcAdjustment( f, f.ptHoL, f.ptHbL, f.ptPbL, 0.35, 0.35);
        Tl.arcFromTo( f.ptHoL, f.ptPbL, pah ); Tl.arcFromTo( f.ptPbL, f.ptHbL, pah );
        ctx.fill(); ctx.stroke();
        ctx.beginPath();  // bottom right petal
        ctx.moveTo(f.ptHbR.cx, f.ptHbR.cy);
        pah = petalArcAdjustment( f, f.ptHbR, f.ptHoR, f.ptPbR, 0.35, 0.35);
        Tl.arcFromTo( f.ptHbR, f.ptPbR, pah ); Tl.arcFromTo( f.ptPbR, f.ptHoR, pah );
        ctx.fill(); ctx.stroke();
        ctx.beginPath();  // bottom middle petal
        ctx.moveTo( f.ptHbL.cx, f.ptHbL.cy );
        pah = petalArcAdjustment( f, f.ptHbL, f.ptHbR, f.ptPbM, 0.2, 0.45);
        Tl.arcFromTo( f.ptHbL, f.ptPbM, pah ); Tl.arcFromTo( f.ptPbM, f.ptHbR, pah );
        ctx.fill(); ctx.stroke();
      }
      if ( viewPods ) { renderPods( f ); }
      trackMaxRedFlowerHeights(f);
    }
  }
}

///render pollen burst
function renderPollenBurst( pollinationAnimation ) {
  var pa = pollinationAnimation;
  var blsqi = 1;  // burst line squiggle intensity
  for ( var i=0; i<pa.bls.length; i++ ) {
    var bl = pa.bls[i];  // burst line
    var blInc = bl.dist / pa.burstDuration;  // increment of burst line movement per iteration
    var blXDiff = bl.dx - pa.burstOrigin.x;  // x difference between flower 1 center and burst destination point
    var blYDiff = bl.dy - pa.burstOrigin.y;  // y difference between flower 1 center and burst destination point
    var blIncRat = blInc / bl.dist;  // increment ratio (ratio of increment to current total distance)
    var blXInc = blXDiff*blIncRat;  // burst line x increment this iteration
    var blYInc = blYDiff*blIncRat;  // burst line y increment this iteration
    var blo = (1-pa.iterationCount/pa.burstDuration)*pa.op;  // burst line opacity (reduces gradually)
    var burstComplete = ( pa.iterationCount >= pa.burstDuration );
    blXInc += Tl.rfb(-blsqi,blsqi);  // adds x squiggle
    blYInc += Tl.rfb(-blsqi,blsqi);  // adds y squiggle
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = canvas.width*0.0015;
    if ( pa.iterationCount <= pa.burstDuration ) { 
      bl.xa.unshift( bl.xa[0] + blXInc );  // adds new x value to burst line x values array as first element
      bl.xa.pop();  // removes last element of burst line x values array
      bl.ya.unshift( bl.ya[0] + blYInc );  // adds new y value to burst line y values array as first element
      bl.ya.pop();  // removes last element of burst line y values array
      ctx.beginPath();
      ctx.moveTo( bl.xa[0], bl.ya[0]);
      var blto = blo;  // burst line tail opacity at head
      for ( var j=1; j<bl.xa.length; j++) {  // draws burst line tail
        blto -= blo/bl.xa.length;  
        ctx.strokeStyle = "rgba( "+C.pl.r+", "+C.pl.g+", "+C.pl.b+", "+blto+" )";
        ctx.lineTo( bl.xa[j], bl.ya[j] );
        ctx.stroke();
      }
    } 
  }
  if ( pa.iterationCount >= pa.burstDuration ) { pa.pollenBurstComplete = true; }
}

///render pollination glow (temporary polinator pad glow indicating flower has been pollinated)
function renderPollinationGlow( pollinationAnimation ) {
  var pa = pollinationAnimation;
  var glowDuration = pa.f1 === pa.f2 ? 240 : 120; 
  if ( !pa.pollenPadGlowHasBegun ) {
    pa.f2.clH = C.pg;  // changes pollen pad color to temporary glow color
    pa.pollenPadGlowHasBegun = true;
  }
  if ( pa.pollenPadGlowHasBegun && !pa.pollenPadGlowComplete ) {
    pa.f2.clH = Tl.rgbaCs( C.pg, C.pp, pa.f2.clH, glowDuration );  // fades pollen pad color back to normal
    pa.glowIterationCount++;
    if ( pa.glowIterationCount === glowDuration ) { 
      pa.pollenPadGlowComplete = true; 
    }
  }
}

///render pollinator lines
function renderPollinatorLines( pollinationAnimation ) {
  var pa = pollinationAnimation;
  var plInc = canvas.width*0.0075;  // increment of pollination line movement per iteration
  var plsqi = 2;  // pollination line squiggle intensity
  for ( var i=0; i<pa.pls.length; i++ ) {
    var pl = pa.pls[i];  // pollination line
    var f2cp = spanMidPoint( pa.f2.spHcH );  // flower 2 (pollinated flower) current center point position 
    var plXDiff = f2cp.x - pl.xa[0];  // x difference between pollination line head and flower 2
    var plYDiff = f2cp.y - pl.ya[0];  // y difference between pollination line head and flower 2
    var plDist =  Math.sqrt( plXDiff*plXDiff + plYDiff*plYDiff);  // distance from pollination line head to flower 2
    var plIncRat = plInc/plDist;  // increment ratio (ratio of increment to current total distance)
    var plXInc = plXDiff*plIncRat;  // pollination line head x increment this iteration
    var plYInc = plYDiff*plIncRat;  // pollination line head y increment this iteration
    plXInc += Tl.rfb(-plsqi,plsqi);  // adds x squiggle
    plYInc += Tl.rfb(-plsqi,plsqi);  // adds y squiggle
    if ( plDist > plInc ) { 
      pl.xa.unshift( pl.xa[0] + plXInc );  // adds new x value to pollination line x values array as first element
      pl.ya.unshift( pl.ya[0] + plYInc );  // adds new y value to pollination line y values array as first element
    } 
    pl.xa.pop();  // removes last element of pollination line x values array
    pl.ya.pop();  // removes last element of pollination line y values array
    ctx.beginPath();
    if ( pl.xa.length > 0 ) {
      ctx.moveTo( pl.xa[0], pl.ya[0]);
      var plto = pa.op;  // pollination line tail opacity at head
      for ( var j=1; j<pl.xa.length; j++ ) {
        plto -= pa.op/pl.xa.length;  
        ctx.strokeStyle = ctx.strokeStyle = "rgba( "+C.pl.r+", "+C.pl.g+", "+C.pl.b+", "+plto+" )";
        ctx.lineTo( pl.xa[j], pl.ya[j] );
        ctx.stroke();
      }
    } else {
      pa.pollinatorLinesHaveArrived = true;
    }
    if ( viewPollinationGlow && pa.pollinatorLinesHaveArrived ) {
      renderPollinationGlow( pa );  // pollination pad glow
    }
  }
}

///render pollination animations
function renderPollinationAnimations() {
  var idsForRemoval = [];
  for ( var i=0; i<pollinationAnimations.length; i++ ) {
    var pa = pollinationAnimations[i];
    // burst lines 
    if ( viewPollenBursts ) { renderPollenBurst( pa ); } else { pa.pollenBurstComplete = true; }  
    // pollination lines 
    if ( viewPollinatorLines ) { renderPollinatorLines( pa ); } else { pa.pollinatorLinesHaveArrived = true; } 
    // pollination glow (if pollinator lines haven't been turned off; otherwise handled in renderPollinatorLines)
    if ( !viewPollinatorLines && viewPollinationGlow  ) {
      renderPollinationGlow( pa );
    } else if ( !viewPollinationGlow ) {
      pa.pollenPadGlowComplete = true;
    }
    pa.iterationCount++;
    var animationComplete = ( pa.pollenBurstComplete && pa.pollinatorLinesHaveArrived && pa.pollenPadGlowComplete );
    if ( animationComplete ) { idsForRemoval.push( pa.id ); }  // removes animation instance after complete
  }
  for ( var j=0; j<idsForRemoval.length; j++) { removePollinationAnimation( idsForRemoval[j] ); }
}

///renders new best height announcements
function renderHeightAnnouncement() {
  var fsi = 2.5;  // font size max increase
  var td = 0.5;  // top decrease (per animation segment)
  var ha = -3;  // height adjustment
  var dur = 300;  // duration (of each animation segment)
  var c = "rgba( 130, 0, 0, 1 )";  // color (default to dark red)
  if ( highestRedFlowerPct >= 80) {
    td = -0.5; 
    ha = 15;
    c = "rgba(17, 17, 17, 1)";
  }
  $("#height_announcement").finish(); // clears the previous height announcement animation if it hasn't completed yet
  $("#height_announcement")
    .text( Math.floor( highestRedFlowerPct ) + "%" )
    .css({  
      top: 100-highestRedFlowerPct+ha + "%",
      left: pctFromXVal( heightMarker.chrfx ) + "%",
      opacity: 1,
      color: c,
    })
    .animate({ 
      fontSize: "+="+fsi+"pt",
      top: "-="+td+"%",
      opacity: 1,
    }, dur, "linear")
    .animate({ 
      fontSize: "-="+fsi+"pt",
      top: "-="+td*2+"%",
      opacity: 0,    
    }, dur*2, "easeOutQuart", function() {  // (uses easing plugin)
      //callback resets original values
      $("#height_announcement").css({
        fontSize: "10pt",
      }); 
    }
  );
}

///fades out milestone announcements in and out
function fadeMilestoneInOut( idString ) {
  readyForNextMilestoneAnnouncement = false;
  $(idString)
    .css( "visibility", "visible" )
    .animate({ opacity: 1 }, 2000)
    .animate({ opacity: 1 }, 5000)
    .animate({ opacity: 0 }, 1000, function(){
      readyForNextMilestoneAnnouncement = true;
    });
}

///renders milestone announcements 
function renderMilestones() {
  if ( allDemosHaveRun && readyForNextMilestoneAnnouncement ) {
    if ( !milestoneFirstRedHasBeenRun && highestRedFlowerPct > 0 ) {
      fadeMilestoneInOut("#milestone_first_red_flower");
      milestoneFirstRedHasBeenRun = true;
    } else if ( !milestoneThirdHasBeenRun && highestRedFlowerPct >= 34 ) {
      fadeMilestoneInOut("#milestone_third");
      milestoneThirdHasBeenRun = true;          
    } else if ( !milestoneHalfHasBeenRun && highestRedFlowerPct >= 50 ) {
      fadeMilestoneInOut("#milestone_half");
      milestoneHalfHasBeenRun = true;          
    } else if ( !milestoneTwoThirdsHasBeenRun && highestRedFlowerPct >= 67 ) {
      fadeMilestoneInOut("#milestone_two_thirds");
      milestoneTwoThirdsHasBeenRun = true;          
    } else if ( !milestone90HasBeenRun && highestRedFlowerPct >= 90 ) {
      fadeMilestoneInOut("#milestone_90");
      milestone90HasBeenRun = true;          
    } 
  }
}

///renders markers that track the highest red flower height so far
function renderHeightMarker() {
  var hrfy = canvas.height - yValFromPct( highestRedFlowerPct );  // highest red flower y value currently
  var chmp = 100-pctFromYVal(heightMarker.y);  // current height marker percentage
  if ( Math.floor( highestRedFlowerPct ) > Math.floor(chmp) ) {   // initializes animations if new highest red flower
    heightMarker.y = hrfy;  // y value
    heightMarker.baa = true;  // bounce animation active
    heightMarker.bat = 0;  // bounce animation time elapsed
    heightMarker.laa = true;  // line animation active
    heightMarker.lat = 0;  // line animation time elapsed
    $("#height_number").text( Math.floor( highestRedFlowerPct ) );
    renderHeightAnnouncement();
  }
  //new highest height marker bounce animation (size expansion & contraction)
  if ( heightMarker.baa ) {  
    heightMarker.bat++;
    var a = -0.12;  // corresponds to animation duration ( higher value is longer duration; 0 is infinite)
    var b = 2;  // extent of expansion ( higher value is greater expansion )
    var x = heightMarker.bat; 
    var y = a*Math.pow(x,2) + b*x;  // current marker expansion extent (quadratic formula; y = ax^2 + bx + c)
    heightMarker.w = canvas.width*0.025 + y;
    if ( y <= 0 ) { heightMarker.baa = false; heightMarker.bat = 0; }
  }
  //new highest height line animation
  if ( heightMarker.laa ) {  
    heightMarker.lat++;
    var lad = 40;  // line animation duration
    var o = 1 - heightMarker.lat/lad;  // opacity
    ctx.beginPath();
    ctx.lineWidth = 2;
    var lGrad = ctx.createLinearGradient( heightMarker.chrfx-canvas.width, heightMarker.y, heightMarker.chrfx+canvas.width, heightMarker.y );
    lGrad.addColorStop("0", "rgba( 161, 0, 0, 0 )");
    lGrad.addColorStop("0.4", "rgba( 161, 0, 0, " + 0.3*o + ")");
    lGrad.addColorStop("0.5", "rgba( 161, 0, 0, " + 1*o + ")");
    lGrad.addColorStop("0.6", "rgba( 161, 0, 0, " +0.3*o + ")");
    lGrad.addColorStop("1", "rgba( 161, 0, 0, 0 )");
    ctx.strokeStyle = lGrad;
    ctx.moveTo( heightMarker.chrfx-canvas.width, heightMarker.y );
    ctx.lineTo( heightMarker.chrfx+canvas.width, heightMarker.y );
    ctx.stroke();
    if ( heightMarker.lat > lad ) { heightMarker.laa = false; heightMarker.lat = 0; }
  }
  //draws marker
  if ( highestRedFlowerPct > 0 ) {  
    ctx.beginPath();  // top triangle
    ctx.fillStyle = "#D32100";
    ctx.moveTo( canvas.width, heightMarker.y );  
    ctx.lineTo( canvas.width, heightMarker.y - heightMarker.h/2 ); 
    ctx.lineTo( canvas.width-heightMarker.w, heightMarker.y ); 
    ctx.fill();  
    ctx.beginPath();  // bottom triangle
    ctx.fillStyle = "#A10000";
    ctx.moveTo( canvas.width, heightMarker.y );  
    ctx.lineTo( canvas.width, heightMarker.y + heightMarker.h/2 ); 
    ctx.lineTo( canvas.width-heightMarker.w, heightMarker.y ); 
    ctx.fill();
  }
}

///renders pods
function renderPods( flower ) {
  var f = flower;
  var plantOpacity = Tl.obById( plants, f.plantId ).opacity;
  var opacity = f.podOpacity <= plantOpacity ? f.podOpacity : plantOpacity; 
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.lineWidth = 2.5;
  ctx.fillStyle = "rgba("+f.clOv.r+","+f.clOv.g+","+f.clOv.b+","+opacity+")";  // dark green
  ctx.strokeStyle = "rgba("+f.clO.r+","+f.clO.g+","+f.clO.b+","+opacity+")";  // dark brown
  ctx.beginPath();
  ctx.moveTo(f.ptBL.cx, f.ptBL.cy);
  Tl.arcFromTo( f.ptBL, f.ptHoL, 0.1 );
  Tl.arcFromTo( f.ptHoL, f.ptPodTipL, 0.07 );
  if ( flower.podOpenRatio > 0 ) {
    var hp = spanMidPoint( f.spHbM );  // hinge point
    ctx.lineTo( hp.x, hp.y );
    ctx.lineTo( f.ptPodTipR.cx, f.ptPodTipR .cy );
  }
  Tl.arcFromTo( f.ptPodTipR, f.ptHoR, 0.1 );
  Tl.arcFromTo( f.ptHoR, f.ptBR, 0.07 );
  ctx.stroke();
  ctx.fill();
}



















