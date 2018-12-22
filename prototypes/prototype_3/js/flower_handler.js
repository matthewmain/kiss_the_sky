

///////// flower_handler.js /////////



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
  this.ageSinceBlooming = 0;  // flower age since blooming in worldtime units
  this.isFertilized = false;
  this.hasFullyClosed = false;
  this.hasSeeds = false;
  this.seedPodIsMature = false;
  this.podHasOpened = false;
  this.hasReleasedSeeds = false;
  //ovule points
  this.ptBL = basePoint1;  // base point left
  this.ptBR = basePoint2;  // base point right
  //hex (polinator pad) points
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

///creates a new flower
function createFlower( plant, parentSegment, basePoint1, basePoint2 ) {
  plant.flowerCount++;
  plant.flowers.push( new Flower( plant, parentSegment, basePoint1, basePoint2 ) );
  plant.hasFlowers = true;
  parentSegment.child = plant.flowers[plant.flowers.length-1];
  parentSegment.hasChild = true;
}

///checks whether a segment is ready to generate a flower
function readyForFlower( plant, segment ) {
  var segmentIsLastSegment = segment.id === plant.maxTotalSegments;
  var plantDoesNotHaveFlowers = !plant.hasFlowers;
  var segmentIsReadyForFlowerBud = segment.spF.l > plant.maxSegmentWidth*0.333;
  return segmentIsLastSegment && plantDoesNotHaveFlowers && segmentIsReadyForFlowerBud;
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
  if ( f.hasFullyBloomed ) { f.ageSinceBlooming++; } 
  //if bud is not fully grown and has enough energy for growth, it continues to grow until mature
  if ( !f.budHasFullyMatured && plant.energy > 0 ) {
    expandFlowerBud( p, f);
    f.budHasFullyMatured = flower.spHbM.l >= plant.maxSegmentWidth*plant.maxFlowerBaseWidth;
  //otherwise, if bud has not fully bloomed, it continues to bloom
  } else if ( f.budHasFullyMatured && !f.hasFullyBloomed && plant.energy > 0) {
    if ( f.bloomRatio < 1 ) { f.bloomRatio += 0.01; } else { f.hasFullyBloomed = true; }
    if ( f.hasFullyBloomed ) { f.isFertilized = true; }  
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
  //otherwise, if the pod has opened, the seeds haven't been released, and the plant is dead, release seeds
  } else if ( !f.hasReleasedSeeds ) {
    for ( var i=0; i<f.seeds.length; i++ ) { dropSeed( flower.seeds[i] ); }
    f.hasReleasedSeeds = true;
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
        ctx.fillStyle = "rgba("+f.clOv.r+","+f.clOv.g+","+f.clOv.b+","+f.clOv.a+")";  // dark green
        ctx.strokeStyle = "rgba("+f.clO.r+","+f.clO.g+","+f.clO.b+","+f.clO.a+")";  // dark brown
        ctx.moveTo(f.ptBL.cx, f.ptBL.cy);
        Tl.arcFromTo( f.ptBL, f.ptHoL, 0.1 );
        ctx.lineTo(f.ptHoR.cx, f.ptHoR.cy);
        Tl.arcFromTo( f.ptHoR, f.ptBR, 0.1 );
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













