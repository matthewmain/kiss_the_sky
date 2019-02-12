



//////////////////////////  UI  //////////////////////////////




var headerDiv = document.getElementById("header_div");
var footerDiv = document.getElementById("footer_div");

var mouseCanvasXPct;
var mouseCanvasYPct;

var sunShadeY = yValFromPct(8);  // sun shade elevation as canvas Y value
var sunShadeHandleRadiusPct = 1.75;  // sun shade handle radius as percentage of canvas width
var grabbedHandle = null;  // grabbed handle object (assigned when handle is clicked/touched)

var selectRadius = canvas.width*0.015; // radius from click/touch point within which an item is selected
var plantsAreBeingEliminated = false;

var gameDifficulty = "beginner";
var ambientMode = false;
var infoModalOpen = false;
var infoModalOpenWhilePaused = false;
var endOfGameAnnouncementDisplayed = false;




/////---OBJECTS---/////


///sun shade handle constructor
function SunShadeHandle( xPositionPct ) {
  this.x = xValFromPct(xPositionPct); 
  this.y = sunShadeY;
}

///sun shade constructor
function SunShade( handle1, handle2 ) {
  this.h1 = handle1;
  this.h2 = handle2; 
}

var HeightMarker = {
  w: canvas.width*0.025,  // marker width 
  h: canvas.width*0.025,  // marker height
  y: canvas.height,  // marker position y value (at point)
  chfx: null,  // current highest flower x value
  baa: false,  // bounce animation active
  bat: 0,  // bounce animation time
  laa: false,  // line animation active
  lat: 0,  // line animation time
};



/////---FUNCTIONS---/////


///attaches header and footer to canvas (after canvas has been resized to window dimensions in verlet.js)
function attachHeaderAndFooter() {
  var canvasHeight = parseFloat(canvasContainerDiv.style.height);
  var canvasTop = canvasContainerDiv.offsetTop - canvasHeight/2;
  headerDiv.style.width = canvasContainerDiv.style.width;
  headerDiv.style.height = canvasHeight*0.15+"px";
  headerDiv.style.top = canvasTop-parseFloat(headerDiv.style.height)+"px";
  footerDiv.style.width = canvasContainerDiv.style.width;
  footerDiv.style.height = canvasHeight*0.075+"px";
  footerDiv.style.top = canvasTop+canvasHeight+"px";
}

///creates a new sun shade handle
function createSunShadeHandle( xPositionPct ) {
  sunShadeHandles.push( new SunShadeHandle( xPositionPct ) );
  sunShadeHandleCount++;
  return sunShadeHandles[sunShadeHandles.length-1];
}

///creates a new sun shade
function createSunShade( handle1XPct, handle2XPct ) {
  var handle1 = createSunShadeHandle( handle1XPct );
  var handle2 = createSunShadeHandle( handle2XPct );
  sunShades.push ( new SunShade( handle1, handle2 ) );
  sunShadeCount++;
  return sunShades[sunShades.length-1];
}

///places sun shade
function placeSunShades( leftCount, rightCount ) {
  for ( var i=0; i<leftCount; i++ ) { createSunShade( 0, 0 ); }
  for ( var j=0; j<rightCount; j++ ) { createSunShade( 100, 100 ); }
}

///checks for game over (whether all plants have died) displays game over overlay and try again button
function checkForGameOver( plants ) {
  if ( yearTime === spL + suL + faL + wiL/2 ) {
    var allDead = true;
    for ( var i=0; i<plants.length; i++ ) {
      if ( plants[i].isAlive ) { allDead = false; }
    }
    if ( allDead ) {
      $("#season_announcement").finish();
      $("#game_over_div").css( "visibility", "visible" ).animate({ opacity: 1 }, 3000, "linear" );
      endOfGameAnnouncementDisplayed = true;
      pause();
    }
  }
}




/////---RENDERING---/////


