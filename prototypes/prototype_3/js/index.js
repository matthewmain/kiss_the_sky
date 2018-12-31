



///////////////////////////////////////////////////////////////// 
////////////     Plant Evolution App: Prototype 3     /////////// 
/////////////////////////////////////////////////////////////////

//https://github.com/matthewmain/plant_evolution_app/tree/master/prototypes/prototype_3



////---INITIATION---////


///trackers
var seeds = [], seedCount = 0;
var plants = [], plantCount = 0;
var sunRays = [], sunRayCount = 0;
var shadows = [], shadowCount = 0;

///settings
var worldSpeed = 1;//5;  // (as frames per iteration: higher is slower) (does not affect physics iterations)
var viewUI = true;
var viewShadows = false;  // (shadow visibility)
var viewStalks = true;  // (stalk visibility) 
var viewLeaves = true;  // (leaf visibility)
var viewFlowers = true;  // (flower visibility)
var viewPods = true;  // (pod visibilty)
var seedsPerFlower = 0;//3;  // number of seeds produced by a fertilized flower
var restrictGrowthByEnergy = true;  // restricts plant growth by energy level (if false, plants grow freely)
var sunRayIntensity = 1;  // total energy units per sun ray per iteration
var photosynthesisRatio = 1;  // ratio of available sun energy stored by leaf when ray contacts it (varies by season)
var groEnExp = 0.5;  // growth energy expenditure rate (rate energy is expended for growth)
var livEnExp = 0.2;  // living energy expenditure rate (rate energy is expended for living)
var energyStoreFactor = 1000;  // (a plant's maximum storable energy units per segment)
var oldAgeMarker = 20000;  // (age after flower bloom when plant starts dying of old age, in worldtime units)
var oldAgeRate = 0.001;  // (additional energy reduction per iteration after plant reaches old age)
var unhealthyEnergyLevelRatio = 0.075;  // ratio of maximum energy when plant becomes unhealthy (starts yellowing)
var flowerFadeEnergyLevelRatio = -0.025;  // ratio of maximum energy when flower begins to fade
var polinatorPadFadeEnergyLevelRatio = -0.075;  // ratio of maximum energy when polinator pad begins to fade
var sickEnergyLevelRatio = -0.2;  // ratio of maximum energy when plant becomes sick (starts darkening)
var podOpenEnergyLevelRatio = -0.5; // ratio of maximum energy when seed pod disperses seeds
var deathEnergyLevelRatio = -1;  // ratio of maximum energy when plant dies (fully darkened)
var collapseEnergyLevelRatio = -2;  // ratio of maximum energy when plant collapses




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
  dil: { r: 56, g: 47, b: 12, a: 1 },  // dead inner line color (slightly darker brown than leaf fill)
  //pollen pad
  pp: { r: 255, g: 217, b: 102, a: 1 }  // pollen pad color
};

