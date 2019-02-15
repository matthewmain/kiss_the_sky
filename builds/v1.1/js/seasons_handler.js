

///////// SEASONS HANDLER /////////



///trackers
var currentYear = 1;
var yearTime = 0;
var currentSeason;
var currentGreatestMaxSegment;

///season lengths
var spL = 1000;  // spring length
var suL;  // summer length (updated ever year in trackSeasons() based on max plant segment count)
var faL = 200;  // fall length
var wiL = 300;  // winter length

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
    cs4: { r: 217, g: 241, b: 255, a: 1 }
  },
  fa: {  // fall
    cs1: { r: 255, g: 254, b: 249, a: 1 }, 
    cs2: { r: 250, g: 246, b: 240, a: 1 }, 
    cs3: { r: 235, g: 247, b: 255, a: 1 }, 
    cs4: { r: 248, g: 252, b: 255, a: 1 }
  },
  wi: {  // winter
    cs1: { r: 57, g: 51, b: 45, a: 1 }, 
    cs2: { r: 220, g: 215, b: 210, a: 1 }, 
    cs3: { r: 233, g: 229, b: 224, a: 1 }, 
    cs4: { r: 248, g: 252, b: 255, a: 1 }
  }
};

///current and previous season background color stop collection objects
var csbg = BgG.sp;  // current season background
var psbg = BgG.wi;  // previous season background

///current color stop rgba objects
var ccs1 = psbg.cs1;  // current color stop 1
var ccs2 = psbg.cs2;  // current color stop 2
var ccs3 = psbg.cs3;  // current color stop 3
var ccs4 = psbg.cs4;  // current color stop 4


///tracks seasons
function trackSeasons() {
  yearTime++;
  if ( yearTime === 1 ) { 
    currentSeason = "Spring"; photosynthesisRatio = 1; livEnExp = 0.75;
    renderYearAnnouncement(); renderSeasonAnnouncement(); 
  } else if ( yearTime === spL+1 ) {
    currentSeason = "Summer"; photosynthesisRatio = 1; livEnExp = 1;
    if ( currentYear === 1 ) {  // sets first year summer length to ensure enough time for demo animation
      suL = 800;
    } else { // adjusts summer length based on tallest plant's height
      suL = 85*currentGreatestMaxSegment() > 300 ? 85*currentGreatestMaxSegment() : 300; 
    }
    renderSeasonAnnouncement();
  } else if ( yearTime === spL+suL+1 ) {
    currentSeason = "Fall"; photosynthesisRatio = 0; livEnExp = 7;
    renderSeasonAnnouncement();
  } else if ( yearTime === spL+suL+faL+1 ) {
    currentSeason = "Winter"; photosynthesisRatio = 0; livEnExp = 10;
    renderSeasonAnnouncement();
  }
  if ( yearTime === spL+suL+faL+wiL) {
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
  if ( gameHasBegun ) {
    ccs1 = Tl.rgbaCs( psbg.cs1, csbg.cs1, ccs1, 200 );  // current color stop redshift 
    ccs2 = Tl.rgbaCs( psbg.cs2, csbg.cs2, ccs2, 200 );  // current color stop greenshift
    ccs3 = Tl.rgbaCs( psbg.cs3, csbg.cs3, ccs3, 200 );  // current color stop blueshift
    ccs4 = Tl.rgbaCs( psbg.cs4, csbg.cs4, ccs4, 200 );  // current color stop alphashift
  } else {
    ccs1 = BgG.sp.cs1;  // spring color stop redshift
    ccs2 = BgG.sp.cs2;  // spring color stop greenshift
    ccs3 = BgG.sp.cs3;  // spring color stop blueshift
    ccs4 = BgG.sp.cs4;  // spring color stop alphashift
  }
  var grd=ctx.createLinearGradient( 0, 0, 0, canvas.height );
  grd.addColorStop(0,"rgba("+ccs1.r+","+ccs1.g+","+ccs1.b+","+ccs1.a+")");
  grd.addColorStop(0.4,"rgba("+ccs2.r+","+ccs2.g+","+ccs2.b+","+ccs2.a+")");
  grd.addColorStop(0.6,"rgba("+ccs3.r+","+ccs3.g+","+ccs3.b+","+ccs3.a+")");
  grd.addColorStop(1,"rgba("+ccs4.r+","+ccs4.g+","+ccs4.b+","+ccs4.a+")");
  ctx.fillStyle=grd;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

///renders year change announcements 
function renderYearAnnouncement() {
  var fsi = 1.5;  // font size increase
  var lsi = 1.5;  // letter spacing increase
  var om = 1;  // opacity maximum
  var dur = 1800;  // duration (of each animation segment)
  var del = 0;  // delay  
  if ( currentYear === 1 ) { del = 1000; }
  $("#year_announcement")
    .text("YEAR "+currentYear.toString().replace(/0/g,"O") )  // replace gets rid of Nunito font dotted zero
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
  var fsi = 1.2;  // font size increase
  var lsi = 0.5;  // letter spacing increase
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
      if ( currentSeason === "Spring" && currentYear === 1 ) readyForEliminationDemo = true;
      if ( currentSeason === "Summer" && currentYear === 1 ) readyForChangeDemo = true;
    });
}









