



///////////////////////////////////////////////////////////////// 
////////////     Plant Evolution App: Prototype 2     /////////// 
/////////////////////////////////////////////////////////////////

//https://github.com/matthewmain/plant_evolution_app/tree/master/prototypes/prototype_2



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
var oldAgeMarker = 10000;  // (age after flower bloom when plant starts dying of old age, in worldtime units)
var oldAgeRate = 0.001;  // (additional energy reduction per iteration after plant reaches old age)
var unhealthyEnergyLevelRatio = 0.075;  // ratio of maximum energy when plant becomes unhealthy (starts yellowing)
var flowerFadeEnergyLevelRatio = -0.025;  // ratio of maximum energy when flower begins to fade
var polinatorPadFadeEnergyLevelRatio = -0.075;  // ratio of maximum energy when polinator pad begins to fade
var sickEnergyLevelRatio = -0.2;  // ratio of maximum energy when plant becomes sick (starts darkening)
var podOpenEnergyLevelRatio = -0.5; // ratio of maximum energy when seed pod disperses seeds
var deathEnergyLevelRatio = -1;  // ratio of maximum energy when plant dies (fully darkened)
var collapseEnergyLevelRatio = -1.5;  // ratio of maximum energy when plant collapses




////---(TESTING)---////

// livEnExp = 2;
// energyStoreFactor = 25000;

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
  this.hasReachedOldAge = false;
  this.oldAgeReduction = 0;  // (energy reduction per plant iteration when plant is dying of old age)
  this.hasCollapsed = false;
  this.isActive = true;  // (inactive plants are rendered but ignored by all other local plant iterations)
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

///grows all plants
function growPlants() {
  for (var i=0; i<plants.length; i++) {
    var plant = plants[i];
    if ( plant.isActive ) {
      plant.age++;
      germinateSeedWhenReady( plant.sourceSeed );  // germinates a planted seed
      if ( plant.energy > plant.segmentCount*energyStoreFactor && plant.energy>plant.seedEnergy ) {
        plant.energy = plant.segmentCount*energyStoreFactor;  // caps plant max energy level based on segment count
      }
      if ( plant.hasFlowers ) { 
        for ( var j=0; j<plant.flowers.length; j++ ) {
          var flower = plant.flowers[j];
          developFlower( plant, flower );  
          if ( flower.ageSinceBlooming > oldAgeMarker ) {  // plant starts dying of old age (*remove later...)
            plant.hasReachedOldAge = true;
          } 
        }
      }
      if ( plant.energy > 0 || !restrictGrowthByEnergy && !plant.hasReachedOldAge ) { 
        for (var k=0; k<plant.segments.length; k++) { 
          var segment = plant.segments[k];
          if ( segment.spF.l < plant.maxSegmentWidth ) { 
            lengthenSegmentSpans( plant, segment ); 
            plant.energy -= segment.spCd.l * groEnExp;  // reduces energy by segment size
          }
          if ( readyForChildSegment( plant, segment ) ) { 
            createSegment( plant, segment, segment.ptE1, segment.ptE2 ); 
          }
          if ( !segment.hasLeaves ) { 
            generateLeavesWhenReady( plant, segment ); 
          } else {
            growLeaves( plant, segment ); 
            plant.energy -= ( segment.spLf1.l + segment.spLf2.l ) * groEnExp;  // reduces energy by leaf length
          }
          if ( !plant.hasFlowers && readyForFlower( plant, segment ) ) {
            createFlower( plant, segment, segment.ptE1, segment.ptE2 ); 
          }
        }
      }
      if ( plant.hasReachedOldAge ) {
        plant.oldAgeReduction += oldAgeRate;
        plant.energy -= plant.oldAgeReduction;  
      }
      if ( plant.sourceSeed.hasGerminated ) {
        plant.energy -= plant.segmentCount * livEnExp;  // cost of living: reduces energy by a ratio of segment count
      } 
      if ( plant.energy < plant.maxEnergyLevel*deathEnergyLevelRatio && restrictGrowthByEnergy ) {
        killPlant( plant );  // plant dies if energy level falls below minimum to be alive
      }
      if ( plant.energy < plant.maxEnergyLevel*collapseEnergyLevelRatio && restrictGrowthByEnergy ) {
        collapsePlant( plant );  // plant collapses if energy level falls below minimum to stay standing
        plant.isActive = false;  // removes plant from local plant iterations
      }
    }
  }
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
      removeSpan(f.spCuP.id);
      removeSpan(f.spCdP.id);
      removeSpan(f.spCu.id);
      removeSpan(f.spCu.id);
      removeSpan(f.spHcDB.id);
      removeSpan(f.spHcUB.id);
      removeSpan(f.spHcH.id);
      removeSpan(f.spBTSL.id);
      removeSpan(f.spBTSL.id);
    }
  }
  p.hasCollapsed = true; 
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


