



//////////////////////////  UI  //////////////////////////////




var headerDiv = document.getElementById("header_div");
var footerDiv = document.getElementById("footer_div");
var landingSvgRatio = $('#landing_svg_bg')[0].naturalHeight / $('#landing_svg_bg')[0].naturalWidth;

var mouseCanvasXPct;
var mouseCanvasYPct;

var sunShadeY = yValFromPct(8);  // sun shade elevation as canvas Y value
var sunShadeHandleRadiusPct = 1.75;  // sun shade handle radius as percentage of canvas width
var grabbedHandle = null;  // grabbed handle object (assigned when handle is clicked/touched)

var selectRadius = canvas.width*0.015;  // radius from cursor where point is detected (updated every summer)
var plantsAreBeingEliminated = false;

var gameDifficulty = "beginner";
var ambientMode = false;
var infoModalOpen = false;
var infoModalOpenWhilePaused = false;
var restartModalOpen = false;
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



/////---FUNCTIONS---/////


///scales landing to window
function scaleLanding() {
  $("#landing_content_div").css({ height: "80%", width: "80%" });
  $("#landing_svg_bg").css({ height: "100%", width: "100%" });
  if ( $("#landing_content_div").height() > $("#landing_content_div").width()*landingSvgRatio ) {
    $("#landing_svg_bg").height( $("#landing_content_div").width()*landingSvgRatio );
    $("#landing_content_div").height( $("#landing_svg_bg").height() );
  } else {
    $("#landing_svg_bg").width( $("#landing_content_div").height()/landingSvgRatio );
    $("#landing_content_div").width( $("#landing_svg_bg").width() );
  }
}

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
  scaleFooterContent();
}

///scales text content down for smaller window sizes
function scaleFooterContent() {
  if ( $("#canvas_container_div").width() < 230 ) {
    $(".footer_text").css({ fontSize: "4pt", top: "1px" });
    $("#pie_svg_left").css({ top: "7.4px" });
    $("#tag_content").css({ fontSize: "5pt", top: "12px" });
    $("#pie_svg_right").css({ top: "6.35px" });
    $("#hundred_pct_large_height_announcement").css({ fontSize: "15pt"});
    $(".game_win_text").css({ fontSize: "8pt"});
    $("#game_win_gen_number").css({ fontSize: "12pt"});
    $("#game_win_mode").css({ fontSize: "10pt"});
  } else if ( $("#canvas_container_div").width() < 300 ) {
    $(".footer_text").css({ fontSize: "7pt", top: "3px" });
    $("#pie_svg_left").css({ top: "7.4px" });
    $("#tag_content").css({ fontSize: "7pt", top: "15.5px" });
    $("#pie_svg_right").css({ top: "8.35px" });
    $("#hundred_pct_large_height_announcement").css({ fontSize: "20pt"});
    $(".game_win_text").css({ fontSize: "10pt"});
    $("#game_win_gen_number").css({ fontSize: "14pt"});
    $("#game_win_mode").css({ fontSize: "12pt"});
  } else if ( $("#canvas_container_div").width() < 400 ){ 
    $(".footer_text").css({ fontSize: "9pt", top: "7px" });
    $("#pie_svg_left").css({ top: "13.4px" });
    $("#tag_content").css({ fontSize: "8pt", top: "19.5px" });
    $("#pie_svg_right").css({ top: "12.35px" });
    $("#hundred_pct_large_height_announcement").css({ fontSize: "50pt"});
    $(".game_win_text").css({ fontSize: "12pt"});
    $("#game_win_gen_number").css({ fontSize: "16pt"});
    $("#game_win_mode").css({ fontSize: "15pt"});
  } else {  // > 400
    $(".footer_text").css({ fontSize: "9pt", top: "12px" });
    $("#pie_svg_left").css({ top: "18.4px" });
    $("#tag_content").css({ fontSize: "10pt", top: "24.5px" });
    $("#pie_svg_right").css({ top: "17.35px" });
    $("#hundred_pct_large_height_announcement").css({ fontSize: "80pt"});
    $(".game_win_text").css({ fontSize: "17pt"});
    $("#game_win_gen_number").css({ fontSize: "23pt"});
    $("#game_win_mode").css({ fontSize: "19pt"});
  }
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

///scales elimination cursor based on average plant width
function scaleEliminationCursor() {
  var baseWidthsSum = 0;
  var activePlantCount = 0;
  for ( var i=0; i<plants.length; i++ ) { 
    if ( plants[i].sourceSeed.hasGerminated && plants[i].isAlive ) { 
      baseWidthsSum += plants[i].spB.l; 
      activePlantCount++;
    } 
  }
  baseWidthAvg = baseWidthsSum/activePlantCount;
  selectRadius = baseWidthAvg*1.5 > canvas.width*0.015 ? baseWidthAvg*1.5 : canvas.width*0.015 ;
}



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
  if ( !ambientMode ) plantsAreBeingEliminated = true;
}