///seed constructor
function Seed( parentFlower ) {
  this.id = seedCount;
  this.parentFlower = parentFlower;
  if ( parentFlower === null ) {
    this.sw = 14;  // seed width 
    this.p1 = addPt( Tl.rib(33,66), Tl.rib(5,25) );  // seed point 1 (placed in air for scattering at initiation)
    this.p2 = addPt( pctFromXVal( this.p1.cx + this.sw*1.6 ), pctFromYVal( this.p1.cy ) );  // seed point 2
  } else {
    this.sw = this.parentFlower.spHcH.l/2;  // seed width
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
  this.sourceSeedHasBeenRemoved = false;
  this.id = plantCount;
  this.germinationYear = currentYear;  // germination year
  this.age = 0;  // plant age in worldtime units 
  this.segments = []; this.segmentCount = 0;
  this.flowers = []; this.flowerCount = 0;
  this.xLocation = null;
  this.seedEnergy = energyStoreFactor * Tl.rfb(8,12);  // energy level from seed at plant initiation
  this.energy = this.seedEnergy;  // energy (starts with seed energy at germination)
  this.maxEnergyLevel = this.segmentCount * energyStoreFactor;
  this.leafArcHeight = 0.35;  // arc height (as ratio of leaf length)
  this.hasFlowers = false;
  this.ph = Tl.rib( 0, 260 ); if ( this.ph > 65 && this.ph < 165) { this.ph += 100; }  // petal hue
  this.ps = Tl.rib( 50, 100 );  // petal saturation
  this.pl = Tl.rib( 35, 70 );  // petal lightness
  this.isAlive = true;
  this.hasReachedOldAge = false;
  this.oldAgeReduction = 0;  // (energy reduction per plant iteration, when plant is dying of old age)
  this.hasCollapsed = false;
  this.isActive = true;  // (inactive plants are rendered but ignored by all other local plant & light iterations)
  this.hasDecomposed = false;  // decomposed plants are compressed to floor y-value and ready to be removed
  this.opacity = 1;
  this.hasBeenRemoved = false;
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
  this.pollenPadColor = C.pp;  // pollen pad color
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
  this.skins.push( addSk( [ this.ptE1.id, this.ptE2.id, this.ptB2.id, this.ptB1.id ], null ) );
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




////---FUNCTIONS---////


/// Instance Creators ///

///creates a new seed
function createSeed( parentFlower ) {
  seedCount++;
  seeds.push( new Seed( parentFlower ) );
  if ( parentFlower !== null ) { parentFlower.seeds.push( seeds[seeds.length-1] ); }
  return seeds[seeds.length-1];
}

///creates a new plant (while maintaining render ordering)
function createPlant( sourceSeed ) {
  plantCount++;
  if ( sourceSeed.parentFlower === null ) {  // if seed is initiating seed, adds new plant to end of the plants array
    plants.push( new Plant( sourceSeed ) ); 
    return plants[plants.length-1]; 
  } else {
    for ( var i=0; i<plants.length; i++) {  // if not initiating seed, adds new plant before parent in plants array
      if ( sourceSeed.parentFlower.plantId === plants[i].id ) { 
        plants.splice( i, 0, new Plant( sourceSeed ) ); 
        return plants[i];  
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

///removes a seed by id from seeds array
function removeSeed( seedId ) {
  for( var i=0; i<seeds.length; i++){ 
    if ( seeds[i].id === seedId ) { seeds.splice(i, 1); }
  }
}

///removes a plant by id from plants array
function removePlant( plantId ) {
  for( var i=0; i<plants.length; i++){ 
    if ( plants[i].id === plantId ) { plants.splice(i, 1); }
  }
}



/// Component Functions ///

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
  var p1Positioned = false;
  var p2Positioned = false;
  seed.p1.fixed = true;
  seed.p1.materiality = "immaterial"; 
  if ( seed.p1.cy < canvas.height-1 ) {
    seed.p1.cy += 1.5;
    seed.p2.cy += 1.5; 
  } else {
    p1Positioned = true;
  }
  if ( seed.p2.cy > seed.p2.py ) {
    seed.p2.cy = seed.p2.py;
    p2Positioned = true;
  }
  if ( p1Positioned && p2Positioned ) { 
    seed.planted = true;
  }
}

///germinates seeds when ready (after it has been planted and spring has arrived)
function germinateSeedWhenReady( seed ) {
  if ( seed.p1.cy > canvas.height-seed.p1.width/2-0.5 && !seed.planted && currentSeason === "spring") {    
    plantSeed( seed );
  }
  if ( seed.planted ) {
    germinateSeed( seed );
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
  plant.germinationYear = currentYear;
}

///removes seed when ready
function hideAndRemoveSeed( seed ) {
  if ( seed.opacity > 0 ) {
    fadeSeedOut( seed );
  } else if ( seed.opacity <= 0 ) {
    removePoint( seed.p1.id );
    removePoint( seed.p2.id );
    removeSpan( seed.sp.id );
    removeSeed( seed.id );
    seed.resultingPlant.sourceSeedHasBeenRemoved = true;
  } 
}

///fades out seed visibility gradually (for after germination)
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
  var segmentForwardSpanReady = segment.spF.l > plant.maxSegmentWidth * 0.333;
  var segmentDoesNotHaveChild = !segment.hasChild;
  var plantIsNotFullyGrown = plant.segmentCount < plant.maxTotalSegments;
  return plantIsNotFullyGrown && segmentDoesNotHaveChild && segmentForwardSpanReady;
}

///checks whether a segment is ready to generate leaves segment
function plantReadyForLeaves( plant, segment ) {
  var segIsFirstLeafSeg = segment.id === plant.firstLeafSegment;
  var plantIsReadyForFirstLeaves = segment.id - plant.firstLeafSegment > 0;
  var plantIsReadyForNextLeaves = ( segment.id - plant.firstLeafSegment ) % plant.leafFrequency === 0;
  var segIsReadyToProduceLeaves = segment.spF.l > plant.maxSegmentWidth * 0.1;
  return segIsFirstLeafSeg || plantIsReadyForFirstLeaves && plantIsReadyForNextLeaves && segIsReadyToProduceLeaves;
}

///generates leaves when segment is ready
function generateLeavesWhenReady( plant, segment ) {
  var p = plant;
  var s = segment;
  if ( plantReadyForLeaves( plant, segment ) ) {
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
  removeSpan(s.leafTipsTetherSpan.id);  // removes leaf tips tether
  s.ptLf1.cx -= gravity * 100;  // leaf-unfold booster left
  s.ptLf2.cx += gravity * 100;  // leaf-unfold booster right
  //scaffolding points, leaf 1
  var x = s.ptE1.cx + ( s.ptE1.cx - s.ptE2.cx ) * 0.5;
  var y = s.ptE1.cy + ( s.ptE1.cy - s.ptE2.cy ) * 0.5;
  s.ptLf1ScA = addPt( pctFromXVal( x ), pctFromXVal( y ), "immaterial" ); s.ptLf1ScA.mass = 0;
  x = ( s.ptLf1.cx + s.ptLf1ScA.cx ) / 2 ;
  y = ( s.ptLf1.cy + s.ptLf1ScA.cy ) / 2 ;
  s.ptLf1ScB = addPt( pctFromXVal( x ), pctFromXVal( y ), "immaterial" ); s.ptLf1ScB.mass = 0;
  //scaffolding points, leaf 2
  x = s.ptE2.cx + ( s.ptE2.cx - s.ptE1.cx ) * 0.5;
  y = s.ptE2.cy + ( s.ptE2.cy - s.ptE1.cy ) * 0.5;
  s.ptLf2ScA = addPt( pctFromXVal( x ), pctFromXVal( y ), "immaterial" ); s.ptLf2ScA.mass = 0;
  x = ( s.ptLf2.cx + s.ptLf2ScA.cx ) / 2 ;
  y = ( s.ptLf2.cy + s.ptLf2ScA.cy ) / 2 ;
  s.ptLf2ScB = addPt( pctFromXVal( x ), pctFromXVal( y ), "immaterial" ); s.ptLf2ScB.mass = 0;
  //scaffolding spans, leaf 1
  s.spLf1ScA = addSp( s.ptE1.id, s.ptLf1ScA.id, "hidden" );
  s.spLf1ScB = addSp( s.ptB1.id, s.ptLf1ScA.id, "hidden" ); 
  s.spLf1ScC = addSp( s.ptLf1ScA.id, s.ptLf1ScB.id, "hidden" ); 
  s.spLf1ScD = addSp( s.ptLf1ScB.id, s.ptLf1.id, "hidden" ); 
  //scaffolding spans, leaf 2
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
    s.spLf1.l = s.spLf2.l += p.leafGrowthRate;  // extend leaves
    if ( s.spF.l > p.maxSegmentWidth*0.6 && !s.hasLeafScaffolding ) {
      addLeafScaffolding( plant, segment );  // add scaffolding
    } else if ( s.hasLeafScaffolding ) {  // extend scaffolding
      s.spLf1ScA.l += p.leafGrowthRate * 1.25;
      s.spLf1ScB.l += p.leafGrowthRate * 1.5;
      s.spLf1ScC.l += p.leafGrowthRate * 0.06;
      s.spLf1ScD.l += p.leafGrowthRate * 0.06;
      s.spLf2ScA.l += p.leafGrowthRate * 1.25;
      s.spLf2ScB.l += p.leafGrowthRate * 1.5;
      s.spLf2ScC.l += p.leafGrowthRate * 0.06;
      s.spLf2ScD.l += p.leafGrowthRate * 0.06;
    }
  }
}

///grows all plants
function growPlants() {
  for (var i=0; i<plants.length; i++) {
    var p = plants[i];
    if ( p.isActive ) {
      p.age++;
      if ( !p.sourceSeed.hasGerminated ) { 
        germinateSeedWhenReady( p.sourceSeed );  // germinates seed
      } else if ( !p.sourceSeedHasBeenRemoved ) {
        hideAndRemoveSeed( p.sourceSeed );  // removes seed after germination
      }
      if ( p.energy > p.segmentCount*energyStoreFactor && p.energy>p.seedEnergy ) {
        p.energy = p.segmentCount*energyStoreFactor;  // caps plant max energy level based on segment count
      }
      if ( p.hasFlowers ) { 
        for ( var j=0; j<p.flowers.length; j++ ) {
          var flower = p.flowers[j];
          developFlower( p, flower );  
          if ( flower.ageSinceBlooming > oldAgeMarker ) {  // plant starts dying of old age
            p.hasReachedOldAge = true;
          } 
        }
      }
      if ( p.energy > 0 || !restrictGrowthByEnergy && !p.hasReachedOldAge ) { 
        for (var k=0; k<p.segments.length; k++) { 
          var s = p.segments[k];
          if ( s.spF.l < p.maxSegmentWidth ) { 
            lengthenSegmentSpans( p, s ); 
            p.energy -= s.spCd.l * groEnExp;  // reduces energy by segment size
          }
          if ( readyForChildSegment( p, s ) ) { 
            createSegment( p, s, s.ptE1, s.ptE2 ); 
          }
          if ( !s.hasLeaves ) { 
            generateLeavesWhenReady( p, s ); 
          } else {
            growLeaves( p, s ); 
            p.energy -= ( s.spLf1.l + s.spLf2.l ) * groEnExp;  // reduces energy by leaf length
          }
          if ( !p.hasFlowers && readyForFlower( p, s ) ) {
            createFlower( p, s, s.ptE1, s.ptE2 ); 
          }
        }
      }
      if ( p.hasReachedOldAge ) {
        p.oldAgeReduction += oldAgeRate;
        p.energy -= p.oldAgeReduction;  
      }
      if ( p.sourceSeed.hasGerminated ) {
        p.energy -= p.segmentCount * livEnExp;  // cost of living: reduces energy by a ratio of segment count
      } 
      if ( p.energy < p.maxEnergyLevel*deathEnergyLevelRatio && restrictGrowthByEnergy ) {
        killPlant( p );  // plant dies if energy level falls below minimum to be alive
      }
      if ( !p.hasCollapsed && p.energy<p.maxEnergyLevel*collapseEnergyLevelRatio && restrictGrowthByEnergy ) {
        collapsePlant( p );  // plant collapses if energy level falls below minimum to stay standing
        p.isActive = false;  // removes plant from local plant iterations
      }
    } else if ( p.hasCollapsed && currentYear - p.germinationYear >= 2 ) {
      decomposePlant( p );
    }
    if ( p.hasDecomposed && !p.hasBeenRemoved) {
      fadePlantOutAndRemove( p );
    }
  }
}

///shifts an rgba color between start and end colors scaled proportionally to start and end plant energy levels
function rgbaPlantColorShift( plant, startColor, endColor, startEnergy, endEnergy ) {
  var p = plant;
  var curEn = p.energy;  // current energy level
  var r = endColor.r - ( (curEn-endEnergy) * (endColor.r-startColor.r) / (startEnergy-endEnergy) );  // redshift
  var g = endColor.g - ( (curEn-endEnergy) * (endColor.g-startColor.g) / (startEnergy-endEnergy) );  // greenshift
  var b = endColor.b - ( (curEn-endEnergy) * (endColor.b-startColor.b) / (startEnergy-endEnergy) );  // blueshift
  return { r: r, g: g, b: b, a: 1 };
}

///shifts an hsl color between start and end colors scaled proportionally to start and end plant energy levels
function hslaPlantColorShift( plant, startColor, endColor, startEnergy, endEnergy ) {
  var p = plant;
  var curEn = p.energy;  // current energy level
  var h = endColor.h - ( (curEn-endEnergy) * (endColor.h-startColor.h) / (startEnergy-endEnergy) );  // redshift
  var s = endColor.s - ( (curEn-endEnergy) * (endColor.s-startColor.s) / (startEnergy-endEnergy) );  // greenshift
  var l = endColor.l - ( (curEn-endEnergy) * (endColor.l-startColor.l) / (startEnergy-endEnergy) );  // blueshift
  return { h: h, s: s, l: l, a: 1 };
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
    s.clS = rgbaPlantColorShift( p, C.hdf, C.yf, uel, sel );  // stalks (dark fills)
    s.clL = rgbaPlantColorShift( p, C.hlf, C.yf, uel, sel );  // leaves (light fills)
    s.clO = rgbaPlantColorShift( p, C.hol, C.yol, uel, sel );  // outlines
    s.clI = rgbaPlantColorShift( p, C.hil, C.yil, uel, sel );  // inner lines
  } else if ( cel <= sel && cel > del ) {  // sick energy levels (darkening)
    s.clS = rgbaPlantColorShift( p, C.yf, C.df, sel, del );  // stalks 
    s.clL = rgbaPlantColorShift( p, C.yf, C.df, sel, del );  // leaves
    s.clO = rgbaPlantColorShift( p, C.yol, C.dol, sel, del );  // outlines
    s.clI = rgbaPlantColorShift( p, C.yil, C.dil, sel, del );  // inner lines
  }
  if ( p.hasFlowers && s.id === 1 ) {
    for ( var i=0; i<p.flowers.length; i++ ) {
      var f = p.flowers[i];
      f.clOv = s.clS;  // flower ovule color (matches stalk color)
      f.clO = s.clO;  // outline color (matches plant dark outline color)
      var fc = plant.flowerColor;
      //(petals)
      var ffel = p.maxEnergyLevel * flowerFadeEnergyLevelRatio;  
      if ( cel <= ffel && cel > sel ) {  // flower fading energy levels
        f.clP = hslaPlantColorShift( p, fc, {h:fc.h,s:50,l:100}, ffel, sel );  // fade color
      } else if ( cel <= sel && cel > del ) {  // sick energy levels
        f.clP = hslaPlantColorShift( p, {h:50,s:50,l:100}, {h:45,s:100,l:15}, sel, del );  // darken color
      }      
      //(polinator pad)
      var ppfel = p.maxEnergyLevel * polinatorPadFadeEnergyLevelRatio;
      if ( cel <= ppfel && cel > sel ) {  // polinator pad fading energy levels
        f.clH = rgbaPlantColorShift( p, p.pollenPadColor, {r:77,g:57,b:0,a:1}, ppfel, sel );  // fade color
      } else if ( cel <= sel && cel > del ) {  // sick energy levels 
        f.clH = rgbaPlantColorShift( p, {r:77,g:57,b:0,a:1}, {r:51,g:37,b:0,a:1}, sel, del );  // darken color
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
    if ( s.hasLeafScaffolding ) {  // removes leaf scaffolding
      removeSpan(s.spLf1ScA.id); removeSpan(s.spLf2ScA.id);   
      removeSpan(s.spLf1ScB.id); removeSpan(s.spLf2ScB.id);
      removeSpan(s.spLf1ScC.id); removeSpan(s.spLf2ScC.id);
      removeSpan(s.spLf1ScD.id); removeSpan(s.spLf2ScD.id);
      removePoint(s.ptLf1ScA.id); removePoint(s.ptLf2ScA.id);
      removePoint(s.ptLf1ScB.id); removePoint(s.ptLf2ScB.id);
    }
    if ( s.hasLeaves && s.ptLf1.cy>s.ptB1.cy && s.ptLf2.cy>s.ptB2.cy ) {  // prevents dead leaves from swinging
      s.ptLf1.mass = s.ptLf2.mass = 0.5;
      if ( s.ptLf1.cy < s.ptLf1.py ) { s.ptLf1.cy = s.ptLf1.py; s.ptLf1.cx = s.ptLf1.px; }
      if ( s.ptLf2.cy < s.ptLf2.py ) { s.ptLf2.cy = s.ptLf2.py; s.ptLf2.cx = s.ptLf2.px; }
    }
  }
}

///collapses plant (*currently very clunky; revisit & improve during stylization)
function collapsePlant( plant ) {
  var p = plant; 
  for (var i=0; i<plant.segments.length; i++) {
    var s = plant.segments[i];
    if (!s.isBaseSegment) {
      removeSpan(s.spCdP.id);  // downward (l to r) cross span to parent
      removeSpan(s.spCuP.id);  // upward (l to r) cross span to parent
    }
    removeSpan(s.spCd.id);  // downward (l to r) cross span
    removeSpan(s.spCu.id);  // upward (l to r) cross span
  }
  if ( p.hasFlowers ) {
    for (var j=0; j<p.flowers.length; j++ ) {
      var f = p.flowers[j];
      f.podOpenRatio = 0;
      removeSpan(f.spCuP.id);
      removeSpan(f.spCdP.id);
      removeSpan(f.spCu.id);
      removeSpan(f.spCu.id);
      removeSpan(f.spHbM.id);
      removeSpan(f.spHcDB.id);
      removeSpan(f.spHcUB.id);
      removeSpan(f.spHcH.id);
      removeSpan(f.spBTSL.id);
      removeSpan(f.spBTSL.id);
      f.ptBudTip.mass = 1;
    }
  }
  p.hasCollapsed = true; 
}

///decomposes plant after collapse
function decomposePlant( plant ) {
  if ( plant.leafArcHeight > 0.05 ) {  
    plant.leafArcHeight -= 0.0001;
  } else {
    plant.leafArcHeight = 0.05;
    plant.hasDecomposed = true;
  }
}

///removes plant and all of its associated points, spans, and skins
function fadePlantOutAndRemove( plant ) {
  var p = plant;
  if (p.opacity > 0) {
    p.opacity -= 0.001;
  } else {
    p.opacity = 0;
    removePoint( p.ptB1.id );  // plant base point 1
    removePoint( p.ptB2.id );  // plant base point 2
    removeSpan( p.spB.id );  // plant base span
    for ( var i=0; i<p.segments.length; i++ ) {
      sg = p.segments[i];
      removePoint( sg.ptE1.id );  // segment extension point 1
      removePoint( sg.ptE2.id );  // segment extension point 1
      removeSpan( sg.spL.id );  // segment left span
      removeSpan( sg.spR.id );  // segment right span
      removeSpan( sg.spF.id );  // segment forward span
      removeSpan( sg.spCd.id );  // segment downward (l to r) cross span
      removeSpan( sg.spCu.id );  // segment upward (l to r) cross span
      for (var j=0; j<sg.skins.length; j++) {
        removeSkin( sg.skins[j].id );
      } 
      if (!sg.isBaseSegment) {
        removeSpan( sg.spCdP.id );  // segment downward (l to r) cross span to parent
        removeSpan( sg.spCuP.id );  // segment upward (l to r) cross span to parent
      }
      if ( sg.hasLeaves ) {
        removePoint( sg.ptLf1.id );  // segment leaf point 1 (leaf tip)
        removePoint( sg.ptLf2.id );  // segment leaf point 2 (leaf tip)  
        removeSpan( sg.spLf1.id );  // segment leaf 1 Span
        removeSpan( sg.spLf2.id );  // segment leaf 2 Span
      }
    }
    removeAllflowerPointsAndSpans( p );
    removePlant( p.id );
    plant.hasBeenRemoved = true;
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
  //rendering
  ctx.strokeStyle = "rgba( 0, 0, 0, "+seed.opacity+" )";
  ctx.fillStyle = "rgba( 73, 5, 51, "+seed.opacity+" )";
  ctx.lineWidth = "1";
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
  ctx.strokeStyle = "rgba("+s.clO.r+","+s.clO.g+","+s.clO.b+","+p.opacity+")";
  ctx.fillStyle = "rgba("+s.clL.r+","+s.clL.g+","+s.clL.b+","+p.opacity+")";
  //leaf top
  var ccpx = mpx + ( p2y - p1y ) * p.leafArcHeight;  // curve control point x
  var ccpy = mpy + ( p1x - p2x ) * p.leafArcHeight;  // curve control point y
  ctx.beginPath();
  ctx.moveTo(p1x,p1y);
  ctx.quadraticCurveTo(ccpx,ccpy,p2x,p2y);
  ctx.stroke();
  ctx.fill();
  //leaf bottom
  ccpx = mpx + ( p1y - p2y ) * p.leafArcHeight;  // curve control point x
  ccpy = mpy + ( p2x - p1x ) * p.leafArcHeight;  // curve control point y
  ctx.beginPath();
  ctx.moveTo(p1x,p1y);
  ctx.quadraticCurveTo(ccpx,ccpy,p2x,p2y);
  ctx.stroke();
  ctx.fill();
  //leaf center
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba("+s.clI.r+","+s.clI.g+","+s.clI.b+","+p.opacity+")";
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
  var p = plant;
  var sg = segment;
  for (var i=0; i<sg.skins.length; i++) {
    var sk = segment.skins[i];
    //fills
    ctx.beginPath();
    ctx.fillStyle = "rgba("+sg.clS.r+","+sg.clS.g+","+sg.clS.b+","+p.opacity+")";
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
    ctx.strokeStyle = "rgba("+sg.clO.r+","+sg.clO.g+","+sg.clO.b+","+p.opacity+")";
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
  if ( viewShadows ) { renderShadows(); }
}




////---TESTING---////

///seed initiation for testing
for ( var i=0; i<1; i++ ) {
  createSeed(null); 
}

///fast growth & fast seasons for testing
sunRayIntensity = 3;
spL = 2000; suL = 2000; faL = 2000; wiL = 2000;




////---DISPLAY---////

// createSeed(null);

function display() {
  renderBackground();
  runVerlet();
  if ( worldTime % worldSpeed === 0 ) { 
    trackSeasons();
    shedSunlight();
    growPlants(); 
  }
  renderPlants();
  if ( viewUI ) { renderUI(); }
  window.requestAnimationFrame(display);

                                                        ///TESTING  
                                                        if ( worldTime % 60 === 0 ) { 
                                                          // console.log();
                                                        }

}

createSunRays();
display();