///renders eliminate plant icon at cursor location
function displayEliminatePlantIconWithCursor(e) {
  var displayIcon = false;
  //canvas.style.cursor = "default";
  for ( var i=0; i<plants.length; i++ ) {
    var p = plants[i];
    if ( p.isAlive || (!p.hasCollapsed && !p.hasBeenEliminatedByPlayer) ) {
      for ( var j=0; j<p.segments.length; j++) {
        var s = p.segments[j];
        var xDiffPct1 = pctFromXVal( s.ptE1.cx ) - mouseCanvasXPct;
        var yDiffPct1 = pctFromYVal( s.ptE1.cy ) - mouseCanvasYPct;
        var distancePct1 = Math.sqrt( xDiffPct1*xDiffPct1 + yDiffPct1*yDiffPct1 );
        var xDiffPct2 = pctFromXVal( s.ptE2.cx ) - mouseCanvasXPct;
        var yDiffPct2 = pctFromYVal( s.ptE2.cy ) - mouseCanvasYPct;
        var selectRadiusPct = selectRadius*100/canvas.width;
        var distancePct2 = Math.sqrt( xDiffPct2*xDiffPct2 + yDiffPct2*yDiffPct2 );
        if ( distancePct1 <= selectRadiusPct*2 || distancePct2 <= selectRadiusPct*2 ) {
          displayIcon = true;
        }
      }
    }
  }
  if ( displayIcon ) {
    ctx.fillStyle = "rgba(232,73,0,0.5)";
    ctx.strokeStyle = "rgba(232,73,0,1)";
    //circle
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.arc( xValFromPct(mouseCanvasXPct), yValFromPct(mouseCanvasYPct-0.5), selectRadius*1.3, 0, 2*Math.PI );
    ctx.fill();
    ctx.stroke();
    //bar
    ctx.beginPath();
    ctx.lineWidth = 6;
    ctx.lineCap = "butt";
    ctx.moveTo( xValFromPct(mouseCanvasXPct-1.1), yValFromPct(mouseCanvasYPct-0.5) );
    ctx.lineTo( xValFromPct(mouseCanvasXPct+1.1), yValFromPct(mouseCanvasYPct-0.5) );
    ctx.fill();
    ctx.stroke();
  }
}
///renders markers that track the highest red flower height so far
function renderHeightMarker() {
  var hrfy = canvas.height - yValFromPct( highestRedFlowerPct );  // highest red flower y value currently
  var chmp = 100-pctFromYVal(HeightMarker.y);  // current height marker percentage
  if ( Math.floor( highestRedFlowerPct ) > Math.floor(chmp) ) {   // initializes animations if new highest red flower
    HeightMarker.y = hrfy;  // y value
    HeightMarker.baa = true;  // bounce animation active
    HeightMarker.bat = 0;  // bounce animation time elapsed
    HeightMarker.laa = true;  // line animation active
    HeightMarker.lat = 0;  // line animation time elapsed
    renderHeightAnnouncement();
  }
  //new highest height marker bounce animation (size expansion & contraction)
  if ( HeightMarker.baa ) {  
    HeightMarker.bat++;
    var a = -0.12;  // corresponds to animation duration ( higher value is longer duration; 0 is infinite)
    var b = 2;  // extent of expansion ( higher value is greater expansion )
    var x = HeightMarker.bat; 
    var y = a*Math.pow(x,2) + b*x;  // current marker expansion extent (quadratic formula; y = ax^2 + bx + c)
    HeightMarker.w = canvas.width*0.025 + y;
    if ( y <= 0 ) { HeightMarker.baa = false; HeightMarker.bat = 0; }
  }
  //new highest height line animation
  if ( HeightMarker.laa ) {  
    HeightMarker.lat++;
    var lad = 40;  // line animation duration
    var o = 1 - HeightMarker.lat/lad;  // opacity
    ctx.beginPath();
    ctx.lineWidth = 2;
    var lGrad = ctx.createLinearGradient( HeightMarker.chfx-canvas.width, HeightMarker.y, HeightMarker.chfx+canvas.width, HeightMarker.y );
    lGrad.addColorStop("0", "rgba( 161, 0, 0, 0 )");
    lGrad.addColorStop("0.4", "rgba( 161, 0, 0, " + 0.3*o + ")");
    lGrad.addColorStop("0.5", "rgba( 161, 0, 0, " + 1*o + ")");
    lGrad.addColorStop("0.6", "rgba( 161, 0, 0, " +0.3*o + ")");
    lGrad.addColorStop("1", "rgba( 161, 0, 0, 0 )");
    ctx.strokeStyle = lGrad;
    ctx.moveTo( HeightMarker.chfx-canvas.width, HeightMarker.y );
    ctx.lineTo( HeightMarker.chfx+canvas.width, HeightMarker.y );
    ctx.stroke();
    if ( HeightMarker.lat > lad ) { HeightMarker.laa = false; HeightMarker.lat = 0; }
  }
  //draws marker
  if ( highestRedFlowerPct > 0 ) {  
    ctx.beginPath();  // top triangle
    ctx.fillStyle = "#D32100";
    ctx.moveTo( canvas.width, HeightMarker.y );  
    ctx.lineTo( canvas.width, HeightMarker.y - HeightMarker.h/2 ); 
    ctx.lineTo( canvas.width-HeightMarker.w, HeightMarker.y ); 
    ctx.fill();  
    ctx.beginPath();  // bottom triangle
    ctx.fillStyle = "#A10000";
    ctx.moveTo( canvas.width, HeightMarker.y );  
    ctx.lineTo( canvas.width, HeightMarker.y + HeightMarker.h/2 ); 
    ctx.lineTo( canvas.width-HeightMarker.w, HeightMarker.y ); 
    ctx.fill();
  }
}

