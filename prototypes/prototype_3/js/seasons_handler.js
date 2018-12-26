

///////// SEASONS HANDLER /////////



var yearTime = 0;
var currentSeason;

///background gradient colors
var BgG = {
  sp: {  // spring
    cs1: { r: 244, g: 244, b: 244, a: 1 },  // color stop 1 ...
    cs2: { r: 242, g: 247, b: 250, a: 1 }, 
    cs3: { r: 240, g: 250, b: 255, a: 1 }, 
    cs4: { r: 225, g: 244, b: 255, a: 1 }
  },
  su: {  // summer
    cs1: { r: 251, g: 252, b: 244, a: 1 }, 
    cs2: { r: 176, g: 226, b: 255, a: 1 }, 
    cs3: { r: 176, g: 226, b: 255, a: 1 }, 
    cs4: { r: 163, g: 221, b: 255, a: 1 }
  },
  fa: {  // fall
    cs1: { r: 255, g: 254, b: 249, a: 1 }, 
    cs2: { r: 250, g: 246, b: 240, a: 1 }, 
    cs3: { r: 235, g: 247, b: 255, a: 1 }, 
    cs4: { r: 217, g: 241, b: 255, a: 1 }
  },
  wi: {  // winter
    cs1: { r: 214, g: 209, b: 204, a: 1 }, 
    cs2: { r: 220, g: 215, b: 210, a: 1 }, 
    cs3: { r: 233, g: 229, b: 224, a: 1 }, 
    cs4: { r: 248, g: 252, b: 255, a: 1 }
  }
}

///current and previous season background color stop collection objects
var csbg = BgG.sp;  // current season background
var psbg = BgG.wi;  // previous season background

///current color stop rgba objects
var ccs1 = psbg.cs1;  // current color stop 1
var ccs2 = psbg.cs2;  // current color stop 2
var ccs3 = psbg.cs3;  // current color stop 3
var ccs4 = psbg.cs4;  // current color stop 4

///season tracker
function trackSeasons() {
  yearTime++;
  if ( yearTime < 2000/*10000*/ ) {  //////////////////////////////////////////////////////////////////  XXXXXXXXXXX
    currentSeason = "spring";
  } else if ( yearTime < 4000/*50000*/ ) {
    currentSeason = "summer";
  } else if ( yearTime < 6000/*55000*/ ) {
    currentSeason = "fall";
  } else if ( yearTime < 8000/*60000*/ ) {
    currentSeason = "winter";
  } else {
    yearTime = 0;
  }
}

///renders background
function renderBackground() {
  switch( currentSeason ) {  // updates current and previous season backgrounds
    case "spring": csbg = BgG.sp; psbg = BgG.wi; break;
    case "summer": csbg = BgG.su; psbg = BgG.sp; break;
    case "fall": csbg = BgG.fa; psbg = BgG.su; break;
    case "winter": csbg = BgG.wi; psbg = BgG.fa; break;
  }
  ccs1 = Tl.rgbaCs( psbg.cs1, csbg.cs1, ccs1, 1000 );  // current color stop redshift  ////////////////// XXXXXXXXXXXX
  ccs2 = Tl.rgbaCs( psbg.cs2, csbg.cs2, ccs2, 1000 );  // current color stop greenshift
  ccs3 = Tl.rgbaCs( psbg.cs3, csbg.cs3, ccs3, 1000 );  // current color stop blueshift
  ccs4 = Tl.rgbaCs( psbg.cs4, csbg.cs4, ccs4, 1000 );  // current color stop alphashift
  var grd=ctx.createLinearGradient( 0, 0, 0, canvas.height );
  grd.addColorStop(0,"rgba("+ccs1.r+","+ccs1.g+","+ccs1.b+","+ccs1.a+")");
  grd.addColorStop(.4,"rgba("+ccs2.r+","+ccs2.g+","+ccs2.b+","+ccs2.a+")");
  grd.addColorStop(.6,"rgba("+ccs3.r+","+ccs3.g+","+ccs3.b+","+ccs3.a+")");
  grd.addColorStop(1,"rgba("+ccs4.r+","+ccs4.g+","+ccs4.b+","+ccs4.a+")");
  ctx.fillStyle=grd;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}












