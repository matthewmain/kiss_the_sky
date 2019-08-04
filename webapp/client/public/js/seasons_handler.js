

///////// SEASONS HANDLER /////////



///trackers
var currentYear = 1;
var yearTime = 0;
var currentSeason;

///season lengths
var spL = 1000;  // spring length (default; updated in trackSeasons() )
var suL = 1000;  // summer length (default; updated in trackSeasons() )
var faL = 500;  // fall length
var wiL = 500;  // winter length

///background gradient colors
var BgG = {
  sp: {  // spring
    cs1: { r: 244, g: 244, b: 244, a: 1 },  // color stop 1 ...
    cs2: { r: 242, g: 247, b: 250, a: 1 },
    cs3: { r: 240, g: 250, b: 255, a: 1 },
    cs4: { r: 167, g: 223, b: 255, a: 1 }
  },
  su: {  // summer
    cs1: { r: 251, g: 252, b: 244, a: 1 },
    cs2: { r: 128, g: 209, b: 255, a: 1 },
    cs3: { r: 112, g: 203, b: 255, a: 1 },
    cs4: { r: 167, g: 223, b: 255, a: 1 }
  },
  fa: {  // fall
    cs1: { r: 248, g: 232, b: 209, a: 1 },
    cs2: { r: 254, g: 248, b: 240, a: 1 },
    cs3: { r: 235, g: 247, b: 255, a: 1 },
    cs4: { r: 245, g: 250, b: 252, a: 1 }
  },
  wi: {  // winter
    cs1: { r: 29,  g: 25,  b: 20,  a: 1 },
    cs2: { r: 114, g: 105, b: 97,  a: 1 },
    cs3: { r: 163, g: 157, b: 150, a: 1 },
    cs4: { r: 180, g: 179, b: 179, a: 1 }
  }
};

///current and previous season background color stop collection objects
var csbg = BgG.sp;  // current season background
var psbg = BgG.sp;  // previous season background

///current color stop rgba objects
var ccs1 = psbg.cs1;  // current color stop 1
var ccs2 = psbg.cs2;  // current color stop 2
var ccs3 = psbg.cs3;  // current color stop 3
var ccs4 = psbg.cs4;  // current color stop 4


///tracks seasons
function trackSeasons() {
  yearTime++;
  // sets first year spring & summer lengths to ensure time for demo animation
  if ( currentYear === 1 && !ambientMode ) {  
    spL = 4500;
    suL = 3500;
  } else {
    spL = 1000;
  }
  //spring
  if ( yearTime === 1 ) {
    currentSeason = "Spring"; 
    photosynthesisRatio = 1; 
    livEnExp = 0.75;
    renderYearAnnouncement(); renderSeasonAnnouncement();
  //summer
  } else if ( yearTime === spL+1 ) {
    currentSeason = "Summer"; 
    photosynthesisRatio = 1; 
    livEnExp = 1;
    if ( currentYear > 1 || ambientMode ) { // adjusts summer length based on tallest plant's height
      suL = 85*currentGreatestMaxSegment() > 500 ? 85*currentGreatestMaxSegment() : 500;
    }
    scaleEliminationCursor();  // scales elimination cursor based on avg plant base width;
    renderSeasonAnnouncement();
  //fall
  } else if ( yearTime === spL+suL+1 ) {
    currentSeason = "Fall"; 
    photosynthesisRatio = 0; 
    livEnExp = 10;
    renderSeasonAnnouncement();
  //winter
  } else if ( yearTime === spL+suL+faL+1 ) {
    currentSeason = "Winter"; 
    photosynthesisRatio = 0; 
    livEnExp = 20;
    renderSeasonAnnouncement();
  }
  if ( yearTime >= spL+suL+faL+wiL ) {
    currentYear++;
    yearTime = 0;
  }
}

/// gets greatest of all current plants' maximum total segment count
function currentGreatestMaxSegment() {
  cgms = 0;  // current greatest max segments
  for ( i=0; i<plants.length; i++) {
    var p = plants[i];
    if (p.isAlive ) {
      cgms = p.maxTotalSegments > cgms ? p.maxTotalSegments : cgms;
    }
  }
  return cgms;
}

///renders seasons meter UI
function updateSeasonPieChart() {
  var dateDeg;  // degree corresponding to time of year on meter
  switch( currentSeason ) {  // marker position, calibrated different season lengths to uniform season arcs on meter
    case "Spring": dateDeg = yearTime*360 / spL; break;
    case "Summer": dateDeg = (yearTime-spL) * 360 / suL; break;
    case "Fall": dateDeg = (yearTime-spL-suL) * 360 / faL; break;
    case "Winter": dateDeg = (yearTime-spL-suL-faL) * 360 / wiL;
  }
  var pieValueAsDegree = dateDeg;
  var pieCircumference = 2*Math.PI*25;  // (svg circle radius is 25)
  var pieValue = pieCircumference*(pieValueAsDegree/360);
  document.querySelector("#pie_circle_left").style.strokeDasharray = pieValue + " " + pieCircumference;
  document.querySelector("#pie_circle_right").style.strokeDasharray = pieValue + " " + pieCircumference;
}