///renders sun shades
function renderSunShades() {
  var y = sunShadeY;  // sun shade y value
  var r = xValFromPct( sunShadeHandleRadiusPct );  // handle radius
  var c = "#111111";  // color
  for ( var i=0; i<sunShades.length; i++ ) {
    var s = sunShades[i];
    //shadow
    if ( viewShadows ) {
      ctx.fillStyle = "rgba( 0, 0, 0, 0.333 )";
      ctx.beginPath();
      ctx.moveTo( s.h1.x, y );
      ctx.lineTo( s.h2.x, y ); 
      ctx.lineTo( s.h2.x, yValFromPct(100) );
      ctx.lineTo( s.h1.x, yValFromPct(100) );
      ctx.fill();  
    }
    //line
    ctx.beginPath();
    ctx.lineWidth = xValFromPct( sunShadeHandleRadiusPct*0.75 );
    ctx.strokeStyle = c;
    ctx.moveTo(s.h1.x,y);
    ctx.lineTo(s.h2.x,y);
    ctx.stroke();
    //handles
    for ( var j=1; j<=2; j++) {
      var hx = s["h"+j].x;
      if ( hx === 0 || hx === canvas.width ) {
        //tab (outer circle)
        ctx.beginPath();
        ctx.fillStyle = c;
        ctx.arc( hx, y, r*1.1, 0, 2*Math.PI );
        ctx.fill();
        ctx.beginPath();
        //arrow (diamond)
        ctx.fillStyle = "rgba( 213, 215, 197, 0.5 )";
        ctx.moveTo( hx, y-r*0.5 );
        ctx.lineTo( hx+r*0.7, y );
        ctx.lineTo( hx, y+r*0.5 );
        ctx.lineTo( hx-r*0.7, y );
        ctx.fill();
      } else {
        //outer circle
        ctx.beginPath();
        ctx.fillStyle = c;
        ctx.arc( hx, y, r, 0, 2*Math.PI );
        ctx.fill();
        ctx.beginPath();
        //inner circle
        ctx.fillStyle = "rgba( 213, 215, 197, 0.15 )";
        ctx.arc( hx, y, r*0.666, 0, 2*Math.PI );
        ctx.fill();
      }
    }
  }
}




/////---INTERACTION---/////


//// Event Functions ////

///updates mouse position coordinates as percentages
function updateMouse(e) {
  var canvasWidthOnScreen = parseFloat(canvasContainerDiv.style.width);
  var canvasHeightOnScreen = parseFloat(canvasContainerDiv.style.height);
  mouseCanvasXPct = (e.pageX-canvasPositionLeft)*100/canvasWidthOnScreen;  // mouse canvas x percent
  mouseCanvasYPct = (e.pageY-canvasPositionTop)*100/canvasHeightOnScreen;  // mouse canvas y percent
}