///deactivates plant elimination mode
function stopEliminatingPlants() {
  if ( !ambientMode ) plantsAreBeingEliminated = false;
}

///eliminates plants (kills them and knocks them over)
function eliminatePlants( e, plant ) {
  if ( !ambientMode ) {
    for ( var i=0; i<plants.length; i++ ) {
      var p = plants[i];
      if ( plantsAreBeingEliminated && ( p.isAlive || (!p.hasCollapsed && !p.hasBeenEliminatedByPlayer) ) ) {
        for ( var j=0; j<p.segments.length; j++) {
          var s = p.segments[j];
          var xDiffPct1 = pctFromXVal( s.ptE1.cx ) - mouseCanvasXPct;
          var yDiffPct1 = pctFromYVal( s.ptE1.cy ) - mouseCanvasYPct;
          var distancePct1 = Math.sqrt( xDiffPct1*xDiffPct1 + yDiffPct1*yDiffPct1 );  // distance from seg ext pt 1
          var xDiffPct2 = pctFromXVal( s.ptE2.cx ) - mouseCanvasXPct;
          var yDiffPct2 = pctFromYVal( s.ptE2.cy ) - mouseCanvasYPct;
          var distancePct2 = Math.sqrt( xDiffPct2*xDiffPct2 + yDiffPct2*yDiffPct2 );  // distance from seg ext pt 2
          var selectRadiusPct = selectRadius*100/canvas.width;
          if ( distancePct1 <= selectRadiusPct || distancePct2 <= selectRadiusPct ) {
            s.ptE1.px += distancePct1 > distancePct2 ? 10 : -10;  // impact burst effect
            p.energy = p.energy > energyStoreFactor*-1 ? energyStoreFactor*-1 : p.energy;  // drops plant energy
            killPlant(p);
            for (var k=0; k<p.segments.length; k++) {
              var s2 = p.segments[k];
              s2.ptE1.mass = s2.ptE2.mass = 15;  // increases plant mass for faster collapse
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



//// Rendering Functions ////


///renders eliminate plant icon at cursor location
function displayEliminatePlantIconWithCursor(e) {
  if ( !ambientMode ) { 
    var displayIcon = false;
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
          var distancePct2 = Math.sqrt( xDiffPct2*xDiffPct2 + yDiffPct2*yDiffPct2 );
          var selectRadiusPct = selectRadius*100/canvas.width;
          if ( distancePct1 <= selectRadiusPct*2 || distancePct2 <= selectRadiusPct*2 ) {
            displayIcon = true;
          }
        }
      }
    }
    if ( displayIcon ) {
      var xo = selectRadius*0.06;  // x offset
      var yo = selectRadius*0.1;  // y offset
      ctx.fillStyle = "rgba(232,73,0,0.5)";
      ctx.strokeStyle = "rgba(232,73,0,1)";
      //circle
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.arc( xValFromPct(mouseCanvasXPct), yValFromPct(mouseCanvasYPct-yo), selectRadius, 0, 2*Math.PI );
      ctx.fill();
      ctx.stroke();
      //bar
      ctx.beginPath();
      ctx.lineWidth = selectRadius*0.3;
      ctx.lineCap = "butt";
      ctx.moveTo( xValFromPct(mouseCanvasXPct-xo), yValFromPct(mouseCanvasYPct-yo) );
      ctx.lineTo( xValFromPct(mouseCanvasXPct+xo), yValFromPct(mouseCanvasYPct-yo) );
      ctx.fill();
      ctx.stroke();
    }
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




/////--- EVENT LISTENERS ---/////


///keeps UI elements scaled when window is resized (even when game is paused)
$(window).resize(function() {
  scaleLanding();
  updateUI();
});

///choose game mode on landing
$("#button_game_mode").click(function(){
  $("#landing_page_div").hide();
  $("#overlay_game_mode_options_div").css("visibility", "visible");
});

///choose ambient mode on landing
$("#button_ambient_mode").click(function(){
  $("#landing_page_div").hide();
  $("#overlay_ambient_mode_options_div").css("visibility", "visible");
  ambientMode = true;
  viewRedFlowerIndicator = false;
  omitRedFlowerFooterContent();
  $("#season_left, #pie_svg_left").css("display", "none");
  $("#ambient_footer_right").css("display", "block");
});

///select beginner on game options overlay
$("#option_beginner").click(function(){
  $("#option_beginner").css("opacity", "1");
  $("#option_intermediate").css("opacity", "0");
  $("#option_expert").css("opacity", "0");
  gameDifficulty = "beginner";
});

///select intermediate on game options overlay
$("#option_intermediate").click(function(){
  $("#option_beginner").css("opacity", "0");
  $("#option_intermediate").css("opacity", "1");
  $("#option_expert").css("opacity", "0");
  gameDifficulty = "intermediate";
});

///select expert on game options overlay
$("#option_expert").click(function(){
  $("#option_beginner").css("opacity", "0");
  $("#option_intermediate").css("opacity", "0");
  $("#option_expert").css("opacity", "1");
  gameDifficulty = "expert";
});

///select first option on ambient options overlay
$("#option_first").click(function(){
  $("#option_first").css("opacity", "1");
  $("#option_second").css("opacity", "0");
  $("#option_third").css("opacity", "0");
  gameDifficulty = "beginner";
});

///select second option on ambient options overlay
$("#option_second").click(function(){
  $("#option_first").css("opacity", "0");
  $("#option_second").css("opacity", "1");
  $("#option_third").css("opacity", "0");
  gameDifficulty = "intermediate";
});

///select third option on ambient options overlay
$("#option_third").click(function(){
  $("#option_first").css("opacity", "0");
  $("#option_second").css("opacity", "0");
  $("#option_third").css("opacity", "1");
  gameDifficulty = "expert";
});

///get game info on game options screen
$("#helper_game_info").click(function(){
  if ( $("#modal_card_game_screen").css("visibility") === "hidden" ) {
    $("#modal_card_game_screen").css("visibility", "visible");
    $("#modal_game_text").css("visibility", "visible");
    $("#icon_exit_modal_game_info").css("visibility", "visible");
  } else {
    removeModals();
  }
});

///get ambient mode info on ambient options screen
$("#helper_ambient_info").click(function(){
  if ( $("#modal_card_ambient_screen").css("visibility") === "hidden" ) {
    $("#modal_card_ambient_screen").css("visibility", "visible");
    $("#modal_ambient_text").css("visibility", "visible");
    $("#icon_exit_modal_ambient_info").css("visibility", "visible");
  } else {
    removeModals();
  }
});

///exit modal
$(".icon_exit_modal").click(function(){
  removeModals();
});

///on-screen play button (displayed when paused)
$("#modal_play").click(function(){
  resume();
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

///dark mode toggle icon (toggles dark/light modes)
$("#icon_dark_toggle").click(function() {
  if ( darkMode ) {
    $("body").css("background","#FFFFFF");
    $(".title_header_svg").attr("src","assets/title_header_light.svg");
    $("#icon_dark_toggle").css("transform","rotate(180deg)");
    $(".footer_text").css("color","#4A4A4A");
    $(".pie_circle").css("stroke","#4A4A4A");
    $(".pie_svg").css("background-color","rgba(213,216,197,1");
    darkMode = false;
  } else {
    $("body").css("background","#202020");
    $(".title_header_svg").attr("src","assets/title_header_dark.svg");
    $("#icon_dark_toggle").css("transform","rotate(0deg)");
    $(".footer_text, .pie_circle").css("color","#D5D8C5");
    $(".pie_circle").css("stroke","#D5D8C5");
    $(".pie_svg").css("background-color","rgba(213,216,197,.25");
    darkMode = true;
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
  downloadScreenshot();
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
    if ( !restartModalOpen ) {
      $("#modal_restart_div").css("visibility", "visible");
      restartModalOpen = true;
    } else {
      $("#modal_restart_div").css("visibility", "hidden");
      restartModalOpen = false;
    }
  }
});

///restart confirmation button
$("#button_restart_confirm_hover").click(function() {
  location.reload();
});

///restart cancel button
$("#button_restart_cancel_hover").click(function() {
  $("#modal_restart_div").css("visibility", "hidden");
  restartModalOpen = false;
});

///eliminate plants on a single click
document.addEventListener("click", function(e) { 
  startEliminatingPlants(); 
  eliminatePlants(e); 
  stopEliminatingPlants();
});

///game over try again button & game win play again buttons
$("#button_try_again_hover, .button_game_win_play_again").click(function(){
  location.reload();
});

///copyright
$("#this_year").text( new Date().getFullYear().toString().replace(/0/g,"O") );

///grabs/moves sun shade handle and eliminates plants on cursor drag
document.addEventListener("mousedown", function(e) { grabHandle(e); startEliminatingPlants(); });
document.addEventListener("mousemove", function(e) {  updateMouse(e); moveHandle(e); eliminatePlants(e); });
document.addEventListener("mouseup", function() {  dropHandle(); stopEliminatingPlants(); });
document.addEventListener("touchstart", function(e) { grabHandle(e); startEliminatingPlants(); });
document.addEventListener("touchmove", function(e) {  moveHandle(e); eliminatePlants(e); });
document.addEventListener("touchup", function() {  dropHandle(); stopEliminatingPlants(); });




/////---UPDATE---/////

scaleLanding();

///updates UI (runs every iteration)
function updateUI() {
  attachHeaderAndFooter();
  if ( useSunShades ) { renderSunShades(); }
  $("#year_count").text( currentYear.toString().replace(/0/g,"O") );  // replace gets rid of Nunito font dotted zero
  $("#season_left").text( ", " + currentSeason );
  $("#season_right").text( currentSeason );
  updateSeasonPieChart();
}