///renders background
function renderBackground() {
  switch( currentSeason ) {  // updates current and previous season
    case "Spring": csbg = BgG.sp; psbg = BgG.wi; break;
    case "Summer": csbg = BgG.su; psbg = BgG.sp; break;
    case "Fall": csbg = BgG.fa; psbg = BgG.su; break;
    case "Winter": csbg = BgG.wi; psbg = BgG.fa; break;
  }
  if ( currentYear === 1 && currentSeason === "Spring") {
    csbg = BgG.sp; psbg = BgG.sp;  // starts game off with full spring background, not in mid-transition from winter
  }
  if ( gameHasBegun ) {
    ccs1 = Tl.rgbaCs( psbg.cs1, csbg.cs1, ccs1, 200/renderFrequency );  // current color stop redshift
    ccs2 = Tl.rgbaCs( psbg.cs2, csbg.cs2, ccs2, 200/renderFrequency );  // current color stop greenshift
    ccs3 = Tl.rgbaCs( psbg.cs3, csbg.cs3, ccs3, 200/renderFrequency );  // current color stop blueshift
    ccs4 = Tl.rgbaCs( psbg.cs4, csbg.cs4, ccs4, 200/renderFrequency );  // current color stop alphashift
  }
  var grd=ctx.createLinearGradient( 0, 0, 0, canvas.height );
  grd.addColorStop( 0,
    "rgba("+ Math.round(ccs1.r)+","+
             Math.round(ccs1.g)+","+
             Math.round(ccs1.b)+","+
             Math.round(ccs1.a)+")");
  grd.addColorStop( 0.4,
    "rgba("+ Math.round(ccs2.r)+","+
             Math.round(ccs2.g)+","+
             Math.round(ccs2.b)+","+
             Math.round(ccs2.a)+")");
  grd.addColorStop( 0.6,
    "rgba("+ Math.round(ccs3.r)+","+
             Math.round(ccs3.g)+","+
             Math.round(ccs3.b)+","+
             Math.round(ccs3.a)+")");
  grd.addColorStop( 1,
    "rgba("+ Math.round(ccs4.r)+","+
             Math.round(ccs4.g)+","+
             Math.round(ccs4.b)+","+
             Math.round(ccs4.a)+")");
  ctx.fillStyle=grd;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

///renders year change announcements
function renderYearAnnouncement() {
  var fsi = 0;  // font size increase
  var lsi = 1;  // letter spacing increase
  var om = 1;  // opacity maximum
  var dur = 1800;  // duration (of each animation segment)
  var del = 0;  // delay
  if ( currentYear === 1 ) { del = 1000; }
  $("#year_announcement")
    .text("YEAR "+currentYear.toString().replace(/0/g,"O") )  // replace gets rid of Dosis font dotted zero
    .delay(del)
    .animate({
      fontSize: "+="+fsi+"pt",
      letterSpacing: "+="+lsi+"pt",
      opacity: om*0.5,
    }, dur, "linear" )
    .animate({
      fontSize: "+="+fsi+"pt",
      letterSpacing: "+="+lsi+"pt",
      opacity: om,
    }, dur, "linear" )
    .animate({
      fontSize: "+="+fsi+"pt",
      letterSpacing: "+="+lsi+"pt",
      opacity: 0,
    }, dur, "linear", function() {
      //callback resets original values
      $("#year_announcement").css({
        fontSize: "35pt",
        letterSpacing: "2.5pt"
      });
    }
  );
}

///renders new season announcement at change of seasons
function renderSeasonAnnouncement() {
  var fsi = 0;  // font size increase
  var lsi = 0.6;  // letter spacing increase
  var om = 1;  // opacity maximum
  var dur = 1200;  // duration (of each animation segment)
  var del = 0;  // delay
  if ( currentYear === 1 && yearTime === 1 ) { del = 5000; } else if ( yearTime === 1 ) { del = 4000; }
  $("#season_announcement").finish(); // clears the previous season announcement animation if it hasn't completed yet
  $("#season_announcement")
    .text(currentSeason.toUpperCase())
    .delay(del)
    .animate({
      fontSize: "+="+fsi+"pt",
      letterSpacing: "+="+lsi+"pt",
      opacity: om,
    }, dur, "linear" )
    .animate({
      fontSize: "+="+fsi+"pt",
      letterSpacing: "+="+lsi+"pt",
    }, dur, "linear" )
    .animate({
      fontSize: "+="+fsi+"pt",
      letterSpacing: "+="+lsi+"pt",
      opacity: 0,
    }, dur, "linear", function() {
      $("#season_announcement").css({  // resets original values
        fontSize: "16pt",
        letterSpacing: "1.25pt"
      });
      if ( currentYear === 1 && currentSeason === "Spring" ) readyForEliminationDemo = true;
      if ( currentYear === 1 && currentSeason === "Summer" ) readyForChangeDemo = true;
    });
}