///grabs handle
function grabHandle(e) {
  for ( var i=0; i<sunShadeHandles.length; i++ ) {
    var h = sunShadeHandles[i];
    var xDiffPct = pctFromXVal( h.x ) - mouseCanvasXPct;
    var yDiffPct = pctFromYVal( h.y ) - mouseCanvasYPct;
    var distancePct = Math.sqrt( xDiffPct*xDiffPct + yDiffPct*yDiffPct );
    if ( distancePct <= sunShadeHandleRadiusPct ) {
      grabbedHandle = h;
    }
  }
}

///moves handle
function moveHandle(e) {
  if ( grabbedHandle ) {
    if ( mouseCanvasXPct < 0 ) {
      grabbedHandle.x = 0;
    } else if ( mouseCanvasXPct > 100 ) {
      grabbedHandle.x = xValFromPct( 100 );
    } else {
      grabbedHandle.x = xValFromPct( mouseCanvasXPct );
    }
  }
}

///drops handle
function dropHandle() {
  grabbedHandle = null;
}

///activates plant elimination mode
function startEliminatingPlants() {
  plantsAreBeingEliminated = true;
}

///deactivates plant elimination mode
function stopEliminatingPlants() {
  plantsAreBeingEliminated = false;
}

///eliminates plants (kills them and knocks them over)
function eliminatePlants( e, plant ) {
  for ( var i=0; i<plants.length; i++ ) {
    var p = plants[i];
    if ( plantsAreBeingEliminated && ( p.isAlive || (!p.hasCollapsed && !p.hasBeenEliminatedByPlayer) ) ) {
      for ( var j=0; j<p.segments.length; j++) {
        var s = p.segments[j];
        var xDiffPct1 = pctFromXVal( s.ptE1.cx ) - mouseCanvasXPct;
        var yDiffPct1 = pctFromYVal( s.ptE1.cy ) - mouseCanvasYPct;
        var distancePct1 = Math.sqrt( xDiffPct1*xDiffPct1 + yDiffPct1*yDiffPct1 );
        var xDiffPct2 = pctFromXVal( s.ptE2.cx ) - mouseCanvasXPct;
        var yDiffPct2 = pctFromYVal( s.ptE2.cy ) - mouseCanvasYPct;
        var selectRadiusPct = selectRadius*100/canvas.width;
        var distancePct2 = Math.sqrt( xDiffPct2*xDiffPct2 + yDiffPct2*yDiffPct2 );
        if ( distancePct1 <= selectRadiusPct || distancePct2 <= selectRadiusPct ) {
          s.ptE1.px += distancePct1 > distancePct2 ? 10 : -10;
          p.energy = p.energy > energyStoreFactor*-1 ? energyStoreFactor*-1 : p.energy; 
          killPlant(p);
          for (var k=0; k<p.segments.length; k++) {
            var s2 = p.segments[k];
            s2.ptE1.mass = s2.ptE2.mass = 15;
            if (!s2.isBaseSegment) {
              removeSpan(s2.spCdP.id);  // downward (l to r) cross span to parent
              removeSpan(s2.spCuP.id);  // upward (l to r) cross span to parent
            }
            removeSpan(s2.spCd.id);  // downward (l to r) cross span
            removeSpan(s2.spCu.id);  // upward (l to r) cross span
          }
          p.hasBeenEliminatedByPlayer = true;
        }
      }
    }
  }
}

///pause game
function pause() {
  document.getElementById("icon_pause").style.visibility = "hidden";
  document.getElementById("icon_play").style.visibility = "visible";
  gamePaused = true;
}

///resume game
function resume() {
  if ( !endOfGameAnnouncementDisplayed ) {
    document.getElementById("icon_pause").style.visibility = "visible";
    document.getElementById("icon_play").style.visibility = "hidden";
    document.getElementById("modal_play").style.visibility = "hidden";
    gamePaused = false;
    display();
  }
}

///remove modals
function removeModals() {
  $(".modal_card_options_screens").css("visibility", "hidden");
  $(".modal_options_text").css("visibility", "hidden");
  $("#modal_card_gameplay_screen").css("visibility", "hidden");
  $("#modal_card_gameplay_screen_inner_div").css("visibility", "hidden");
  $(".modal_gameplay_screen_text").css("visibility", "hidden");
  $(".icon_exit_modal").css("visibility", "hidden");
  infoModalOpen = false;
  if ( !infoModalOpenWhilePaused ) { resume(); }
  infoModalOpenWhilePaused = false;
}

function omitRedFlowerFooterContent() {
  $("#height_text, #tag_div, #tag_svg, #tag_content, #percent").css("visibility", "hidden");
}


//// Listeners ////

//keeps UI elements scaled when window is resized (even when game is paused)
$(window).resize(function() {
  updateUI();
});

//choose game mode on landing
$("#button_game_mode_hover").click(function(){
  $("#landing_page_div").hide();
  $("#overlay_game_mode_options_div").css("visibility", "visible");
});

//choose ambient mode on landing
$("#button_ambient_mode_hover").click(function(){
  $("#landing_page_div").hide();
  $("#overlay_ambient_mode_options_div").css("visibility", "visible");
  ambientMode = true;
  viewRedFlowerIndicator = false;
  omitRedFlowerFooterContent();
  $("#season_left, #pie_svg_left").css("display", "none");
  $("#ambient_footer_right").css("display", "block");
});

//select beginner on game options overlay
$("#option_beginner").click(function(){
  $("#option_beginner").css("opacity", "1");
  $("#option_intermediate").css("opacity", "0");
  $("#option_expert").css("opacity", "0");
  gameDifficulty = "beginner";
});

//select intermediate on game options overlay
$("#option_intermediate").click(function(){
  $("#option_beginner").css("opacity", "0");
  $("#option_intermediate").css("opacity", "1");
  $("#option_expert").css("opacity", "0");
  gameDifficulty = "intermediate";
});

//select expert on game options overlay
$("#option_expert").click(function(){
  $("#option_beginner").css("opacity", "0");
  $("#option_intermediate").css("opacity", "0");
  $("#option_expert").css("opacity", "1");
  gameDifficulty = "expert";
});

//select first option on ambient options overlay
$("#option_first").click(function(){
  $("#option_first").css("opacity", "1");
  $("#option_second").css("opacity", "0");
  $("#option_third").css("opacity", "0");
  gameDifficulty = "beginner";
});

//select second option on ambient options overlay
$("#option_second").click(function(){
  $("#option_first").css("opacity", "0");
  $("#option_second").css("opacity", "1");
  $("#option_third").css("opacity", "0");
  gameDifficulty = "intermediate";
});

//select third option on ambient options overlay
$("#option_third").click(function(){
  $("#option_first").css("opacity", "0");
  $("#option_second").css("opacity", "0");
  $("#option_third").css("opacity", "1");
  gameDifficulty = "expert";
});

//get game info on game options screen
$("#helper_game_info").click(function(){
  $("#modal_card_game_screen").css("visibility", "visible");
  $("#modal_game_text").css("visibility", "visible");
  $("#icon_exit_modal_game_info").css("visibility", "visible");
});

//get ambient mode info on ambient options screen
$("#helper_ambient_info").click(function(){
  $("#modal_card_ambient_screen").css("visibility", "visible");
  $("#modal_ambient_text").css("visibility", "visible");
  $("#icon_exit_modal_ambient_info").css("visibility", "visible");
});

//exit modal
$(".icon_exit_modal").click(function(){
  removeModals();
});

//on-screen play button (displayed when paused)
$("#modal_play").click(function(){
  resume();
});

// try again button (displayed at game over)
$("#button_try_again_hover").click(function(){
  location.reload();
});

///activates game when "sow" button is clicked
$(".button_sow").click(function(){
  switch( gameDifficulty ) {
    case "beginner":
      for ( var i=0; i<15; i++ ) { createSeed( null, generateRandomRedFlowerPlantGenotype() ); } 
      break;
    case "intermediate":
      for ( var j=0; j<20; j++ ) { createSeed( null, generateRandomNewPlantGenotype() ); }
      for ( var k=0; k<5; k++ ) { createSeed( null, generateRandomRedFlowerPlantGenotype() ); }
      break;
    case "expert":
      for ( var l=0; l<1; l++ ) { createSeed( null, generateTinyWhiteFlowerPlantGenotype() ); }
  }
  for ( var m=0; m<seeds.length; m++ ) { scatterSeed( seeds[m] ); }
  $("#overlay_game_mode_options_div, #overlay_ambient_mode_options_div").fadeOut(500, function(){ 
    $(".icon").fadeIn(5000);
    $("#footer_div").fadeIn(5000);
  });
  gameHasBegun = true;
});

///info icon (toggles info modal)
$("#icon_info").click(function() {
  if ( !infoModalOpen ) {
    $("#modal_card_gameplay_screen").css("visibility", "visible");
    $("#modal_card_gameplay_screen_inner_div").scrollTop(0).css("visibility", "visible");
    $(".modal_gameplay_screen_text").css("visibility", "visible");
    $("#icon_exit_modal_gameplay_info").css("visibility", "visible");
    infoModalOpen = true;
    if ( gamePaused ) { infoModalOpenWhilePaused = true; }
    pause();
  } else {
    removeModals();
  }
});

///shadows icon (toggles shadows)
$(".icon_shadows").click(function(){
  if ( viewShadows === true ) {
    $("#icon_shadows_on").css("visibility", "hidden");
    $("#icon_shadows_off").css("visibility", "visible");
    viewShadows = false;
  } else {
    $("#icon_shadows_on").css("visibility", "visible");
    $("#icon_shadows_off").css("visibility", "hidden");
    viewShadows = true;
  }
  if ( gamePaused ) { clearCanvas(); renderBackground(); renderPlants(); }
});

///camera icon (takes a screenshot)
$("#save").click(function(){
  var image = canvas.toDataURL("image/png");
  console.log(image);
  var download = document.getElementById("save");
  download.href = image;
  var seasonTitleCase = currentSeason.charAt(0).toUpperCase()+currentSeason.slice(1);
  download.download = "Kiss the Sky - Year "+currentYear+", "+seasonTitleCase+".png";
});

///pause/resume icons
$(".icon_game_run").click(function(){
  if ( !gamePaused ) { 
    pause(); 
    $("#modal_play").css("visibility", "visible");
  } else { 
    removeModals();  // removes any modals if visible
    resume(); 
  }
});

///restart icon (restarts and returns to landing screen)
$("#icon_restart").click(function() {
  if ( !gameHasBegun ) {
    location.reload();
  } else {
    $("#modal_restart_div").css("visibility", "visible");
  }
});

///restart confirmation button
$("#button_restart_confirm_hover").click(function() {
  location.reload();
});

///restart cancel button
$("#button_restart_cancel_hover").click(function() {
  $("#modal_restart_div").css("visibility", "hidden");
});

///eliminate plants on a single click
document.addEventListener("click", function(e) { 
  startEliminatingPlants(); 
  eliminatePlants(e); 
  stopEliminatingPlants();
});

///grabs/moves sun shade handle and eliminates plants on cursor drag
document.addEventListener("mousedown", function(e) { grabHandle(e); startEliminatingPlants(); });
document.addEventListener("mousemove", function(e) {  updateMouse(e); moveHandle(e); eliminatePlants(e); });
document.addEventListener("mouseup", function() {  dropHandle(); stopEliminatingPlants(); });
document.addEventListener("touchstart", function(e) { grabHandle(e); startEliminatingPlants(); });
document.addEventListener("touchmove", function(e) {  moveHandle(e); eliminatePlants(e); });
document.addEventListener("touchup", function() {  dropHandle(); stopEliminatingPlants(); });




/////---UPDATE---/////

///updates UI (runs every iteration)
function updateUI() {
  attachHeaderAndFooter();
  if ( useSunShades ) { renderSunShades(); }
  $("#year_count").text( currentYear.toString().replace(/0/g,"O") );  // replace gets rid of Nunito font dotted zero
  $("#season_left").text( ", " + currentSeason );
  $("#season_right").text( currentSeason );
  updateSeasonPieChart();
  if ( !ambientMode ) { 
    renderHeightMarker(); 
    displayEliminatePlantIconWithCursor();
    $("#height_number").text( Math.floor( highestRedFlowerPct ) );
  }
}





